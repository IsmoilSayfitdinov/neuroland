import type { ParentProgress } from "@/types/analytics.types";

interface Props {
  apiData?: ParentProgress | null;
}

export default function DetailedResults({ apiData }: Props) {
  const details = apiData?.details ?? [];
  const areas = details.length > 0
    ? details.map((d: any) => ({
        name: d.section_name || d.name || "",
        current: Math.round(d.percentage ?? d.score ?? d.current ?? 0),
        trend: d.trend || d.growth || "",
      }))
    : [];

  const avgScore = areas.length > 0
    ? Math.round(areas.reduce((acc: number, a: any) => acc + a.current, 0) / areas.length)
    : 0;

  if (areas.length === 0) {
    return (
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50 flex-1 flex items-center justify-center">
        <p className="text-[13px] text-[#9EB1D4]">Diagnostika natijalari mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50 flex-1">
      <h3 className="font-bold text-[#1E293B] text-[16px] mb-2">Batafsil natijalar</h3>
      <p className="text-[13px] text-[#9EB1D4] mb-4">
        O'rtacha ball: <span className="text-[#3B82F6] font-bold">{avgScore}%</span>
      </p>

      <div className="space-y-3.5">
        {areas.map((area: any, i: number) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[11px] text-[#9EB1D4] font-medium w-20 truncate">{area.name}</span>
            <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#3B82F6] h-full rounded-full transition-all duration-500"
                style={{ width: `${area.current}%` }} />
            </div>
            <span className="text-[11px] font-bold text-[#1E293B] w-8 text-right">{area.current}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
