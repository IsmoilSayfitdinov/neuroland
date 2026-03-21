import { Loader2 } from "lucide-react";
import HeroBanner from "@/components/parent/Dashboard/HeroBanner";
import TodayTasks from "@/components/parent/Dashboard/TodayTasks";
import DevelopmentIndicators from "@/components/parent/Dashboard/DevelopmentIndicators";
import WeeklyActivity from "@/components/parent/Dashboard/WeeklyActivity";
import ChildAndMotherTask from "@/components/parent/Dashboard/ChildAndMotherTask";
import { useParentAnalytics } from "@/hooks/parent/useParentAnalytics";

export default function ParentDashboard() {
  const { useParentDashboard, useParentSections, useParentWeeklyActivity } = useParentAnalytics();
  const { data: dashboard, isLoading } = useParentDashboard();
  const { data: sections } = useParentSections();
  const { data: weeklyActivity } = useParentWeeklyActivity();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <HeroBanner apiData={dashboard} />
      <ChildAndMotherTask />
      <TodayTasks apiData={dashboard?.today_tasks} />
      <DevelopmentIndicators apiData={sections} />
      <WeeklyActivity apiData={weeklyActivity} />
    </div>
  );
}
