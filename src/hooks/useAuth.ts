import { useMutation } from "@tanstack/react-query";
import { AuthAPI } from "../api/auth.api";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import type { ChangePasswordRequest, ResetPasswordRequest } from "../types/auth.types";

export const useAuth = () => {
  const logoutStore = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  // Change Password
  const useChangePassword = () => {
    return useMutation({
      mutationFn: (data: ChangePasswordRequest) => AuthAPI.changePassword(data),
      onSuccess: () => {
        toast.success("Parol muvaffaqiyatli o'zgartirildi!");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || "Xatolik yuz berdi");
      }
    });
  };

  // Reset User Password (Admin)
  const useResetUserPassword = () => {
    return useMutation({
      mutationFn: ({ userId, data }: { userId: number; data: ResetPasswordRequest }) => 
        AuthAPI.resetUserPassword(userId, data),
      onSuccess: () => {
        toast.success("Foydalanuvchi paroli muvaffaqiyatli tiklandi!");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || "Xatolik yuz berdi");
      }
    });
  };

  const logout = () => {
    logoutStore();
    toast.success("Tizimdan chiqdingiz");
  };

  return {
    user,
    logout,
    useChangePassword,
    useResetUserPassword,
  };
};
