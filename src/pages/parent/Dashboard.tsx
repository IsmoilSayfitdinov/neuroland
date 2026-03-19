import HeroBanner from "@/components/parent/Dashboard/HeroBanner";
import TodayTasks from "@/components/parent/Dashboard/TodayTasks";
import DevelopmentIndicators from "@/components/parent/Dashboard/DevelopmentIndicators";
import WeeklyActivity from "@/components/parent/Dashboard/WeeklyActivity";
import ChildAndMotherTask from "@/components/parent/Dashboard/ChildAndMotherTask";

export default function ParentDashboard() {
  return (
    <div className="space-y-5">
      <HeroBanner />
      <ChildAndMotherTask/>
      <TodayTasks />
      <DevelopmentIndicators />
      <WeeklyActivity />
    </div>
  );
}
