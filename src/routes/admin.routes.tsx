import { createRoute, redirect } from "@tanstack/react-router";
import { adminLayoutRoute } from "./layouts/__admin";
import DashboardAdmin from "@/pages/admin/Dashboard/DashboardAdmin";
import AdminDepartments from "@/pages/admin/Departments/DepartmentsAdmin";
import CreateDepartmentAdmin from "@/pages/admin/Departments/CreateDepartmentAdmin";
import DepartmentDetailAdmin from "@/pages/admin/Departments/DepartmentDetailAdmin";
import EditDepartmentAdmin from "@/pages/admin/Departments/EditDepartmentAdmin";

import AdminGroupsList from "@/pages/admin/Groups/GroupsAdmin";
import CreateGroupAdmin from "@/pages/admin/Groups/CreateGroupAdmin";
import EditGroupAdmin from "@/pages/admin/Groups/EditGroupAdmin";
import GroupDetailAdmin from "@/pages/admin/Groups/GroupDetailAdmin";
import AssignHomeworkAdmin from "@/pages/admin/Groups/AssignHomeworkAdmin";
import AdminSpecialistsList from "@/pages/admin/Specialists/SpecialistsAdmin";
import SpecialistDetailAdmin from "@/pages/admin/Specialists/SpecialistDetailAdmin";
import CreateSpecialistAdmin from "@/pages/admin/Specialists/CreateSpecialistAdmin";
import EditSpecialistAdmin from "@/pages/admin/Specialists/EditSpecialistAdmin";
import SpecialistTypesAdmin from "@/pages/admin/Specialists/SpecialistTypesAdmin";
import GrowthAnalysisAdmin from "@/pages/admin/GrowthAnalysis/GrowthAnalysisAdmin";
import FinanceAdmin from "@/pages/admin/Finance/FinanceAdmin";
import ActivityAdmin from "@/pages/admin/Activity/ActivityAdmin";
import KnowledgeCenterAdmin from "@/pages/admin/KnowledgeCenter/KnowledgeCenterAdmin";
import AdminCalendar from "@/pages/admin/Calendar/Calendar";
import ChildrenAdmin from "@/pages/admin/Children/ChildrenAdmin";
import CreateChildAdmin from "@/pages/admin/Children/CreateChildAdmin";
import EditChildAdmin from "@/pages/admin/Children/EditChildAdmin";
import ChildDetailAdmin from "@/pages/admin/Children/ChildDetailAdmin";
import ChildAnamnesisAdmin from "@/pages/admin/Children/ChildAnamnesisAdmin";
import EventsAdmin from "@/pages/admin/Events/EventsAdmin";
import AchievementsAdmin from "@/pages/admin/Achievements/AchievementsAdmin";
import ScheduleAdmin from "@/pages/admin/Schedule/ScheduleAdmin";
import AIPlanListAdmin from "@/pages/admin/AIPlan/AIPlanListAdmin";
import AIPlanDetailAdmin from "@/pages/admin/AIPlan/AIPlanDetailAdmin";
import TopicsAdmin from "@/pages/admin/Topics/TopicsAdmin";
import TopicDetailAdmin from "@/pages/admin/Topics/TopicDetailAdmin";
import NotificationsPage from "@/pages/shared/NotificationsPage";
import LandingAdmin from "@/pages/admin/Landing/LandingAdmin";
import PlansAdmin from "@/pages/admin/Plans/PlansAdmin";
import TreatmentComplexesAdmin from "@/pages/admin/TreatmentComplexes/TreatmentComplexesAdmin";
import YearlyPlansAdmin from "@/pages/admin/YearlyPlans/YearlyPlansAdmin";
import YearlyPlanDetailAdmin from "@/pages/admin/YearlyPlans/YearlyPlanDetailAdmin";

export const adminRoutes = adminLayoutRoute.addChildren([
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin",
    beforeLoad: () => {
      throw redirect({ to: "/admin/dashboard" });
    },
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/dashboard",
    component: DashboardAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/groups",
    component: AdminGroupsList,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/groups/create",
    component: CreateGroupAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/groups/$id",
    component: GroupDetailAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/groups/$id/edit",
    component: EditGroupAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/groups/$id/homework",
    component: AssignHomeworkAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/specialists",
    component: AdminSpecialistsList,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/specialists/create",
    component: CreateSpecialistAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/specialists/types",
    component: SpecialistTypesAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/specialists/$id",
    component: SpecialistDetailAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/specialists/$id/edit",
    component: EditSpecialistAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/growth-analysis",
    component: GrowthAnalysisAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/finance",
    component: FinanceAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/notifications",
    component: () => <NotificationsPage />,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/activity",
    component: ActivityAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/departments",
    component: AdminDepartments,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/departments/create",
    component: CreateDepartmentAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/departments/$id",
    component: DepartmentDetailAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/departments/$id/edit",
    component: EditDepartmentAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/knowledge-center",
    component: KnowledgeCenterAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/calendar",
    component: AdminCalendar,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/child",
    component: ChildrenAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/child/create",
    component: CreateChildAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/child/$id",
    component: ChildDetailAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/child/$id/edit",
    component: EditChildAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/child/$id/anamnesis",
    component: ChildAnamnesisAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/events",
    component: EventsAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/achievements",
    component: AchievementsAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/schedule",
    component: ScheduleAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/topics",
    component: TopicsAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/topics/$topicId",
    component: TopicDetailAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/ai-plan",
    component: AIPlanListAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/ai-plan/$groupId",
    component: AIPlanDetailAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/landing",
    component: LandingAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/plans",
    component: PlansAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/treatment-complexes",
    component: TreatmentComplexesAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/yearly-plans",
    component: YearlyPlansAdmin,
  }),
  createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "/admin/yearly-plans/$id",
    component: YearlyPlanDetailAdmin,
  }),
]);
