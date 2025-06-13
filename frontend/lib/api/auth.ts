import { apiClient } from "./client";
import { AuthResponse, LoginRequest, SignUpRequest, User } from "@/types/auth";

export const authApi = {
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/signup",
      data,
    );
    apiClient.setToken(response.token.access_token);
    return response;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/login",
      data,
    );
    apiClient.setToken(response.token.access_token);
    return response;
  },

  async logout(): Promise<void> {
    await apiClient.post("/api/auth/logout");
    apiClient.setToken(null);
  },

  async getMe(): Promise<User> {
    return apiClient.get<User>("/api/auth/me");
  },

  async refreshToken(): Promise<void> {
    const response = await apiClient.post<{ access_token: string }>(
      "/api/auth/refresh",
    );
    apiClient.setToken(response.access_token);
  },
};
