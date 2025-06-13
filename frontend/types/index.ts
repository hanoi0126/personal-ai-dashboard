// User types
export interface User {
  id: string;
  email: string;
  created_at: Date;
  subscription_status: "trial" | "active" | "expired";
  trial_days_remaining: number;
}

// Conversation types
export interface Conversation {
  id: string;
  user_id: string;
  started_at: Date;
  ended_at: Date;
  duration_seconds: number;
  transcript: Message[];
  ai_insights: {
    emotions: EmotionScore[];
    keywords: string[];
    summary: string;
  };
}

export interface Message {
  speaker: "user" | "ai";
  text: string;
  timestamp: Date;
  audio_url?: string;
}

export interface EmotionScore {
  emotion: string;
  score: number;
  timestamp: Date;
}

// Daily Insight types
export interface DailyInsight {
  id: string;
  user_id: string;
  date: Date;
  emotion_average: number;
  top_topics: string[];
  ai_observation: string;
}

// Weekly Insight types
export interface WeeklyInsight {
  week_start: string;
  week_end: string;
  total_conversations: number;
  average_duration: number;
  insights: {
    emotion_scores: {
      positive: number;
      neutral: number;
      negative: number;
    };
    top_keywords: KeywordCount[];
    ai_summary: string;
    growth_areas: string[];
  };
}

export interface KeywordCount {
  word: string;
  count: number;
}

// WebSocket message types
export interface WSMessage {
  type: "audio" | "transcript" | "ai_response" | "status" | "error";
  data: any;
  timestamp: string;
}

// API Error types
export interface APIError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Cost control types
export interface ConversationMetrics {
  conversation_id: string;
  duration: number;
  message_count: number;
  audio_quality: number;
  ai_response_time: number[];
  user_satisfaction?: number;
  cost: number;
}
