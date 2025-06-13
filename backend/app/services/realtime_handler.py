import asyncio
from datetime import datetime
import json
from typing import Any

import websockets

from app.config import settings
from app.database import AsyncSessionLocal
from app.models import Conversation

COACHING_PROMPT = """
You are a warm, empathetic coach helping users reflect on their day.
- Listen actively and ask thoughtful follow-up questions
- Help users discover their values and patterns
- Keep the conversation natural and supportive
- End gracefully at the 5-minute mark
- Focus on emotions, motivations, and personal growth
- Speak in Japanese (日本語) if the user speaks in Japanese
"""


class RealtimeConversationHandler:
    """OpenAI Realtime APIとの会話を管理するハンドラー"""

    def __init__(self, client_ws, session_token: str, conversation_id: str, user_id: str):
        self.client_ws = client_ws
        self.session_token = session_token
        self.conversation_id = conversation_id
        self.user_id = user_id
        self.openai_ws: websockets.WebSocketClientProtocol | None = None
        self.transcript: list[dict[str, Any]] = []
        self.start_time = datetime.utcnow()
        self.end_timer: asyncio.Task | None = None

    async def initialize(self):
        """OpenAI Realtime APIとの接続を初期化"""
        try:
            # OpenAI WebSocket接続
            self.openai_ws = await websockets.connect(
                "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
                extra_headers={"Authorization": f"Bearer {settings.openai_api_key}", "OpenAI-Beta": "realtime=v1"},
            )

            # セッション設定を送信
            await self.openai_ws.send(
                json.dumps(
                    {
                        "type": "session.update",
                        "session": {
                            "modalities": ["text", "audio"],
                            "instructions": COACHING_PROMPT,
                            "voice": "alloy",
                            "input_audio_format": "pcm16",
                            "output_audio_format": "pcm16",
                            "input_audio_transcription": {"model": "whisper-1"},
                            "turn_detection": {
                                "type": "server_vad",
                                "threshold": 0.5,
                                "prefix_padding_ms": 300,
                                "silence_duration_ms": 500,
                            },
                        },
                    }
                )
            )

            # 初回の挨拶を送信
            await self.openai_ws.send(
                json.dumps(
                    {
                        "type": "response.create",
                        "response": {
                            "modalities": ["text", "audio"],
                            "instructions": "Greet the user warmly and ask them how their day was. If they speak Japanese, respond in Japanese.",
                        },
                    }
                )
            )

            # 5分タイマーを設定
            self.end_timer = asyncio.create_task(self._auto_end_conversation())

            # OpenAIからの応答を処理するタスクを開始
            asyncio.create_task(self._handle_openai_responses())

        except Exception as e:
            print(f"Failed to initialize conversation: {e}")
            await self.client_ws.send_json(
                {
                    "type": "error",
                    "data": {"message": "Failed to initialize conversation"},
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )
            raise

    async def handle_client_audio(self, audio_data: str):
        """クライアントからの音声データを処理"""
        if not self.openai_ws:
            return

        try:
            # OpenAIに音声データを転送
            await self.openai_ws.send(json.dumps({"type": "input_audio_buffer.append", "audio": audio_data}))
        except Exception as e:
            print(f"Error sending audio to OpenAI: {e}")

    async def _handle_openai_responses(self):
        """OpenAIからの応答を処理"""
        if not self.openai_ws:
            return

        try:
            async for message in self.openai_ws:
                data = json.loads(message)

                # ユーザーの発話が転写された
                if data.get("type") == "conversation.item.input_audio_transcription.completed":
                    transcript_text = data.get("transcript", "")
                    self.transcript.append(
                        {"speaker": "user", "text": transcript_text, "timestamp": datetime.utcnow().isoformat()}
                    )

                    # クライアントに転写を送信
                    await self.client_ws.send_json(
                        {
                            "type": "transcript",
                            "data": {"speaker": "user", "text": transcript_text},
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    )

                # AIの応答が転写された
                elif data.get("type") == "response.audio_transcript.done":
                    transcript_text = data.get("transcript", "")
                    self.transcript.append(
                        {"speaker": "ai", "text": transcript_text, "timestamp": datetime.utcnow().isoformat()}
                    )

                    # クライアントに転写を送信
                    await self.client_ws.send_json(
                        {
                            "type": "transcript",
                            "data": {"speaker": "ai", "text": transcript_text},
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    )

                # AIの音声応答チャンク
                elif data.get("type") == "response.audio.delta":
                    audio_delta = data.get("delta")
                    if audio_delta:
                        # クライアントに音声を転送
                        await self.client_ws.send_json(
                            {
                                "type": "ai_response",
                                "data": {"audio": audio_delta, "format": "pcm16"},
                                "timestamp": datetime.utcnow().isoformat(),
                            }
                        )

                # エラー
                elif data.get("type") == "error":
                    error_message = data.get("error", {}).get("message", "Unknown error")
                    print(f"OpenAI error: {error_message}")
                    await self.client_ws.send_json(
                        {
                            "type": "error",
                            "data": {"message": error_message},
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                    )

        except websockets.exceptions.ConnectionClosed:
            print("OpenAI WebSocket connection closed")
        except Exception as e:
            print(f"Error handling OpenAI response: {e}")

    async def _auto_end_conversation(self):
        """5分後に自動的に会話を終了"""
        await asyncio.sleep(5 * 60)  # 5分
        await self.end_conversation()

    async def end_conversation(self):
        """会話を終了"""
        try:
            # タイマーをキャンセル
            if self.end_timer and not self.end_timer.done():
                self.end_timer.cancel()

            # OpenAI接続を閉じる
            if self.openai_ws:
                await self.openai_ws.close()

            # 会話時間を計算
            duration = int((datetime.utcnow() - self.start_time).total_seconds())

            # クライアントに終了を通知
            await self.client_ws.send_json(
                {
                    "type": "status",
                    "data": {"message": "Session ended", "final": True, "duration": duration},
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )

            # 会話データを保存
            await self._save_conversation(duration)

        except Exception as e:
            print(f"Error ending conversation: {e}")

    async def _save_conversation(self, duration: int):
        """会話データをデータベースに保存"""
        try:
            async with AsyncSessionLocal() as db:
                # 会話を更新
                conversation = await db.get(Conversation, self.conversation_id)
                if conversation:
                    conversation.ended_at = datetime.utcnow()
                    conversation.duration_seconds = duration
                    conversation.transcript = self.transcript

                    # AI分析（簡易版）
                    conversation.ai_insights = {
                        "emotions": [],  # TODO: 感情分析を実装
                        "keywords": self._extract_keywords(),
                        "summary": self._generate_summary(),
                    }

                    await db.commit()

        except Exception as e:
            print(f"Error saving conversation: {e}")

    def _extract_keywords(self) -> list[str]:
        """会話からキーワードを抽出（簡易版）"""
        # TODO: より高度なキーワード抽出を実装
        keywords = []
        for msg in self.transcript:
            if msg["speaker"] == "user":
                # 簡単な実装：5文字以上の単語を抽出
                words = msg["text"].split()
                keywords.extend([w for w in words if len(w) >= 5])

        # 重複を削除して頻度順にソート
        from collections import Counter

        keyword_counts = Counter(keywords)
        return [kw for kw, _ in keyword_counts.most_common(10)]

    def _generate_summary(self) -> str:
        """会話のサマリーを生成（簡易版）"""
        # TODO: AIを使ったサマリー生成を実装
        if not self.transcript:
            return "No conversation content"

        # 最初のユーザー発話を簡易サマリーとして使用
        for msg in self.transcript:
            if msg["speaker"] == "user" and msg["text"]:
                return msg["text"][:100] + "..." if len(msg["text"]) > 100 else msg["text"]

        return "Conversation without user input"
