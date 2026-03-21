import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ParentWeeklyActivity } from "@/types/analytics.types";

interface Props {
  apiData?: ParentWeeklyActivity | null;
}

export default function WeeklyActivity({ apiData }: Props) {
  const todayDate = new Date().toISOString().split("T")[0];

  const weeklyData = apiData?.days?.map((d) => ({
    day: d.day,
    value: d.attended ? 100 : 0,
    isToday: d.date === todayDate,
  })) ?? [];

  const growthPercent = apiData?.growth_percent ?? 0;
  const currentWeek = apiData?.current_week_count ?? 0;
  const totalDays = weeklyData.length || 7;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-[#1E293B] text-[18px]">Haftalik faollik</h2>
          <p className="text-[12px] text-[#9EB1D4] mt-0.5">Oxirgi 7 kunlik davomatlik</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#22C55E] bg-[#F0FDF4] px-3 py-1.5 rounded-xl">
            {currentWeek}/{totalDays} kun
          </span>
          {growthPercent !== 0 && (
            <span className={`text-[12px] font-bold px-3 py-1.5 rounded-xl ${growthPercent >= 0 ? "text-[#22C55E] bg-[#F0FDF4]" : "text-red-500 bg-red-50"}`}>
              {growthPercent >= 0 ? "+" : ""}{growthPercent}%
            </span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklyData} barSize={28} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9EB1D4", fontWeight: 500 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#CBD5E1" }} domain={[0, 100]} tickCount={4} />
          <Tooltip
            cursor={{ fill: "#F1F5F9", radius: 6 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-white shadow-lg rounded-xl px-3 py-2 border border-gray-100 text-[12px]">
                  <p className="font-bold text-[#1E293B]">{label}</p>
                  <p className="text-[#4D89FF] font-semibold">{payload[0].value === 100 ? "Qatnashdi" : "Qatnashmadi"}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 4, 4]}>
            {weeklyData.map((entry) => (
              <Cell key={entry.day} fill={entry.isToday ? "#4D89FF" : entry.value > 0 ? "#86BBFF" : "#E2E8F0"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
