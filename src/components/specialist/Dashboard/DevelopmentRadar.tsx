import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { subject: 'Nutq', A: 90, fullMark: 100 },
  { subject: 'Motorika', A: 85, fullMark: 100 },
  { subject: 'Kognitiv', A: 75, fullMark: 100 },
  { subject: 'Ijtimoiy', A: 65, fullMark: 100 },
  { subject: 'Hissiy', A: 80, fullMark: 100 },
  { subject: 'Hissiy', A: 70, fullMark: 100 },
  { subject: 'Sensorika', A: 85, fullMark: 100 },
  { subject: 'O\'z-o\'ziga', A: 60, fullMark: 100 },
  { subject: 'Xulq-atvor', A: 75, fullMark: 100 },
  { subject: 'Diqqat', A: 80, fullMark: 100 },
];

export default function DevelopmentRadar() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-bold text-slate-800">Rivojlanish Xaritasi (Global)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
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
              name="Patient"
              dataKey="A"
              stroke="#2ECC71"
              fill="#2ECC71"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
