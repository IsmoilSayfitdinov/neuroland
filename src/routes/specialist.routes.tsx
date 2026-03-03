import { createRoute, redirect } from "@tanstack/react-router";
import { specialistLayoutRoute } from "./layouts/_specalits";
import DashboardSpecialist from "@/pages/specialist/Dashboard/DashboardSpecialist";
import Patients from "@/pages/specialist/Patients/Patients";
import PatientDetail from "@/pages/specialist/Patients/PatientDetail";
import Diagnostics from "@/pages/specialist/Diagnostics/Diagnostics";
import AIPlanList from "@/pages/specialist/AIPlan/AIPlanList";
import AIPlanDetail from "@/pages/specialist/AIPlan/AIPlanDetail";
import DailyPlan from "@/pages/specialist/DailyPlan/DailyPlan";
import KnowledgeCenter from "@/pages/specialist/Knowledge/KnowledgeCenter";
import GroupsList from "@/pages/specialist/Groups/GroupsList";
import GroupDetail from "@/pages/specialist/Groups/GroupDetail";

export const specialistRoute = specialistLayoutRoute.addChildren([
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist",
    beforeLoad: () => {
      throw redirect({ to: "/specialist/dashboard" });
    },
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/dashboard",
    component: () => <DashboardSpecialist />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/patients",
    component: () => <Patients />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/patients/$patientId",
    component: () => <PatientDetail />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/diagnostics",
    component: () => <Diagnostics />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/ai-plan",
    component: () => <AIPlanList />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/ai-plan/$groupId",
    component: () => <AIPlanDetail />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/daily-plan",
    component: () => <DailyPlan />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/knowledge",
    component: () => <KnowledgeCenter />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/groups",
    component: () => <GroupsList />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/groups/$groupId",
    component: () => <GroupDetail />,
  }),
]);
