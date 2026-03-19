import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

interface SkillRadarChartProps {
  currentScores: Record<string, { total: number; count: number }>;
  previousResult?: {
    answers: { section_name: string; score: number }[];
  } | null;
}

export default function SkillRadarChart({ currentScores, previousResult }: SkillRadarChartProps) {
  const previousScores: Record<string, { total: number; count: number }> = {};
  previousResult?.answers?.forEach((a) => {
    if (!previousScores[a.section_name]) previousScores[a.section_name] = { total: 0, count: 0 };
    previousScores[a.section_name].total += a.score;
    previousScores[a.section_name].count += 1;
  });

  const allSubjects = [...new Set([...Object.keys(currentScores), ...Object.keys(previousScores)])];

  const data = allSubjects.length > 0
    ? allSubjects.map((subject) => ({
        subject,
        active: currentScores[subject]
          ? Math.round((currentScores[subject].total / currentScores[subject].count) * 100)
          : 0,
        previous: previousScores[subject]
          ? Math.round((previousScores[subject].total / previousScores[subject].count) * 100)
          : 0,
      }))
    : [
        { subject: "Ma'lumot", active: 0, previous: 0 },
      ];

  const hasData = allSubjects.length > 0;

  return (
    <Card className="shadow-sm border-slate-100 rounded-2xl h-fit">
      <CardHeader className="flex flex-row items-center border-b border-slate-50 pb-4">
        <CardTitle className="text-sm font-bold text-slate-800">Ko'nikmalar taqqoslash</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!hasData ? (
          <div className="py-10 text-center text-[13px] text-slate-400">
            Diagnostika natijalari mavjud emas
          </div>
        ) : (
          <>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid stroke="#F1F5F9" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#94A3B8", fontSize: 8, fontWeight: 700 }}
                  />
                  <Radar
                    name="Oldingi"
                    dataKey="previous"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.1}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <Radar
                    name="Hozirgi"
                    dataKey="active"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-500" />
                <span className="text-[10px] font-bold text-slate-600">Hozirgi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-amber-500" />
                <span className="text-[10px] font-bold text-slate-600">Oldingi</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
