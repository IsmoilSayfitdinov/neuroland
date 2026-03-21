import api from "./api";
import type {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  PatchedUserUpdateRequest,
  PaginatedUserList,
} from "../types/users.types";

export class UsersAPI {
  static async listUsers(params?: { role?: string; page?: number }): Promise<User[]> {
    const response = await api.get<PaginatedUserList | User[]>("/v1/users/", { params });
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createUser(data: UserCreateRequest): Promise<User> {
    const response = await api.post<User>("/v1/users/", data);
    return response.data;
  }

  static async getUserById(id: number): Promise<User> {
    const response = await api.get<User>(`/v1/users/${id}/`);
    return response.data;
  }

  static async updateUser(id: number, data: UserUpdateRequest): Promise<User> {
    const response = await api.put<User>(`/v1/users/${id}/`, data);
    return response.data;
  }

  static async patchUser(id: number, data: PatchedUserUpdateRequest): Promise<User> {
    const response = await api.patch<User>(`/v1/users/${id}/`, data);
    return response.data;
  }

  static async deleteUser(id: number): Promise<void> {
    await api.delete(`/v1/users/${id}/`);
  }

  static async getMe(): Promise<User> {
    const response = await api.get<User>("/v1/users/me/");
    return response.data;
  }

  static async activateUser(id: number): Promise<User> {
    const response = await api.post<User>(`/v1/users/${id}/activate/`);
    return response.data;
  }

  static async deactivateUser(id: number): Promise<User> {
    const response = await api.post<User>(`/v1/users/${id}/deactivate/`);
    return response.data;
  }
}
