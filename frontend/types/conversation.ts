export interface Conversation {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
  summary?: string;
  emotional_tone?: string;
  energy_level?: number;
  key_topics?: string[];
  created_at: string;
  updated_at?: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ConversationStats {
  total_conversations: number;
  average_duration: number;
  average_energy_level: number;
  most_common_topics: string[];
  positive_ratio: number;
}
