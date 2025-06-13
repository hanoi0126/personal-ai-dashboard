from datetime import datetime, timedelta
import secrets
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models import Conversation, User
from app.schemas.conversation import (
    ConversationListItem,
    ConversationListResponse,
    ConversationResponse,
    StartConversationResponse,
)
from app.utils.auth import check_trial_status, get_current_user

router = APIRouter()


@router.post("/start", response_model=StartConversationResponse)
async def start_conversation(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """新しい会話セッションを開始"""
    # トライアル期間チェック
    if not check_trial_status(current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Trial period has expired")

    # 今日の会話回数をチェック
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())

    result = await db.execute(
        select(func.count(Conversation.id)).where(
            and_(Conversation.user_id == current_user.id, Conversation.started_at >= today_start)
        )
    )
    conversation_count = result.scalar() or 0

    if conversation_count >= settings.max_daily_conversations:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Daily conversation limit reached")

    # 新しい会話セッションを作成
    conversation_id = f"conv_{uuid.uuid4().hex[:12]}"
    session_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=settings.session_timeout_minutes)

    conversation = Conversation(
        id=conversation_id, user_id=current_user.id, session_token=session_token, expires_at=expires_at
    )
    db.add(conversation)
    await db.commit()

    # WebSocket URLを生成
    websocket_url = f"ws://localhost:8000/ws/conversation/{session_token}"

    return StartConversationResponse(
        conversation_id=conversation_id,
        websocket_url=websocket_url,
        session_token=session_token,
        expires_at=expires_at,
    )


@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    """会話の詳細を取得"""
    result = await db.execute(
        select(Conversation).where(and_(Conversation.id == conversation_id, Conversation.user_id == current_user.id))
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    return ConversationResponse.model_validate(conversation)


@router.get("/", response_model=ConversationListResponse)
async def list_conversations(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """会話リストを取得"""
    # 総数を取得
    count_result = await db.execute(select(func.count(Conversation.id)).where(Conversation.user_id == current_user.id))
    total = count_result.scalar() or 0

    # ページネーションで会話を取得
    offset = (page - 1) * per_page
    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == current_user.id)
        .order_by(Conversation.started_at.desc())
        .offset(offset)
        .limit(per_page)
    )
    conversations = result.scalars().all()

    # レスポンスを構築
    items = []
    for conv in conversations:
        # AI insightsからサマリーを取得
        summary = None
        if conv.ai_insights and isinstance(conv.ai_insights, dict):
            summary = conv.ai_insights.get("summary")

        items.append(
            ConversationListItem(
                id=conv.id,
                started_at=conv.started_at,
                ended_at=conv.ended_at,
                duration_seconds=conv.duration_seconds,
                summary=summary,
            )
        )

    return ConversationListResponse(conversations=items, total=total, page=page, per_page=per_page)


@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    """会話を削除"""
    result = await db.execute(
        select(Conversation).where(and_(Conversation.id == conversation_id, Conversation.user_id == current_user.id))
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    await db.delete(conversation)
    await db.commit()

    return {"message": "Conversation deleted successfully"}
