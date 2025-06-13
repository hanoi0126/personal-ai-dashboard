export interface User {
  id: string;
  email: string;
  created_at: string;
  subscription_status: string;
  trial_days_remaining: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  user: User;
  token: TokenResponse;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
