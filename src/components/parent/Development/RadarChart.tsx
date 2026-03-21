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
import type { ParentProgress } from "@/types/analytics.types";

interface Props {
  apiData?: ParentProgress | null;
}

export default function RadarChart({ apiData }: Props) {
  const currentData = apiData?.current ?? [];
  const previousData = apiData?.previous ?? [];

  const allSubjects = [...new Set([
    ...currentData.map((c: any) => c.section_name || c.subject || c.name),
    ...previousData.map((p: any) => p.section_name || p.subject || p.name),
  ])];

  const data = allSubjects.length > 0
    ? allSubjects.map((subject) => {
        const cur = currentData.find((c: any) => (c.section_name || c.subject || c.name) === subject);
        const prev = previousData.find((p: any) => (p.section_name || p.subject || p.name) === subject);
        return {
          subject,
          current: Math.round(cur?.percentage ?? cur?.score ?? cur?.value ?? 0),
          old: Math.round(prev?.percentage ?? prev?.score ?? prev?.value ?? 0),
        };
      })
    : [
        { subject: "Motor", old: 0, current: 0 },
        { subject: "Nutq", old: 0, current: 0 },
        { subject: "Sensor", old: 0, current: 0 },
        { subject: "Kognitiv", old: 0, current: 0 },
        { subject: "Ijtimoiy", old: 0, current: 0 },
      ];

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50 flex-1">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        <h3 className="font-bold text-[#1E293B] text-[16px]">Radar diagramma</h3>
      </div>
      <p className="text-[12px] text-[#9EB1D4] mb-6">
        Joriy: {apiData?.overall_current ?? 0}% · Oldingi: {apiData?.overall_previous ?? 0}%
      </p>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#F1F5F9" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#9EB1D4", fontSize: 10, fontWeight: 500 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#CBD5E1", fontSize: 8 }} axisLine={false} />
            <Radar name="Oldingi oy" dataKey="old" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.2} strokeDasharray="4 4" />
            <Radar name="Joriy oy" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
            <Legend verticalAlign="bottom" height={36} iconType="plainline"
              formatter={(value) => <span className="text-[12px] text-[#2D3142] font-medium">{value}</span>} />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
