import { Loader2 } from "lucide-react";
import DinamikaChart from "@/components/specialist/Dashboard/DinamikaChart";
import AIPlanProgress from "@/components/specialist/Dashboard/AIPlanProgress";
import HomeworkDonut from "@/components/specialist/Dashboard/HomeworkDonut";
import EfficiencyStats from "@/components/specialist/Dashboard/EfficiencyStats";
import DevelopmentRadar from "@/components/specialist/Dashboard/DevelopmentRadar";
import TodaySchedule from "@/components/specialist/Dashboard/TodaySchedule";
import AttentionNeeded from "@/components/specialist/Dashboard/AttentionNeeded";
import { useDoctorDashboard } from "@/hooks/specialist/useDoctorDashboard";

export default function DashboardSpecialist() {
  const {
    isLoading,
    dynamics,
    aiPlan,
    homework,
    effectiveness,
    globalRadar,
    todaySchedule,
    attentionNeeded,
  } = useDoctorDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <h1 className="text-2xl font-bold text-slate-800">Bosh sahifa</h1>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DinamikaChart apiData={dynamics} />
        <AIPlanProgress apiData={aiPlan} />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HomeworkDonut apiData={homework} />
        <EfficiencyStats apiData={effectiveness} />
        <div className="lg:col-span-2">
          <DevelopmentRadar apiData={globalRadar} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaySchedule apiData={todaySchedule} />
        <AttentionNeeded apiData={attentionNeeded} />
      </div>
    </div>
  );
}
