from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class DailyInsightResponse(BaseModel):
    """日次インサイトレスポンス"""

    model_config = ConfigDict(from_attributes=True)

    date: date
    emotion_average: float | None = Field(None, ge=0, le=1)
    top_topics: list[str]
    ai_observation: str | None
    conversation_count: int = 0


class KeywordCount(BaseModel):
    """キーワードカウント"""

    word: str
    count: int


class EmotionBreakdown(BaseModel):
    """感情の内訳"""

    positive: float = Field(..., ge=0, le=1)
    neutral: float = Field(..., ge=0, le=1)
    negative: float = Field(..., ge=0, le=1)


class WeeklyInsightData(BaseModel):
    """週次インサイトデータ"""

    emotion_scores: EmotionBreakdown
    top_keywords: list[KeywordCount]
    ai_summary: str
    growth_areas: list[str]


class WeeklyInsightResponse(BaseModel):
    """週次インサイトレスポンス"""

    week_start: date
    week_end: date
    total_conversations: int
    average_duration: float = Field(..., description="平均会話時間（秒）")
    insights: WeeklyInsightData


class EmotionTrend(BaseModel):
    """感情トレンド"""

    date: date
    emotion: str
    score: float = Field(..., ge=0, le=1)


class EmotionAnalysisResponse(BaseModel):
    """感情分析レスポンス"""

    period_start: date
    period_end: date
    trends: list[EmotionTrend]
    dominant_emotion: str
    stability_score: float = Field(..., ge=0, le=1, description="感情の安定性スコア")


class KeywordAnalysisResponse(BaseModel):
    """キーワード分析レスポンス"""

    period_start: date
    period_end: date
    keywords: list[KeywordCount]
    trending_up: list[str]
    trending_down: list[str]
