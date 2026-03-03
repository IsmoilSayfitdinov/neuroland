import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./layouts/__root";
import Login from "../pages/auth/Login";

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <Login />,
});
