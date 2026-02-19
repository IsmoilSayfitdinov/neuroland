import { landingRoute } from "./landing.routes";
import { rootRoute } from "./layouts/__root";

export const routeTree = rootRoute.addChildren([
  landingRoute,
]);