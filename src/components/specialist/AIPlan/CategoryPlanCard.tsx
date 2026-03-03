import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  ShieldAlert, 
  MessageSquare, 
  Users, 
  Heart, 
  Brain, 
  Activity, 
  Fingerprint, 
  Accessibility, 
  Gamepad2 
} from "lucide-react";

// Specific colors matching the provided design screenshot
const config = {
  "Diqqat": { icon: ShieldAlert, color: "text-blue-500", bar: "bg-blue-500", bg: "bg-[#F4FDF9]", iconBg: "bg-blue-500" },
  "Nutq": { icon: MessageSquare, color: "text-purple-500", bar: "bg-purple-500", bg: "bg-[#FFF9F2]", iconBg: "bg-purple-500" },
  "Ijtimoiy": { icon: Users, color: "text-cyan-500", bar: "bg-cyan-500", bg: "bg-[#FEF2F2]", iconBg: "bg-cyan-500" },
  "Emotsional": { icon: Heart, color: "text-pink-500", bar: "bg-pink-500", bg: "bg-[#FFF9F2]", iconBg: "bg-pink-500" },
  "Kognitiv": { icon: Brain, color: "text-indigo-500", bar: "bg-indigo-500", bg: "bg-[#F5F3FF]", iconBg: "bg-indigo-500" },
  "Motorika": { icon: Activity, color: "text-orange-500", bar: "bg-orange-500", bg: "bg-[#FFF9F2]", iconBg: "bg-orange-500" },
  "Sensor": { icon: Fingerprint, color: "text-emerald-500", bar: "bg-emerald-500", bg: "bg-[#F4FDF9]", iconBg: "bg-emerald-500" },
  "O-o'ziga xizmat": { icon: Accessibility, color: "text-amber-500", bar: "bg-amber-500", bg: "bg-[#FFF9F2]", iconBg: "bg-amber-500" },
  "O'yin": { icon: Gamepad2, color: "text-lime-500", bar: "bg-lime-500", bg: "bg-[#FFF9F2]", iconBg: "bg-lime-500" },
};

export type CategoryName = keyof typeof config;

interface CategoryPlanCardProps {
  category: CategoryName;
  progress: number;
  recommendations: string[];
}

export default function CategoryPlanCard({
  category,
  progress,
  recommendations,
}: CategoryPlanCardProps) {
  const { icon: Icon, bar, bg, iconBg } = config[category];

  return (
    <Card className={cn("border-none shadow-xs rounded-[32px] overflow-hidden", bg)}>
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className={cn("p-2 rounded-xl text-white", iconBg)}>
            <Icon size={18} />
          </div>
          <h4 className="font-bold text-slate-800 text-base">{category}</h4>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs text-slate-400 font-bold tracking-tight">Taraqqiyot</span>
            <span className="text-sm font-black text-slate-800">{progress}%</span>
          </div>
          <div className="h-2.5 w-full bg-white/60 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                bar
              )} 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Tavsiya etilgan mashqlar:</p>
          <ul className="space-y-3">
            {recommendations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
