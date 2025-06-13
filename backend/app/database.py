from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.ext.declarative import declarative_base

from app.config import settings

# データベースエンジンの作成
engine = create_async_engine(settings.database_url, echo=settings.debug, future=True)

# セッションファクトリの作成
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# ベースクラスの作成
Base = declarative_base()


# 依存性注入用の関数
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """データベースセッションを取得"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# データベースの初期化
async def init_db() -> None:
    """データベーステーブルを作成"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
