import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useHomeTasks } from "@/hooks/parent/useHomeTasks";

const DAYS = ["Du", "Se", "Chor", "Pay", "Ju", "Sha", "Yak"];
const todayIndex = new Date().getDay(); // 0=Sun..6=Sat
const todayKey = DAYS[todayIndex === 0 ? 6 : todayIndex - 1] ?? "Du";

export default function WeeklyActivity() {
  const { data: homeTasks } = useHomeTasks();

  // Compute weekly activity from home tasks
  const now = new Date();
  const startOfWeek = new Date(now);
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
  startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const dayCounts: Record<string, { total: number; done: number }> = {};
  DAYS.forEach((d) => (dayCounts[d] = { total: 0, done: 0 }));

  homeTasks?.forEach((task) => {
    const due = new Date(task.due_date);
    if (due >= startOfWeek && due <= now) {
      const dueDay = due.getDay();
      const dayKey = DAYS[dueDay === 0 ? 6 : dueDay - 1];
      if (dayKey) {
        const items = task.items?.length || 1;
        dayCounts[dayKey].total += items;
        if (task.status === "approved" || task.status === "submitted") {
          dayCounts[dayKey].done += items;
        }
      }
    }
  });

  const weeklyActivity = DAYS.map((day) => ({
    day,
    value: dayCounts[day].total > 0
      ? Math.round((dayCounts[day].done / dayCounts[day].total) * 100)
      : 0,
  }));

  const totalDone = Object.values(dayCounts).reduce((a, d) => a + d.done, 0);
  const totalAll = Object.values(dayCounts).reduce((a, d) => a + d.total, 0);
  const weekGrowth = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-[#1E293B] text-[18px]">Haftalik faollik</h2>
          <p className="text-[12px] text-[#9EB1D4] mt-0.5">Oxirgi 7 kunlik natijaviylik</p>
        </div>
        <span className="text-[12px] font-bold text-[#22C55E] bg-[#F0FDF4] px-3 py-1.5 rounded-xl">
          {weekGrowth}% bajarildi
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={weeklyActivity}
          barSize={28}
          margin={{ top: 4, right: 0, left: -28, bottom: 0 }}
        >
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9EB1D4", fontWeight: 500 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#CBD5E1" }}
            domain={[0, 100]}
            tickCount={4}
          />
          <Tooltip
            cursor={{ fill: "#F1F5F9", radius: 6 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-white shadow-lg rounded-xl px-3 py-2 border border-gray-100 text-[12px]">
                  <p className="font-bold text-[#1E293B]">{label}</p>
                  <p className="text-[#4D89FF] font-semibold">{payload[0].value}%</p>
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 4, 4]}>
            {weeklyActivity.map((entry) => (
              <Cell
                key={entry.day}
                fill={entry.day === todayKey ? "#4D89FF" : "#C7D9FF"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
