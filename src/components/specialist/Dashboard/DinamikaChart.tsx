import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { ExamsAPI } from "@/api/exams.api";
import { Loader2 } from "lucide-react";

const MONTH_SHORT = ["", "Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];

export default function DinamikaChart() {
  const { data: exams, isLoading } = useQuery({
    queryKey: ["exam-results-monthly"],
    queryFn: () => ExamsAPI.listResults({ exam_type: "monthly" }),
  });

  // Group by month and calculate average score
  const monthMap = new Map<number, { total: number; count: number }>();

  if (exams?.length) {
    for (const exam of exams) {
      const month = new Date(exam.date).getMonth() + 1;
      const existing = monthMap.get(month) ?? { total: 0, count: 0 };
      existing.total += 1; // Each exam counts
      existing.count += 1;
      monthMap.set(month, existing);
    }
  }

  // Build chart data from monthly exam results with actual scores
  // Since ExamResultList doesn't have answers, we calculate from exam count trend
  const { data: detailedExams } = useQuery({
    queryKey: ["exam-results-detailed"],
    queryFn: async () => {
      if (!exams?.length) return [];
      // Get detailed results for last 6 exams
      const recent = exams.slice(0, 6);
      return Promise.all(recent.map((e) => ExamsAPI.getResultById(e.id)));
    },
    enabled: !!exams?.length,
  });

  // Calculate average score per exam
  const chartData = (detailedExams ?? [])
    .map((exam) => {
      const total = exam.answers.length;
      if (!total) return null;
      const scoreSum = exam.answers.reduce((acc, a) => acc + a.score, 0);
      const avgPercent = Math.round((scoreSum / total) * 100);
      const month = new Date(exam.date).getMonth() + 1;
      return { name: MONTH_SHORT[month], value: avgPercent };
    })
    .filter(Boolean)
    .reverse() as { name: string; value: number }[];

  const latestValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
  const prevValue = chartData.length > 1 ? chartData[chartData.length - 2].value : 0;
  const diff = latestValue - prevValue;

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold text-slate-800">Bemorlar Rivojlanish Dinamikasi</CardTitle>
          <p className="text-sm text-slate-500">
            {chartData.length > 0 ? "Imtihon natijalari asosida" : "Ma'lumot kutilmoqda"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-slate-800">{latestValue}%</div>
          {diff !== 0 && (
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 flex items-center justify-end gap-1 ${diff > 0 ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${diff > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {diff > 0 ? '+' : ''}{diff}%
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-[280px] ml-[-35px] mt-[46px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[13px] text-slate-400">
            Imtihon natijalari mavjud emas
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2ECC71"
                strokeWidth={3}
                dot={{ r: 6, fill: '#2ECC71', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
