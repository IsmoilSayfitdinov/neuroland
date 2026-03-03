import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Bajarilgan', value: 85, color: '#2ECC71' },
  { name: 'Kechikkan', value: 10, color: '#F59E0B' },
  { name: 'Bajarilmagan', value: 5, color: '#EF4444' },
];

export default function HomeworkDonut() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-slate-800">Uy vazifasi</CardTitle>
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      </CardHeader>
      <CardContent className="flex flex-col h-full items-center justify-between">
        <div className="h-full w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={50}
                outerRadius={65}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
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
      </CardContent>
    </Card>
  );
}
