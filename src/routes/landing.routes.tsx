import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./layouts/__root";
import MainLanding from "../pages/landing/MainLanding";

export const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <MainLanding />,
});