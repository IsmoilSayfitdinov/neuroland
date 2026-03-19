import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface AIPlanGroupCardProps {
  id: string;
  name: string;
  ageRange: string;
  specialist: string;
  studentCount: string;
  avgProgress: number;
}

export default function AIPlanGroupCard({
  id,
  name,
  ageRange,
  specialist,
  studentCount,
  avgProgress,
}: AIPlanGroupCardProps) {
  return (
    <Card className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6 gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800 truncate">{name}</h3>
              <span className="shrink-0 text-[10px] text-slate-400 font-medium tracking-tight">({ageRange})</span>
            </div>
            <p className="text-xs text-slate-500 truncate">{specialist}</p>
          </div>
          <span className="shrink-0 bg-emerald-50 text-[#2ECC71] text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#2ECC71] inline-block mr-1.5 align-middle"></span>
            Barqaror
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-blue-500" />
              <span>Bolalar</span>
            </div>
            <span className="font-bold text-slate-800">{studentCount}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-amber-500" />
                <span>O'rtacha progress</span>
              </div>
              <span className="font-bold text-slate-800">{avgProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full" 
                style={{ width: `${avgProgress}%` }} 
              />
            </div>
          </div>
        </div>

        <Link
          to="/specialist/ai-plan/$groupId"
          params={{ groupId: id }}
          className="w-full"
        >
          <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-xl text-white font-bold text-sm">
            Guruhni ko'rish
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
