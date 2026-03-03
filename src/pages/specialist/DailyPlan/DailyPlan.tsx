import { ChevronDown } from "lucide-react";
import DailyJournal from "@/components/specialist/DailyPlan/DailyJournal";
import AssignHomework from "@/components/specialist/DailyPlan/AssignHomework";

export default function DailyPlan() {
  return (
    <div className="flex flex-col gap-6 pb-12">
      <h2 className="text-2xl font-black text-slate-800">Kunlik reja</h2>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="bg-white border border-slate-100 px-6 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-600 shadow-xs hover:bg-slate-50 transition-colors">
            Guruhni tanlang
            <ChevronDown size={16} className="text-slate-400" />
          </button>
        </div>
        
        <button className="bg-white border border-slate-100 px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-600 shadow-xs hover:bg-slate-50 transition-colors">
          Individual tanlash
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mt-4">
        <DailyJournal />
        <AssignHomework />
      </div>
    </div>
  );
}
