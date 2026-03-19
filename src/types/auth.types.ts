export interface UserOut {
  id: number;
  fio: string;
  phone_number: string;
  email?: string | null;
  photo?: string | null;
  role: 'children' | 'doctor' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface RegisterUserRequest {
  fio: string;
  phone_number: string;
  email?: string | null;
  photo?: string | null;
  role: 'children' | 'doctor' | 'admin';
  password?: string;
}

export interface LoginRequest {
  username: string; // The swagger documentation specifically requires username
  password?: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_id: number;
  role: string;
}

export interface TokenRefreshInputRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ResetPasswordRequest {
  new_password: string;
  user_id: number;
}

