import os

from pydantic_settings import BaseSettings  # type: ignore[import-untyped]


class Settings(BaseSettings):  # type: ignore[misc]
    """アプリケーション設定"""

    # 基本設定
    app_name: str = "Personal Insight Dashboard API"
    app_version: str = "0.1.0"
    debug: bool = True

    # データベース設定
    database_url: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost/personal_insight_db")

    # JWT設定
    jwt_secret_key: str = os.getenv("JWT_SECRET", "your-secret-key-here")
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60 * 24  # 24時間

    # OpenAI設定
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = "gpt-4o-realtime-preview-2024-12-17"

    # CORS設定
    allowed_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    # レート制限
    rate_limit_requests: int = 100
    rate_limit_period: int = 3600  # 1時間

    # セッション設定
    session_timeout_minutes: int = 5
    max_daily_conversations: int = 1  # 無料プランの1日あたりの会話回数

    # WebSocket設定
    ws_heartbeat_interval: int = 30  # 秒

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
