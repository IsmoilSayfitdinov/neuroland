import { landingRoute } from "./landing.routes";
import { loginRoute } from "./auth.routes";
import { specialistRoute } from "./specialist.routes";
import { rootRoute } from "./layouts/__root";

export const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  specialistRoute,
]);