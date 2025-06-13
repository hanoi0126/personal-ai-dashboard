import enum
import uuid

from sqlalchemy import Column, DateTime, Enum, Integer, String
from sqlalchemy.sql import func

from app.database import Base


class SubscriptionStatus(enum.Enum):
    """サブスクリプションステータス"""

    TRIAL = "trial"
    ACTIVE = "active"
    EXPIRED = "expired"


class User(Base):
    """ユーザーモデル"""

    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    subscription_status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.TRIAL)
    trial_days_remaining = Column(Integer, default=14)

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"
