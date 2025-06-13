export interface Insight {
  id: string;
  user_id: string;
  type: "discovery" | "growth" | "pattern" | "recommendation";
  title: string;
  content: string;
  relevance_score: number;
  based_on_conversations: string[];
  created_at: string;
  is_read: boolean;
}

export interface InsightSummary {
  weekly_discoveries: number;
  growth_points: number;
  identified_patterns: number;
  unread_insights: number;
}

export interface ValueAlignment {
  value: string;
  score: number;
  trend: "up" | "down" | "stable";
}
