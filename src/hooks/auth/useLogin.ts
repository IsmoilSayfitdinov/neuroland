import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AuthAPI } from "@/api/auth.api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import Role from "@/types/auth";
import type { LoginRequest, Token } from "@/types/auth.types";

export const useLogin = () => {
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthAPI.login(data),
    onSuccess: (data: Token) => {
      // Map backend roles to frontend roles
      let role: Role = Role.PARENT;
      if (data.role === "admin") {
        role = Role.ADMIN;
      } else if (data.role === "doctor") {
        role = Role.SPECIALIST;
      } else if (data.role === "children") {
        role = Role.PARENT;
      }
      setLogin(
        { 
          username: data.user_id.toString(),
          role 
        }, 
        data.access_token,
        data.refresh_token
      );

      toast.success("Tizimga muvaffaqiyatli kirdingiz!");

      // Navigate based on role
      if (role === Role.ADMIN) {
        navigate({ to: "/admin" });
      } else if (role === Role.SPECIALIST) {
        navigate({ to: "/specialist" });
      } else if (role === Role.PARENT) {
        navigate({ to: "/parent" });
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail?.[0]?.msg || error.message || "Xatolik yuz berdi";
      toast.error(message);
    },
  });
};


