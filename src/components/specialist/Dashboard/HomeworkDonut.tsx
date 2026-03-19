import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";

export default function HomeworkDonut() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["home-tasks-all"],
    queryFn: () => SessionsAPI.listHomeTasks(),
  });

  const total = tasks?.length ?? 0;
  const approved = tasks?.filter((t) => t.status === "approved").length ?? 0;
  const submitted = tasks?.filter((t) => t.status === "submitted").length ?? 0;
  const rejected = tasks?.filter((t) => t.status === "rejected").length ?? 0;
  const pending = tasks?.filter((t) => t.status === "pending").length ?? 0;

  const donePercent = total > 0 ? Math.round((approved / total) * 100) : 0;
  const pendingPercent = total > 0 ? Math.round(((pending + submitted) / total) * 100) : 0;
  const rejectedPercent = total > 0 ? Math.round((rejected / total) * 100) : 0;

  const data = [
    { name: 'Bajarilgan', value: donePercent || 0, color: '#2ECC71' },
    { name: 'Kutilmoqda', value: pendingPercent || 0, color: '#F59E0B' },
    { name: 'Rad etilgan', value: rejectedPercent || 0, color: '#EF4444' },
  ];

  // Ensure at least some data for the pie chart
  const hasData = data.some((d) => d.value > 0);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-slate-800">Uy vazifasi</CardTitle>
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      </CardHeader>
      <CardContent className="flex flex-col h-full items-center justify-between">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <div className="h-full w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hasData ? data : [{ name: "Bo'sh", value: 100, color: '#E2E8F0' }]}
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={hasData ? 5 : 0}
                    dataKey="value"
                  >
                    {(hasData ? data : [{ color: '#E2E8F0' }]).map((entry, index) => (
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
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
