from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User
from app.schemas.auth import AuthResponse, TokenResponse, UserLogin, UserResponse, UserSignUp
from app.utils.auth import create_access_token, get_current_user, get_password_hash, verify_password

router = APIRouter()


@router.post("/signup", response_model=AuthResponse)
async def signup(user_data: UserSignUp, db: AsyncSession = Depends(get_db)):
    """新規ユーザー登録"""
    # メールアドレスの重複チェック
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # ユーザー作成
    user = User(email=user_data.email, hashed_password=get_password_hash(user_data.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # トークン作成
    access_token, expires_in = create_access_token(user.id)

    return AuthResponse(
        user=UserResponse.model_validate(user), token=TokenResponse(access_token=access_token, expires_in=expires_in)
    )


@router.post("/login", response_model=AuthResponse)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """ユーザーログイン"""
    # ユーザー検索
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    # トークン作成
    access_token, expires_in = create_access_token(user.id)

    return AuthResponse(
        user=UserResponse.model_validate(user), token=TokenResponse(access_token=access_token, expires_in=expires_in)
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """ログアウト（クライアントサイドでトークンを削除）"""
    # サーバーサイドでは特に処理なし
    # 将来的にトークンのブラックリスト機能を実装する場合はここに追加
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """現在のユーザー情報を取得"""
    return UserResponse.model_validate(current_user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """トークンをリフレッシュ"""
    access_token, expires_in = create_access_token(current_user.id)

    return TokenResponse(access_token=access_token, expires_in=expires_in)
