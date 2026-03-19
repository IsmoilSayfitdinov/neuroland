import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { KnowledgeVideoCard } from "./components/KnowledgeVideoCard";
import { useVideos } from "@/hooks/admin/useVideos";
import { useSkills } from "@/hooks/admin/useSkills";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { VideoFormModal } from "./components/VideoFormModal";
import { CardSkeleton } from "@/components/admin/ui/CardSkeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Video } from "lucide-react";

export default function KnowledgeCenterAdmin() {
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { useVideosList } = useVideos();
  const { useSections } = useSkills();
  
  const { data: videos, isLoading: videosLoading } = useVideosList();
  const { data: sections, isLoading: sectionsLoading } = useSections();

  const filteredVideos = useMemo(() => {
    if (!videos) return [];
    if (!selectedSectionId) return videos;
    return videos.filter(video => video.section_id === selectedSectionId);
  }, [videos, selectedSectionId]);

  if (videosLoading || sectionsLoading) {
    return (
      <div className="mx-auto pb-10 space-y-8">
        <PageHeader title="Bilim markazi" />
        <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
          <CardSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto pb-10 space-y-8">
      {/* Header */}
      <PageHeader 
        title="Bilim markazi" 
        action={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Videodars qo'shish
          </button>
        } 
      />

      <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
        
        {/* Categories Pills */}
        <p className="text-[13px] font-medium text-[#6B7A99] mb-3">Bo'limlar</p>
        <div className="flex flex-wrap gap-3 mb-8">
          <button 
            onClick={() => setSelectedSectionId(null)}
            className={cn(
              "px-6 py-2 rounded-full text-[13px] font-medium transition-colors shadow-sm tracking-wide",
              selectedSectionId === null ? "bg-[#2563EB] text-white" : "bg-[#F8F9FB] text-[#2D3142]"
            )}
          >
            Barchasi
          </button>
          {sections?.map((section) => (
            <button 
              key={section.id} 
              onClick={() => setSelectedSectionId(section.id)}
              className={cn(
                "px-6 py-2 rounded-full text-[13px] font-medium transition-colors border border-transparent hover:border-gray-200",
                selectedSectionId === section.id ? "bg-[#2563EB] text-white" : "bg-[#F8F9FB] text-[#2D3142] hover:bg-gray-100"
              )}
            >
              {section.name}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <KnowledgeVideoCard key={video.id} video={video} />
          ))}

          {filteredVideos.length === 0 && (
            <div className="col-span-full">
              <EmptyState 
                icon={Video}
                title="Videolar topilmadi"
                description={selectedSectionId ? "Ushbu bo'limda hozircha videolar mavjud emas." : "Hozircha bilim markazida videolar mavjud emas."}
                className="border-none shadow-none py-12"
              />
            </div>
          )}
        </div>

      </div>

      <VideoFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
