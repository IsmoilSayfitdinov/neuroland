import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./layouts/__root";
import MainLanding from "../pages/landing/MainLanding";
import { useAuthStore } from "@/store/useAuthStore";
import Role from "@/types/auth";

export const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
    /*
    const { user } = useAuthStore.getState();
    if (user) {
      if (user.role === Role.ADMIN) throw redirect({ to: "/admin" });
      if (user.role === Role.SPECIALIST) throw redirect({ to: "/specialist/dashboard" });
      if (user.role === Role.PARENT) throw redirect({ to: "/parent" });
    }
    */
  component: () => <MainLanding />,
});