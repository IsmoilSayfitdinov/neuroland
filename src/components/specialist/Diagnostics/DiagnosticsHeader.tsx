import { cn } from "@/lib/utils";
import type { SectionOut } from "@/types/skills.types";

interface DiagnosticsHeaderProps {
  sections: SectionOut[];
  activeSectionId: number | null;
  onSectionChange: (id: number) => void;
}

export default function DiagnosticsHeader({ sections, activeSectionId, onSectionChange }: DiagnosticsHeaderProps) {

  return (
    <div className="space-y-6 mb-8">
      <h1 className="text-2xl font-bold text-slate-800">Diagnostika</h1>
      
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border",
              activeSectionId === section.id 
                ? "bg-white text-slate-800 shadow-sm border-slate-100" 
                : "bg-slate-100/50 text-slate-400 border-transparent hover:bg-slate-100"
            )}
          >
            {section.name}
          </button>
        ))}
      </div>
    </div>
  );
}
