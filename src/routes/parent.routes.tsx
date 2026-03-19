import { createRoute, redirect } from "@tanstack/react-router";
import { parentLayoutRoute } from "./layouts/__parents";
import ParentDashboard from "@/pages/parent/Dashboard";
import ParentTasks from "@/pages/parent/Tasks";
import ParentDevelopment from "@/pages/parent/Development";
import ParentAnnualPlan from "@/pages/parent/AnnualPlan";
import ParentAchievements from "@/pages/parent/Achievements";
import ParentKnowledge from "@/pages/parent/Knowledge";
import ParentChildInfo from "@/pages/parent/ChildInfo";
import ParentPayments from "@/pages/parent/Payments";
import NotificationsPage from "@/pages/shared/NotificationsPage";

export const parentRoute = parentLayoutRoute.addChildren([
  createRoute({
    getParentRoute: () => parentLayoutRoute,
    path: "/parent",
    beforeLoad: () => {
      throw redirect({ to: "/parent/dashboard" });
    },
  }),
  createRoute({
    getParentRoute: () => parentLayoutRoute,
    path: "/parent/dashboard",
    component: () => <ParentDashboard />,
  }),
  createRoute({
    getParentRoute: () => parentLayoutRoute,
    path: "/parent/tasks",
    component: () => <ParentTasks />,
  }),
  createRoute({
    getParentRoute: () => parentLayoutRoute,
    path: "/parent/development",
    component: () => <ParentDevelopment />,
  }),
  createRoute({
    getParentRoute: () => parentLayoutRoute,
    path: "/parent/annual-plan",
    component: () => <ParentAnnualPlan />,
  }),
  createRoute({
    getParentRoute: () => parentLayoutRoute,
    path: "/parent/achievements",
    component: () => <ParentAchievements />,
  }),
  createRoute({
    getParentRoute: () => parentLayoutRoute,
    path: "/parent/knowledge",
    component: () => <ParentKnowledge />,
  }),
  createRoute({
    getParentRoute: () => parentLayoutRoute,
    path: "/parent/child-info",
    component: () => <ParentChildInfo />,
  }),
  createRoute({
    getParentRoute: () => parentLayoutRoute,
    path: "/parent/payments",
    component: () => <ParentPayments />,
  }),
  createRoute({
    getParentRoute: () => parentLayoutRoute,
    path: "/parent/notifications",
    component: () => <NotificationsPage />,
  }),
]);
