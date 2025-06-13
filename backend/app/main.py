from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import auth
from app.api.conversations import conversations
from app.api.websocket import websocket_endpoint
from app.config import settings
from app.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """アプリケーションのライフサイクル管理"""
    # 起動時
    print("Starting up...")
    await init_db()
    yield
    # シャットダウン時
    print("Shutting down...")


# FastAPIアプリケーションの作成
app = FastAPI(title=settings.app_name, version=settings.app_version, lifespan=lifespan)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターの登録
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])


# WebSocketエンドポイント
@app.websocket("/ws/conversation/{session_token}")
async def websocket_route(websocket: WebSocket, session_token: str):
    await websocket_endpoint(websocket, session_token)


# ヘルスチェックエンドポイント
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": settings.app_version}


# ルートエンドポイント
@app.get("/")
async def root():
    return {"message": "Personal Insight Dashboard API", "version": settings.app_version, "docs_url": "/docs"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=settings.debug)
