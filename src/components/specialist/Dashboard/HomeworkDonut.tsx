import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { DoctorDashboard } from "@/types/analytics.types";

interface Props {
  apiData?: DoctorDashboard["homework_stats"] | null;
}

export default function HomeworkDonut({ apiData }: Props) {
  const donePercent = apiData?.done_percent ?? 0;
  const latePercent = apiData?.late_percent ?? 0;
  const notDonePercent = apiData?.not_done_percent ?? 0;

  const data = [
    { name: "Bajarilgan", value: donePercent || 0, color: "#2ECC71" },
    { name: "Kechikkan", value: latePercent || 0, color: "#F59E0B" },
    { name: "Bajarilmagan", value: notDonePercent || 0, color: "#EF4444" },
  ];

  const hasData = data.some((d) => d.value > 0);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-slate-800">Uy vazifasi</CardTitle>
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      </CardHeader>
      <CardContent className="flex flex-col h-full items-center justify-between">
        <div className="h-full w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={hasData ? data : [{ name: "Bo'sh", value: 100, color: "#E2E8F0" }]}
                innerRadius={50} outerRadius={65} paddingAngle={hasData ? 5 : 0} dataKey="value">
                {(hasData ? data : [{ color: "#E2E8F0" }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-500">{item.name}</span>
              </div>
              <span className="font-bold text-slate-800">{item.value}%</span>
            </div>
          ))}
          {apiData && (
            <div className="pt-2 border-t text-xs text-slate-500">
              Jami: {apiData.total} ta · O'rtacha: {apiData.average_score}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
