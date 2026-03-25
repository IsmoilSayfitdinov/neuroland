import { Heart, Lock, Trophy, BarChart2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { TopFamiliesList } from "./components/TopFamiliesList";
import { ActivityHeatmap } from "./components/ActivityHeatmap";
import { useActivityAdminPage } from "@/hooks/admin/useActivityAdminPage";

const activityInfo = (
  <>
    <p>Bu bo'limda oilalarning platformadagi faolligi va vazifalarni bajarish statistikasini kuzatish mumkin.</p>
    <p><strong>Asosiy ko'rsatkichlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Vazifa bajarilish foizi va o'sish dinamikasi</li>
      <li>Qulflangan (to'lov qilmagan) oilalar soni</li>
      <li>Eng faol oilalar reytingi</li>
      <li>Haftalik faollik issiqlik xaritasi</li>
    </ul>
  </>
);

export default function ActivityAdmin() {
  const {
    isLoading,
    families,
    days,
    times,
    heatmapData,
    taskCompletion,
    taskGrowth,
    lockedFamilies,
    lockedMonths,
    knowledgeLevel,
  } = useActivityAdminPage();

  if (isLoading) {
    return (
      <div className="mx-auto pb-10 space-y-6">
        <PageHeader title="Faollik" infoTitle="Faollik bo'limi" infoContent={activityInfo} />
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      <PageHeader title="Faollik" infoTitle="Faollik bo'limi" infoContent={activityInfo} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Vazifa bajarilishi" value={`${taskCompletion}%`} subtitle={`O'sish: ${taskGrowth}%`} icon={Heart} />
        <StatCard title="Qulflangan oilalar" value={String(lockedFamilies)} subtitle={`${lockedMonths} oy`} subtitleColor="text-[#9EB1D4]" icon={Lock} />
        <StatCard title="Eng faol oilalar" value={`Top ${families.length}`} subtitle="Reyting asosida" icon={Trophy} />
        <StatCard title="Bilim darajasi" value={`${knowledgeLevel}%`} subtitle={knowledgeLevel > 70 ? "Yaxshi" : "O'rtacha"} subtitleColor="text-[#9EB1D4]" icon={BarChart2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <TopFamiliesList families={families} />
        <ActivityHeatmap days={days} times={times} data={heatmapData} />
      </div>
    </div>
  );
}
