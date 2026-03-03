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

const data = [
  { name: 'Yan', value: 62 },
  { name: 'Fev', value: 65 },
  { name: 'Mar', value: 68 },
  { name: 'Apr', value: 72 },
  { name: 'May', value: 75 },
  { name: 'Iyun', value: 78 },
];

export default function DinamikaChart() {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold text-slate-800">Bemorlar Rivojlanish Dinamikasi</CardTitle>
          <p className="text-sm text-slate-500">O'tgan oyga nisbatan sezilarli o'sish</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-slate-800">78%</div>
          <div className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> +12%
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[280px] ml-[-35px] mt-[46px]"> 
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
            {/* Projected Line */}
            <Line 
              type="monotone" 
              dataKey={(d) => d.value + 5} 
              stroke="#3B82F6" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
