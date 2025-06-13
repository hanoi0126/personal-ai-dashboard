import uuid

from sqlalchemy import JSON, Column, Date, Float, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class DailyInsight(Base):
    """日次インサイトモデル"""

    __tablename__ = "daily_insights"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    emotion_average = Column(Float, nullable=True)
    top_topics = Column(JSON, default=list)  # リスト形式
    ai_observation = Column(Text, nullable=True)
    created_at = Column(Date, server_default=func.current_date())

    # 複合ユニーク制約（同じユーザーの同じ日付のインサイトは1つだけ）
    __table_args__ = (UniqueConstraint("user_id", "date", name="_user_date_uc"),)

    # リレーション
    user = relationship("User", back_populates="daily_insights")

    def __repr__(self) -> str:
        return f"<DailyInsight(id={self.id}, user_id={self.user_id}, date={self.date})>"


# Userモデルに逆参照を追加
from app.models.user import User

User.daily_insights = relationship("DailyInsight", back_populates="user", cascade="all, delete-orphan")
