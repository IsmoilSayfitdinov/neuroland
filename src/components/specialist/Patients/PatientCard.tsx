import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface PatientCardProps {
  id: number;
  name: string;
  age: number;
  diagnostic: string;
  progress: number;
  lastTest: string;
  nextTest: string;
  isNew?: boolean;
}

export default function PatientCard({
  id,
  name,
  age,
  diagnostic,
  progress,
  lastTest,
  nextTest,
  isNew = false,
}: PatientCardProps) {
  return (
    <Card className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-none">{name}</h3>
              <p className="text-xs text-slate-500 mt-1.5">{age} yosh</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Eye size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">Diagnostika</p>
            <div className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-medium">
              {diagnostic}
            </div>
          </div>

          {!isNew && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Rivojlanish</p>
                <span className="text-xs font-bold text-slate-800">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2ECC71] rounded-full" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Oxirgi test:</p>
              <p className="text-xs font-bold text-slate-700">{lastTest}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Keyingi test:</p>
              <p className="text-xs font-bold text-slate-700">{nextTest}</p>
            </div>
          </div>

          <Link
            to="/specialist/patients/$patientId"
            params={{ patientId: id.toString() }}
            className="w-full"
          >
            <Button 
              className="w-full h-11 rounded-xl font-bold text-sm shadow-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isNew ? "Diagnostika boshlash" : "Batafsil"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
