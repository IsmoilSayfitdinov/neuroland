import { ChevronRight } from "lucide-react";
import DiagnosticsHeader from "@/components/specialist/Diagnostics/DiagnosticsHeader";
import SkillScoringTable from "@/components/specialist/Diagnostics/SkillScoringTable";
import DiagnosticsSidebar from "@/components/specialist/Diagnostics/DiagnosticsSidebar";
import { useSkills } from "@/hooks/admin/useSkills";
import { useChildren } from "@/hooks/specialist/useChildren";
import { useState, useEffect } from "react";
import { CustomSelect } from "@/components/ui/custom-select";

export default function Diagnostics() {
  const { useSections } = useSkills();
  const { useChildrenList } = useChildren();
  const { data: sections, isLoading: sectionsLoading, isError: sectionsError } = useSections();
  const { data: children, isLoading: childrenLoading, isError: childrenError } = useChildrenList();

  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  useEffect(() => {
    if (sections && sections.length > 0 && !activeSectionId) {
      setActiveSectionId(sections[0].id);
    }
  }, [sections]);

  useEffect(() => {
    if (children && children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children]);

  if (sectionsLoading || childrenLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (sectionsError || childrenError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-red-200 px-10">
          <p className="text-slate-500 font-bold">Ma'lumotlarni yuklashda xatolik yuz berdi</p>
          <p className="text-slate-400 text-sm mt-1">Sahifani yangilang yoki qayta urinib ko'ring</p>
        </div>
      </div>
    );
  }

  const activeSection = sections?.find(s => s.id === activeSectionId);

  return (
    <div className="flex flex-col gap-2 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <DiagnosticsHeader 
          sections={sections || []} 
          activeSectionId={activeSectionId}
          onSectionChange={setActiveSectionId}
        />
        
        {/* Child Selector */}
        <div className="mb-8 min-w-[200px]">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-2">
            Bola tanlang
          </label>
          <CustomSelect 
            value={selectedChildId || ""} 
            onChange={(val) => setSelectedChildId(Number(val))}
            options={children?.map(child => ({ label: child.fio, value: child.id.toString() })) || []}
            placeholder="Bolani tanlang"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Scoring Area */}
        <div className="lg:col-span-8 space-y-4">
          {activeSection && (
            <SkillScoringTable 
              sectionId={activeSection.id} 
              sectionName={activeSection.name}
              childId={selectedChildId}
            />
          )}
          
          {/* Other sections list */}
          {sections?.filter(s => s.id !== activeSectionId).map(section => (
            <div 
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs px-6 py-4 flex items-center justify-between cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-slate-800">{section.name}</h3>
                <span className="text-xs text-slate-400 font-medium">Bux bo'limni ochish</span>
              </div>
              <ChevronRight className="text-slate-400 w-5 h-5" />
            </div>
          ))}
        </div>

        {/* Analytics Sidebar */}
        <div className="lg:col-span-4">
          <DiagnosticsSidebar childId={selectedChildId} />
        </div>
      </div>
    </div>
  );
}
