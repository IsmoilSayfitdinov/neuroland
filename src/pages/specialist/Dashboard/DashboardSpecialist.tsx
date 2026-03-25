import { Loader2 } from "lucide-react";
import DinamikaChart from "@/components/specialist/Dashboard/DinamikaChart";
import AIPlanProgress from "@/components/specialist/Dashboard/AIPlanProgress";
import HomeworkDonut from "@/components/specialist/Dashboard/HomeworkDonut";
import EfficiencyStats from "@/components/specialist/Dashboard/EfficiencyStats";
import DevelopmentRadar from "@/components/specialist/Dashboard/DevelopmentRadar";
import TodaySchedule from "@/components/specialist/Dashboard/TodaySchedule";
import AttentionNeeded from "@/components/specialist/Dashboard/AttentionNeeded";
import { useDoctorDashboard } from "@/hooks/specialist/useDoctorDashboard";
import { PageInfoButton } from "@/components/specialist/PageInfo";

export default function DashboardSpecialist() {
  const {
    isLoading,
    isLoadingSessions,
    dynamics,
    aiPlan,
    homework,
    effectiveness,
    globalRadar,
    todaySchedule,
    attentionNeeded,
    refetchToday,
    invalidateToday,
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
      <div className="flex items-center gap-2.5">
        <h1 className="text-2xl font-bold text-slate-800">Bosh sahifa</h1>
        <PageInfoButton title="Bosh sahifa">
          <p>Bu sahifada sizning kunlik ish faoliyatingiz haqida umumiy ma'lumot ko'rsatiladi.</p>
          <p><strong>Ko'rsatkichlar:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Rivojlanish dinamikasi grafigi</li>
            <li>AI reja bajarilishi</li>
            <li>Uy vazifalar holati</li>
            <li>Samaradorlik statistikasi</li>
            <li>Bugungi jadval va e'tibor kerak bolalar</li>
          </ul>
        </PageInfoButton>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DinamikaChart apiData={dynamics} />
        </div>
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
        <TodaySchedule
          apiData={todaySchedule}
          isLoading={isLoadingSessions}
          onRefetch={refetchToday}
          onSessionChange={invalidateToday}
        />
        <AttentionNeeded apiData={attentionNeeded} />
      </div>
    </div>
  );
}
