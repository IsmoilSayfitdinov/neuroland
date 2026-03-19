import { useMyChild } from "@/hooks/parent/useMyChild";

export default function DetailedResults() {
  const { data: child } = useMyChild();

  const latestResult = child?.diagnostic_results?.[child.diagnostic_results.length - 1];

  const areas = latestResult?.answers?.length
    ? Object.values(
        latestResult.answers.reduce(
          (acc, a) => {
            if (!acc[a.section_name]) acc[a.section_name] = { name: a.section_name, total: 0, count: 0 };
            acc[a.section_name].total += a.score;
            acc[a.section_name].count += 1;
            return acc;
          },
          {} as Record<string, { name: string; total: number; count: number }>
        )
      ).map((s) => ({ name: s.name, current: Math.round((s.total / s.count) * 100), trend: "+0" }))
    : [
        { name: "Motor", current: 60, trend: "+10" },
        { name: "Nutq", current: 40, trend: "+10" },
        { name: "Sensor", current: 70, trend: "+10" },
        { name: "Kognitiv", current: 55, trend: "+10" },
        { name: "Ijtimoiy", current: 45, trend: "+10" },
      ];

  const avgScore =
    areas.length > 0
      ? Math.round(areas.reduce((acc, a) => acc + a.current, 0) / areas.length)
      : 0;

  const specialistComment = latestResult?.comment || null;

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50 flex-1">
      <h3 className="font-bold text-[#1E293B] text-[16px] mb-2">Batafsil natijalar</h3>
      <p className="text-[13px] text-[#9EB1D4] mb-4">
        O'rtacha ball: <span className="text-[#3B82F6] font-bold">{avgScore}%</span>
      </p>

      <div className="space-y-3.5">
        {areas.map((area, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[11px] text-[#9EB1D4] font-medium w-20 truncate">{area.name}</span>
            <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3B82F6] h-full rounded-full transition-all duration-500"
                style={{ width: `${area.current}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-[#1E293B] w-8 text-right">{area.current}%</span>
          </div>
        ))}
      </div>

      {specialistComment && (
        <div className="mt-6 bg-[#EFF6FF] rounded-2xl p-5 border border-blue-50">
          <h4 className="font-bold text-[#1E293B] text-[13px] mb-2">Mutaxassis izohi:</h4>
          <p className="text-[12px] text-[#64748B] leading-[1.6]">{specialistComment}</p>
        </div>
      )}
    </div>
  );
}
