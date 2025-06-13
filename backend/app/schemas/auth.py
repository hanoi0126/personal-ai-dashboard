from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserSignUp(BaseModel):
    """ユーザー登録リクエスト"""

    email: EmailStr
    password: str = Field(..., min_length=8, description="最低8文字以上のパスワード")


class UserLogin(BaseModel):
    """ユーザーログインリクエスト"""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """トークンレスポンス"""

    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    """ユーザー情報レスポンス"""

    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    created_at: datetime
    subscription_status: str
    trial_days_remaining: int


class AuthResponse(BaseModel):
    """認証レスポンス"""

    user: UserResponse
    token: TokenResponse
