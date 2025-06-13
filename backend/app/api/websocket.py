from datetime import datetime
import json

from fastapi import Depends, WebSocket, WebSocketDisconnect, status
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Conversation
from app.services.realtime_handler import RealtimeConversationHandler


async def websocket_endpoint(websocket: WebSocket, session_token: str, db: AsyncSession = Depends(get_db)):
    """リアルタイム会話のWebSocketエンドポイント"""
    await websocket.accept()

    try:
        # セッショントークンで会話を検証
        result = await db.execute(
            select(Conversation).where(
                and_(Conversation.session_token == session_token, Conversation.expires_at > datetime.utcnow())
            )
        )
        conversation = result.scalar_one_or_none()

        if not conversation:
            await websocket.send_json(
                {
                    "type": "error",
                    "data": {"message": "Invalid or expired session"},
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        # リアルタイムハンドラーを初期化
        handler = RealtimeConversationHandler(
            client_ws=websocket,
            session_token=session_token,
            conversation_id=conversation.id,
            user_id=conversation.user_id,
        )

        await handler.initialize()

        # クライアントからのメッセージを処理
        while True:
            try:
                # メッセージを受信
                data = await websocket.receive_text()
                message = json.loads(data)

                # 音声データの場合はOpenAIに転送
                if message.get("type") == "audio":
                    audio_data = message.get("data", {}).get("chunk")
                    if audio_data:
                        await handler.handle_client_audio(audio_data)

                # 会話終了リクエスト
                elif message.get("type") == "end_conversation":
                    await handler.end_conversation()
                    break

            except WebSocketDisconnect:
                print(f"WebSocket disconnected for conversation {conversation.id}")
                break
            except json.JSONDecodeError:
                await websocket.send_json(
                    {
                        "type": "error",
                        "data": {"message": "Invalid JSON format"},
                        "timestamp": datetime.utcnow().isoformat(),
                    }
                )
            except Exception as e:
                print(f"Error in WebSocket handler: {e}")
                await websocket.send_json(
                    {
                        "type": "error",
                        "data": {"message": "Internal server error"},
                        "timestamp": datetime.utcnow().isoformat(),
                    }
                )

    except Exception as e:
        print(f"WebSocket endpoint error: {e}")
    finally:
        # クリーンアップ
        if "handler" in locals():
            await handler.end_conversation()
        await websocket.close()
