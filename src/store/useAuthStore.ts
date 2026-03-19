import { create } from "zustand";
import { persist } from "zustand/middleware";
import Role from "@/types/auth";

interface User {
  username: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token, refreshToken) => {
        localStorage.setItem("token", token);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
