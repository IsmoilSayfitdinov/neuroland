import { useState, useMemo } from "react";
import KnowledgeCategoryTabs from "@/components/specialist/Knowledge/KnowledgeCategoryTabs";
import KnowledgeVideoCard from "@/components/specialist/Knowledge/KnowledgeVideoCard";
import { useVideos } from "@/hooks/admin/useVideos";
import { useSkills } from "@/hooks/admin/useSkills";

export default function KnowledgeCenter() {
  const { useVideosList } = useVideos();
  const { useSections } = useSkills();
  const { data: videos, isLoading: videosLoading, isError: videosError } = useVideosList();
  const { data: sections, isLoading: sectionsLoading, isError: sectionsError } = useSections();

  const [activeCategory, setActiveCategory] = useState<string>("Barchasi");

  const filteredVideos = useMemo(() => {
    if (!videos) return [];
    if (activeCategory === "Barchasi") return videos;
    const section = sections?.find(s => s.name === activeCategory);
    if (!section) return [];
    return videos.filter(v => v.section_id === section.id);
  }, [videos, activeCategory, sections]);

  if (videosLoading || sectionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (videosError || sectionsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-red-200 px-10">
          <p className="text-slate-500 font-bold">Videolarni yuklashda xatolik yuz berdi</p>
          <p className="text-slate-400 text-sm mt-1">Sahifani yangilang yoki qayta urinib ko'ring</p>
        </div>
      </div>
    );
  }

  const categoryNames = ["Barchasi", ...(sections?.map(s => s.name) || [])];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <h1 className="text-2xl font-bold text-slate-800">Bilim markazi</h1>

      <div className="bg-white rounded-[40px] p-10 border border-slate-50 space-y-10">
        <KnowledgeCategoryTabs 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categories={categoryNames}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => {
            const section = sections?.find(s => s.id === video.section_id);
            return (
              <KnowledgeVideoCard 
                key={video.id} 
                video={video} 
                sectionName={section?.name}
              />
            );
          })}
        </div>

        {filteredVideos.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            Ushbu bo'limda videolar hozircha mavjud emas
          </div>
        )}
      </div>
    </div>
  );
}
