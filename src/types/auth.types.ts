export interface LoginRequest {
  id: string;
  pass: string;
}

export interface LoginResponse {
  token: string;
  user_id: string;
}
