import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { DoctorDashboard } from "@/types/analytics.types";

interface Props {
  apiData?: DoctorDashboard["development_dynamics"] | null;
}

export default function DinamikaChart({ apiData }: Props) {
  const chartData = apiData?.monthly_trend?.map((t) => ({ name: t.month, value: t.percentage })) ?? [];
  const latestValue = apiData?.current_percentage ?? 0;
  const diff = apiData?.growth ?? 0;

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold text-slate-800">Bemorlar Rivojlanish Dinamikasi</CardTitle>
          <p className="text-sm text-slate-500">{chartData.length > 0 ? "Oylik natijalar asosida" : "Ma'lumot kutilmoqda"}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-slate-800">{latestValue}%</div>
          {diff !== 0 && (
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 flex items-center justify-end gap-1 ${diff > 0 ? "text-emerald-500 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${diff > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
              {diff > 0 ? "+" : ""}{diff}%
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-[280px] ml-[-35px] mt-[46px]">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[13px] text-slate-400">Ma'lumot mavjud emas</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="value" stroke="#2ECC71" strokeWidth={3} dot={{ r: 6, fill: "#2ECC71", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
