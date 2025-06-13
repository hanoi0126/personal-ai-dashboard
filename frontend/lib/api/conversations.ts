import { apiClient } from "./client";
import { Conversation, ConversationStats } from "@/types/conversation";

export const conversationsApi = {
  async getAll(): Promise<Conversation[]> {
    return apiClient.get<Conversation[]>("/api/conversations");
  },

  async getById(id: string): Promise<Conversation> {
    return apiClient.get<Conversation>(`/api/conversations/${id}`);
  },

  async getStats(): Promise<ConversationStats> {
    return apiClient.get<ConversationStats>("/api/conversations/stats");
  },

  async updateSummary(id: string, summary: string): Promise<Conversation> {
    return apiClient.put<Conversation>(`/api/conversations/${id}/summary`, {
      summary,
    });
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/conversations/${id}`);
  },
};
