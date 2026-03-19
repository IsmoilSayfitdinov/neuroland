import { landingRoute } from "./landing.routes";
import { loginRoute } from "./auth.routes";
import { specialistRoute } from "./specialist.routes";
import { parentRoute } from "./parent.routes";
import { adminRoutes } from "./admin.routes";
import { rootRoute } from "./layouts/__root";

export const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  specialistRoute,
  parentRoute,
  adminRoutes,
]);