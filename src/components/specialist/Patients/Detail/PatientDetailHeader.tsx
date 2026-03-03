import { Card, CardContent } from "@/components/ui/card";
import { User, Activity } from "lucide-react";

interface PatientDetailHeaderProps {
  name: string;
  alias: string;
  birthDate: string;
  age: string;
}

export default function PatientDetailHeader({
  name,
  alias,
  birthDate,
  age,
}: PatientDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-600 text-white rounded-t-2xl px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-bold">Bemor profili</span>
      </div>
      
      <Card className="rounded-t-none border-t-0 shadow-sm border-slate-100">
        <CardContent className="p-8 flex items-center gap-8">
          <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-slate-800">{name}</h1>
              <div className="flex gap-2">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-blue-100 uppercase tracking-wider">
                  <Activity size={12} className="text-blue-600" /> RAS (Autizm spektri)
                </span>
                <span className="bg-emerald-50 text-[#2ECC71] text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-100 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]"></span> Active
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-slate-500 text-sm">
              <p>Taxallusi: <span className="text-slate-700 font-medium">{alias}</span></p>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              <p>Tug'ilgan sana: <span className="text-slate-700 font-medium">{birthDate}</span></p>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              <p>Yoshi: <span className="text-slate-700 font-medium">{age}</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
