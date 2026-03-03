import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface GroupStudentCardProps {
  id: string;
  name: string;
  progress: number;
  status: 'Barqaror' | 'O\'zgaruvchan';
  isPaid: boolean;
}

export default function GroupStudentCard({
  name,
  progress,
  status,
  isPaid,
}: GroupStudentCardProps) {
  const [attendance, setAttendance] = useState<string | null>(null);

  return (
    <Card className="border border-slate-50 shadow-xs rounded-[32px] bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm uppercase">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-800 text-sm mb-1">{name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">{progress}%</span>
              <div className="h-1 flex-1 bg-slate-50 rounded-full overflow-hidden max-w-[80px]">
                <div 
                  className="h-full bg-[#2ECC71] rounded-full" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]"></span>
            <span className="text-[10px] font-bold text-[#2ECC71] uppercase tracking-widest">{status}</span>
          </div>
          <span className="text-[10px] font-bold text-[#2ECC71] uppercase tracking-widest bg-[#F4FDF9] px-2 py-0.5 rounded border border-emerald-50">
            {isPaid ? "To'langan" : "To'lanmagan"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['Keldi', 'Kelmadi', 'Kechikdi'].map((label) => (
            <Button
              key={label}
              onClick={() => setAttendance(label)}
              variant="ghost"
              className={cn(
                "h-9 rounded-xl text-[10px] font-bold border transition-all",
                attendance === label 
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100" 
                  : "bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100"
              )}
            >
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
