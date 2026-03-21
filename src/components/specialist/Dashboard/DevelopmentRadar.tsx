import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface Props {
  apiData?: any[];
}

const fallbackData = [
  { subject: "Nutq", A: 0, fullMark: 100 },
  { subject: "Motorika", A: 0, fullMark: 100 },
  { subject: "Kognitiv", A: 0, fullMark: 100 },
  { subject: "Sensorika", A: 0, fullMark: 100 },
  { subject: "Diqqat", A: 0, fullMark: 100 },
];

export default function DevelopmentRadar({ apiData }: Props) {
  const data = apiData && apiData.length > 0
    ? apiData.map((item: any) => ({
        subject: item.section_name || item.subject || item.name || "",
        A: Math.round(item.score ?? item.value ?? item.percentage ?? 0),
        fullMark: 100,
      }))
    : fallbackData;

  const hasData = apiData && apiData.length > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-bold text-slate-800">Rivojlanish Xaritasi (Global)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748B", fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Natija" dataKey="A" stroke="#2ECC71" fill="#2ECC71" fillOpacity={hasData ? 0.6 : 0.1} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
