import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useMyChild } from "@/hooks/parent/useMyChild";
import type { DiagnosticResult } from "@/types/children.types";

function computeSectionMap(result: DiagnosticResult) {
  const map: Record<string, { total: number; count: number }> = {};
  result.answers.forEach((a) => {
    if (!map[a.section_name]) map[a.section_name] = { total: 0, count: 0 };
    map[a.section_name].total += a.score;
    map[a.section_name].count += 1;
  });
  return map;
}

export default function RadarChart() {
  const { data: child } = useMyChild();

  const results = child?.diagnostic_results || [];
  const current = results.length > 0 ? results[results.length - 1] : null;
  const previous = results.length > 1 ? results[results.length - 2] : null;

  const currentMap = current ? computeSectionMap(current) : {};
  const previousMap = previous ? computeSectionMap(previous) : {};
  const allSubjects = [...new Set([...Object.keys(currentMap), ...Object.keys(previousMap)])];

  const data = allSubjects.length > 0
    ? allSubjects.map((subject) => ({
        subject,
        current: currentMap[subject]
          ? Math.round((currentMap[subject].total / currentMap[subject].count) * 100)
          : 0,
        old: previousMap[subject]
          ? Math.round((previousMap[subject].total / previousMap[subject].count) * 100)
          : 0,
      }))
    : [
        { subject: "Motor", old: 45, current: 60 },
        { subject: "Nutq", old: 30, current: 40 },
        { subject: "Sensor", old: 65, current: 70 },
        { subject: "Kognitiv", old: 50, current: 55 },
        { subject: "Ijtimoiy", old: 40, current: 45 },
      ];

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50 flex-1">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        <h3 className="font-bold text-[#1E293B] text-[16px]">Radar diagramma</h3>
      </div>
      <p className="text-[12px] text-[#9EB1D4] mb-6">Joriy oy vs oldingi oy</p>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#F1F5F9" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#9EB1D4", fontSize: 10, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#CBD5E1", fontSize: 8 }}
              axisLine={false}
            />
            <Radar
              name="Oldingi oy"
              dataKey="old"
              stroke="#94A3B8"
              fill="#94A3B8"
              fillOpacity={0.2}
              strokeDasharray="4 4"
            />
            <Radar
              name="Joriy oy"
              dataKey="current"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="plainline"
              formatter={(value) => (
                <span className="text-[12px] text-[#2D3142] font-medium">{value}</span>
              )}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
