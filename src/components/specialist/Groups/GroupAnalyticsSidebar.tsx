import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, Zap } from "lucide-react";

export default function GroupAnalyticsSidebar() {
  return (
    <div className="space-y-8">
      {/* Average Progress */}
      <Card className="border-none shadow-xs rounded-[32px] bg-white overflow-hidden">
        <CardContent className="p-8">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mb-2">O'rtacha progress</p>
          <div className="flex items-baseline gap-2 mb-6">
            <h2 className="text-4xl font-black text-slate-800">82%</h2>
          </div>
          <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-[#2ECC71] rounded-full" style={{ width: '82%' }} />
          </div>
        </CardContent>
      </Card>

      {/* Extreme Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-xs rounded-[32px] bg-red-50 overflow-hidden">
          <CardContent className="p-6">
            <p className="text-[10px] text-red-400 font-bold uppercase mb-2">Eng zaif</p>
            <h4 className="font-bold text-red-600 text-sm mb-1 uppercase">Motorika</h4>
            <p className="text-xs font-bold text-red-500">73%</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xs rounded-[32px] bg-emerald-50 overflow-hidden">
          <CardContent className="p-6">
            <p className="text-[10px] text-emerald-400 font-bold uppercase mb-2">Eng kuchli</p>
            <h4 className="font-bold text-[#2ECC71] text-sm mb-1 uppercase">Bilish</h4>
            <p className="text-xs font-bold text-[#2ECC71]">82%</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Progress Stats */}
      <Card className="border-none shadow-xs rounded-[32px] bg-white overflow-hidden">
        <CardContent className="p-8">
          <p className="text-xs text-slate-400 font-bold mb-4">80% dan past bolalar</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">4 / 12</span>
            <span className="text-sm text-slate-400 font-bold">(33%)</span>
          </div>
        </CardContent>
      </Card>

      {/* Skills Detail */}
      <Card className="border-none shadow-xs rounded-[32px] bg-white overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <p className="text-xs text-slate-800 font-black mb-2">Ko'nikmalar bo'yicha</p>
          {[
            { label: 'Nutq', value: 76 },
            { label: 'Motorika', value: 73 },
            { label: 'Sensor', value: 77 },
            { label: 'Ijtimoiy', value: 74 },
            { label: 'Bilish', value: 82, color: 'bg-[#2ECC71]' },
          ].map((skill) => (
            <div key={skill.label} className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400">{skill.label}</span>
                <span className="text-slate-800">{skill.value}%</span>
              </div>
              <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full", skill.color || "bg-orange-500")} 
                  style={{ width: `${skill.value}%` }} 
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Warning */}
      <Card className="border-none shadow-xs rounded-[32px] bg-red-50 border border-red-100 overflow-hidden">
        <CardContent className="p-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-sm border border-red-50">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-red-600 text-sm">AI Ogohlantirish</h4>
              <p className="text-xs text-red-400 leading-relaxed mt-1">
                Nutq, Motorika, Sensor, Ijtimoiy, Bilish bo'yicha 30% dan ortiq bola 80% dan past.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-500 pt-2">
            <Zap size={14} fill="currentColor" />
            <span>Majburiy takrorlash tavsiya etiladi.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
