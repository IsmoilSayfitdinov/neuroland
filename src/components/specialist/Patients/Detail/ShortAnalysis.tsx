import { BarChart3 } from "lucide-react";
import { cn, calculateAge, formatDate } from "@/lib/utils";
import type { ChildDetailOut } from "@/types/children.types";

interface ShortAnalysisProps {
  child: ChildDetailOut;
}

export default function ShortAnalysis({ child }: ShortAnalysisProps) {
  const latest = child.diagnostic_results?.[child.diagnostic_results.length - 1];

  // Calculate section scores from latest diagnostic result
  const sectionScores: Record<string, { total: number; count: number }> = {};
  latest?.answers.forEach((a) => {
    if (!sectionScores[a.section_name]) sectionScores[a.section_name] = { total: 0, count: 0 };
    sectionScores[a.section_name].total += a.score;
    sectionScores[a.section_name].count++;
  });

  const metrics = Object.entries(sectionScores)
    .slice(0, 3)
    .map(([name, { total, count }]) => ({
      label: name,
      value: count > 0 ? Math.round((total / count) * 100) : 0,
      color: "bg-blue-500",
    }));

  // Default metrics if no data
  const displayMetrics = metrics.length > 0 ? metrics : [
    { label: "Nutq darajasi", value: 0, color: "bg-amber-400" },
    { label: "Motorika darajasi", value: 0, color: "bg-emerald-500" },
    { label: "Sensor holat", value: 0, color: "bg-blue-500" },
  ];

  const METRIC_COLORS = ["bg-amber-400", "bg-emerald-500", "bg-blue-500"];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-6">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-[13px] font-bold text-[#2D3142] uppercase tracking-wider">Qisqa tahlil</h3>
      </div>

      <div className="p-5 space-y-6">
        {/* Key info */}
        <div className="space-y-3">
          {[
            { label: "Yoshi", value: calculateAge(child.birth_date) },
            { label: "Tashxis", value: child.diagnosis || "Belgilanmagan" },
            { label: "Tavsiya yo'nalishi", value: child.consultation?.neuro_complex_name || "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-[#9EB1D4] font-medium">{label}</span>
              <span className="text-[#2D3142] font-bold text-right max-w-[140px] line-clamp-1" title={value}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <div className="space-y-4 pt-2 border-t border-gray-50">
          {displayMetrics.map((metric, idx) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#9EB1D4]">{metric.label}</span>
                <span className="text-[#2D3142]">{metric.value}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", METRIC_COLORS[idx % METRIC_COLORS.length])}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div className="bg-[#F0F5FF] rounded-xl p-4 border border-blue-50">
          <p className="text-xs text-blue-700 leading-relaxed">
            {child.consultation?.recommendations || "Intensiv kursga tavsiya etilgan. Doimiy monitoring talab etiladi."}
          </p>
        </div>

        {/* Latest diagnostic date */}
        {latest && (
          <p className="text-[11px] text-[#9EB1D4] text-center">
            Oxirgi diagnostika: {formatDate(latest.date)}
          </p>
        )}
      </div>
    </div>
  );
}
