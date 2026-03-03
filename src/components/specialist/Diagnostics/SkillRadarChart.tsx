import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { subject: 'Nutq', active: 25, previous: 40 },
  { subject: 'Motorika', active: 65, previous: 50 },
  { subject: 'Sensor', active: 45, previous: 35 },
  { subject: 'Kognitiv', active: 60, previous: 70 },
  { subject: 'Ijtimoiy', active: 55, previous: 45 },
  { subject: 'Emotsional', active: 50, previous: 60 },
  { subject: 'O-o\'ziga xizmat', active: 40, previous: 30 },
  { subject: 'Diqqat', active: 45, previous: 55 },
];

export default function SkillRadarChart() {
  return (
    <Card className="shadow-sm border-slate-100 rounded-2xl h-fit">
      <CardHeader className="flex flex-row items-center border-b border-slate-50 pb-4">
        <CardTitle className="text-sm font-bold text-slate-800">Ko'nikmalar taqqoslash</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#F1F5F9" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#94A3B8', fontSize: 8, fontWeight: 700 }}
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
      </CardContent>
    </Card>
  );
}
