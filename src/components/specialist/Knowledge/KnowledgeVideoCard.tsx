import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";

interface KnowledgeVideoCardProps {
  title: string;
  category: string;
  ageRange: string;
  duration: string;
  equipment: string;
  thumbnail: string;
  isUnlocked?: boolean;
}

export default function KnowledgeVideoCard({
  title,
  category,
  ageRange,
  duration,
  equipment,
  thumbnail,
  isUnlocked = false,
}: KnowledgeVideoCardProps) {
  return (
    <Card className="border border-slate-50 shadow-xs rounded-[32px] overflow-hidden bg-white hover:shadow-sm transition-shadow">
      <CardContent className="p-5">
        <div className="relative aspect-[1.3] overflow-hidden rounded-[24px] mb-5">
          <img 
            src={thumbnail} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            alt={title}
          />
          {!isUnlocked && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-800 shadow-xl">
                <Lock size={18} fill="currentColor" className="text-slate-800" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 px-1">
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#F8FAFC] text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg">
              {category}
            </span>
            <span className="bg-[#F8FAFC] text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <User size={12} className="text-slate-400" />
              {ageRange}
            </span>
            <span className="bg-[#F8FAFC] text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg">
              {duration}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-medium">Kerakli jihozlar:</p>
            <p className="text-xs text-slate-700 font-bold">{equipment}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button className="bg-blue-600 hover:bg-blue-700 h-10 rounded-xl text-white font-bold text-[11px] border-none">
              Videoni boshlash
            </Button>
            <Button variant="ghost" className="bg-[#F8FAFC] hover:bg-slate-100 h-10 rounded-xl text-slate-400 font-bold text-[11px] border-none">
              Tugatish
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
