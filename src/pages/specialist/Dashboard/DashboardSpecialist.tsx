import DinamikaChart from '@/components/specialist/Dashboard/DinamikaChart';
import AIPlanProgress from '@/components/specialist/Dashboard/AIPlanProgress';
import HomeworkDonut from '@/components/specialist/Dashboard/HomeworkDonut';
import EfficiencyStats from '@/components/specialist/Dashboard/EfficiencyStats';
import DevelopmentRadar from '@/components/specialist/Dashboard/DevelopmentRadar';
import TodaySchedule from '@/components/specialist/Dashboard/TodaySchedule';
import AttentionNeeded from '@/components/specialist/Dashboard/AttentionNeeded';

export default function DashboardSpecialist() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <h1 className="text-2xl font-bold text-slate-800">Bosh sahifa</h1>
      
      {/* Top Row: Development Dynamics and AI Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DinamikaChart />
        <AIPlanProgress />
      </div>

      {/* Middle Row: Homework, Efficiency, and Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HomeworkDonut />
        <EfficiencyStats />
        <div className="lg:col-span-2">
          <DevelopmentRadar />
        </div>
      </div>

      {/* Bottom Row: Schedule and Attention Required */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaySchedule />
        <AttentionNeeded />
      </div>
    </div>
  );
}