from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class StartConversationResponse(BaseModel):
    """会話開始レスポンス"""

    conversation_id: str
    websocket_url: str
    session_token: str
    expires_at: datetime


class Message(BaseModel):
    """会話メッセージ"""

    speaker: str = Field(..., pattern="^(user|ai)$")
    text: str
    timestamp: datetime
    audio_url: str | None = None


class EmotionScore(BaseModel):
    """感情スコア"""

    emotion: str
    score: float = Field(..., ge=0, le=1)
    timestamp: datetime


class AIInsights(BaseModel):
    """AI分析結果"""

    emotions: list[EmotionScore]
    keywords: list[str]
    summary: str


class ConversationResponse(BaseModel):
    """会話詳細レスポンス"""

    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    started_at: datetime
    ended_at: datetime | None
    duration_seconds: int | None
    transcript: list[Message]
    ai_insights: AIInsights


class ConversationListItem(BaseModel):
    """会話リストアイテム"""

    model_config = ConfigDict(from_attributes=True)

    id: str
    started_at: datetime
    ended_at: datetime | None
    duration_seconds: int | None
    summary: str | None = None


class ConversationListResponse(BaseModel):
    """会話リストレスポンス"""

    conversations: list[ConversationListItem]
    total: int
    page: int
    per_page: int
