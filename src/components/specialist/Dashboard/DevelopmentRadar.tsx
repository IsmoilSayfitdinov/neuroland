import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { DiagnosticsAPI } from "@/api/diagnostics.api";
import { Loader2 } from "lucide-react";

export default function DevelopmentRadar() {
  const { data: results, isLoading } = useQuery({
    queryKey: ["diagnostics-results-all"],
    queryFn: () => DiagnosticsAPI.getResults(),
  });

  // Aggregate by section_name from all diagnostic answers
  const sectionScores = new Map<string, { total: number; count: number }>();

  if (results?.length) {
    for (const result of results) {
      for (const ans of result.answers) {
        const section = ans.section_name;
        const existing = sectionScores.get(section) ?? { total: 0, count: 0 };
        existing.total += ans.score * 100;
        existing.count += 1;
        sectionScores.set(section, existing);
      }
    }
  }

  const data = Array.from(sectionScores.entries()).map(([subject, { total, count }]) => ({
    subject,
    A: Math.round(total / count),
    fullMark: 100,
  }));

  // Fallback if no data
  const hasData = data.length > 0;
  const fallbackData = [
    { subject: 'Nutq', A: 0, fullMark: 100 },
    { subject: 'Motorika', A: 0, fullMark: 100 },
    { subject: 'Kognitiv', A: 0, fullMark: 100 },
    { subject: 'Sensorika', A: 0, fullMark: 100 },
    { subject: 'Diqqat', A: 0, fullMark: 100 },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-bold text-slate-800">Rivojlanish Xaritasi (Global)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={hasData ? data : fallbackData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#64748B', fontSize: 10 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Natija"
                dataKey="A"
                stroke="#2ECC71"
                fill="#2ECC71"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
