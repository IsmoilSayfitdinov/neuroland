import api from "./api";
import type {
  RegisterUserRequest,
  LoginRequest,
  Token,
  TokenRefreshInputRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  UserOut
} from "../types/auth.types";

export class AuthAPI {
  /**
   * Yangi foydalanuvchini (User) ro'yxatdan o'tkazish.
   */
  static async register(data: RegisterUserRequest): Promise<UserOut> {
    const response = await api.post<UserOut>("/v1/auth/register/", data);
    return response.data;
  }

  /**
   * Tizimga kirish (Login) - Login qilish va JWT tokenlarni olish.
   */
  static async login(data: LoginRequest): Promise<Token> {
    const response = await api.post<Token>("/v1/auth/login/", data);
    return response.data;
  }

  /**
   * Tokenni yangilash (Refresh) - Refresh token yordamida yangi tokenlarni olish.
   */
  static async refresh(data: TokenRefreshInputRequest): Promise<Token> {
    const response = await api.post<Token>("/v1/auth/refresh/", data);
    return response.data;
  }

  /**
   * Parolni o'zgartirish - Foydalanuvchi o'z parolini o'zgartirishi
   */
  static async changePassword(data: ChangePasswordRequest): Promise<UserOut> {
    const response = await api.post<UserOut>("/v1/auth/change-password/", data);
    return response.data;
  }

  /**
   * Foydalanuvchi parolini tiklash - Admin tomonidan foydalanuvchi parolini tiklash
   */
  static async resetUserPassword(userId: number, data: ResetPasswordRequest): Promise<UserOut> {
    const response = await api.post<UserOut>(`/v1/auth/reset-user-password/${userId}/`, data);
    return response.data;
  }
}

