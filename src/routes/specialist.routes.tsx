import { createRoute, redirect } from "@tanstack/react-router";
import { specialistLayoutRoute } from "./layouts/_specalits";
import DashboardSpecialist from "@/pages/specialist/Dashboard/DashboardSpecialist";
import Patients from "@/pages/specialist/Patients/Patients";
import PatientDetail from "@/pages/specialist/Patients/PatientDetail";
import PatientAnamnesis from "@/pages/specialist/Patients/PatientAnamnesis";
import Reports from "@/pages/specialist/Reports/Reports";
import CreateReport from "@/pages/specialist/Reports/CreateReport";
import NotificationsPage from "@/pages/shared/NotificationsPage";
import Topics from "@/pages/specialist/Topics/Topics";
import TopicDetail from "@/pages/specialist/Topics/TopicDetail";
import Diagnostics from "@/pages/specialist/Diagnostics/Diagnostics";
import AIPlanList from "@/pages/specialist/AIPlan/AIPlanList";
import AIPlanDetail from "@/pages/specialist/AIPlan/AIPlanDetail";
import DailyPlan from "@/pages/specialist/DailyPlan/DailyPlan";
import KnowledgeCenter from "@/pages/specialist/Knowledge/KnowledgeCenter";
import GroupsList from "@/pages/specialist/Groups/GroupsList";
import GroupDetail from "@/pages/specialist/Groups/GroupDetail";
import ExamConduct from "@/pages/specialist/Exams/ExamConduct";
import AssignHomeworkPage from "@/pages/specialist/Homework/AssignHomeworkPage";
import HomeworkReviewPage from "@/pages/specialist/Homework/HomeworkReviewPage";

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
    path: "/specialist/patients/$patientId/anamnesis",
    component: () => <PatientAnamnesis />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/diagnostics",
    component: () => <Diagnostics />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/diagnostics/$childId",
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
    path: "/specialist/topics",
    component: () => <Topics />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/topics/$topicId",
    component: () => <TopicDetail />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/notifications",
    component: () => <NotificationsPage />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/reports",
    component: () => <Reports />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/reports/create",
    component: () => <CreateReport />,
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
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/patients/$patientId/exam",
    component: () => <ExamConduct />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/groups/$groupId/homework",
    component: () => <AssignHomeworkPage />,
  }),
  createRoute({
    getParentRoute: () => specialistLayoutRoute,
    path: "/specialist/groups/$groupId/homework/review",
    component: () => <HomeworkReviewPage />,
  }),
]);
