import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./layouts/__root";
import Login from "../pages/auth/Login";
import { useAuthStore } from "@/store/useAuthStore";
import Role from "@/types/auth";

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    if (user) {
      if (user.role === Role.ADMIN) throw redirect({ to: "/admin" });
      if (user.role === Role.SPECIALIST) throw redirect({ to: "/specialist/dashboard" });
      if (user.role === Role.PARENT) throw redirect({ to: "/parent" });
    }
  },
  component: () => <Login />,
});
