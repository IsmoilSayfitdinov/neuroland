import { Activity, BarChart3 } from "lucide-react";
import type { ReactNode } from "react";
import { useMyChild } from "@/hooks/parent/useMyChild";

interface Category {
  label: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  barColor: string;
  desc: string;
}

function getStyle(value: number) {
  if (value >= 70) return { iconBg: "#DCFCE7", iconColor: "#22C55E", barColor: "#22C55E", desc: "Yoshga mos" };
  if (value >= 55) return { iconBg: "#FEF3C7", iconColor: "#F59E0B", barColor: "#F59E0B", desc: "Rivojlanmoqda" };
  return { iconBg: "#FEE2E2", iconColor: "#EF4444", barColor: "#EF4444", desc: "Qo'shimcha mashq kerak" };
}

export default function DevelopmentIndicators() {
  const { data: child } = useMyChild();

  const latestResult = child?.diagnostic_results?.[child.diagnostic_results.length - 1];

  // Only compute from real API data — no hardcoded fallback
  const categories: Category[] = latestResult?.answers?.length
    ? Object.values(
        latestResult.answers.reduce(
          (acc, a) => {
            if (!acc[a.section_name]) acc[a.section_name] = { label: a.section_name, total: 0, count: 0 };
            acc[a.section_name].total += a.score;
            acc[a.section_name].count += 1;
            return acc;
          },
          {} as Record<string, { label: string; total: number; count: number }>
        )
      ).map((s) => {
        const value = Math.round((s.total / s.count) * 100);
        const style = getStyle(value);
        return { label: s.label, value, icon: <Activity className="w-4 h-4" />, ...style };
      })
    : [];

  if (categories.length === 0) {
    return (
      <div>
        <h2 className="font-bold text-[#222939] text-[18px] mb-4">Rivojlanish ko'rsatkichlari</h2>
        <div className="py-12 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
          <BarChart3 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#9EB1D4] font-bold text-[14px]">Diagnostika natijalari mavjud emas</p>
          <p className="text-[#9EB1D4] text-[12px] mt-1">Diagnostika o'tkazilgandan so'ng natijalar shu yerda ko'rsatiladi</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-[#222939] text-[18px] mb-4">Rivojlanish ko'rsatkichlari</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: cat.iconBg, color: cat.iconColor }}
            >
              {cat.icon}
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <p className="font-bold text-[#1E293B] text-[13px]">{cat.label}</p>
              <span className="text-[13px] font-bold" style={{ color: cat.barColor }}>{cat.value}%</span>
            </div>

            <div className="bg-gray-100 rounded-full h-[5px] mb-1.5">
              <div
                className="h-[5px] rounded-full transition-all"
                style={{ width: `${cat.value}%`, backgroundColor: cat.barColor }}
              />
            </div>

            <p className="text-[10px] text-[#9EB1D4] leading-tight">{cat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
