import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface GroupCardProps {
  id: string;
  name: string;
  ageRange: string;
  specialist: string;
  studentCount: string;
  avgProgress: number;
}

export default function GroupCard({
  id,
  name,
  ageRange,
  specialist,
  studentCount,
  avgProgress,
}: GroupCardProps) {
  return (
    <Card className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-[32px] bg-white">
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800 text-lg">{name}</h3>
              <span className="text-xs text-slate-400 font-medium tracking-tight">({ageRange})</span>
            </div>
            <p className="text-sm text-slate-500">{specialist}</p>
          </div>
          <span className="bg-[#F4FDF9] text-[#2ECC71] text-[10px] font-bold px-4 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]"></span>
            Barqaror
          </span>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-slate-400" />
              <span>Bolalar</span>
            </div>
            <span className="font-bold text-slate-800 text-sm">{studentCount}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-3">
                <TrendingUp size={18} className="text-slate-400" />
                <span>O'rtacha progress</span>
              </div>
              <span className="font-bold text-slate-800 text-sm">{avgProgress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                style={{ width: `${avgProgress}%` }} 
              />
            </div>
          </div>
        </div>

        <Link
          to="/specialist/groups/$groupId"
          params={{ groupId: id }}
          className="w-full"
        >
          <Button className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl text-white font-bold text-base shadow-lg shadow-blue-100">
            Guruhni ko'rish
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
