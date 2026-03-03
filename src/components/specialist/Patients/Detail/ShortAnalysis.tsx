import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function ShortAnalysis() {
  const metrics = [
    { label: "Nutq darajasi", value: 25, color: "bg-amber-400" },
    { label: "Motorika darajasi", value: 55, color: "bg-[#2ECC71]" },
    { label: "Sensor holat", value: 40, color: "bg-blue-600" },
  ];

  return (
    <Card className="h-fit sticky top-6 shadow-sm border-slate-100">
      <CardHeader className="flex flex-row items-center gap-2 border-b border-slate-50 pb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <CardTitle className="text-base font-bold text-slate-800 uppercase tracking-wider">Qisqa tahlil</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center text-slate-500">
            <span>Yoshi</span>
            <span className="text-slate-800 font-bold">4 yil 11 oy</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>Tashxis</span>
            <span className="text-slate-800 font-bold uppercase tracking-tight">F84.0 – Autizm</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>Tavsiya yo'nalishi</span>
            <span className="text-slate-800 font-bold">Sensor-motor integratsiya</span>
          </div>
        </div>

        <div className="space-y-6 pt-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>{metric.label}</span>
                <span className="text-slate-800">{metric.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${metric.color} rounded-full transition-all duration-1000`} 
                  style={{ width: `${metric.value}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-50 mt-4">
          <p className="text-xs text-blue-700 leading-relaxed">
            Intensiv kursga tavsiya etilgan. Doimiy monitoring talab etiladi.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
