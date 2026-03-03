import { ChevronRight } from "lucide-react";
import DiagnosticsHeader from "@/components/specialist/Diagnostics/DiagnosticsHeader";
import SkillScoringTable from "@/components/specialist/Diagnostics/SkillScoringTable";
import DiagnosticsSidebar from "@/components/specialist/Diagnostics/DiagnosticsSidebar";

export default function Diagnostics() {
  return (
    <div className="flex flex-col gap-2 pb-8">
      <DiagnosticsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Scoring Area */}
        <div className="lg:col-span-8 space-y-4">
          <SkillScoringTable />
          
          {/* Collapsed Section Example */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs px-6 py-4 flex items-center justify-between cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-slate-800">O'yin</h3>
              <span className="text-xs text-slate-400 font-medium">3 ko'nikma</span>
            </div>
            <ChevronRight className="text-slate-400 w-5 h-5" />
          </div>
        </div>

        {/* Analytics Sidebar */}
        <div className="lg:col-span-4">
          <DiagnosticsSidebar />
        </div>
      </div>
    </div>
  );
}
