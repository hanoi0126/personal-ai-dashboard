import uuid

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Conversation(Base):
    """会話モデル"""

    __tablename__ = "conversations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    transcript = Column(JSON, default=list)  # メッセージのリスト
    ai_insights = Column(JSON, default=dict)  # 感情、キーワード、サマリー
    session_token = Column(String, nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)

    # リレーション
    user = relationship("User", back_populates="conversations")

    def __repr__(self) -> str:
        return f"<Conversation(id={self.id}, user_id={self.user_id})>"


# Userモデルに逆参照を追加
from app.models.user import User

User.conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
