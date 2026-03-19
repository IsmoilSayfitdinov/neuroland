import { useState } from "react";
import { Lock, Trash2, Edit2 } from "lucide-react";
import type { VideoOut } from "@/types/videos.types";
import { useVideos } from "@/hooks/admin/useVideos";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { VideoFormModal } from "./VideoFormModal";

interface KnowledgeVideoCardProps {
  video: VideoOut;
}

export function KnowledgeVideoCard({ video }: KnowledgeVideoCardProps) {
  const { useDeleteVideo } = useVideos();
  const deleteMutation = useDeleteVideo();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(video.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      }
    });
  };

  const placeholderImage = "https://images.unsplash.com/photo-1543269865-cbf4f23b7625?auto=format&fit=crop&q=80&w=400&h=250";

  return (
    <>
      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
        {/* Thumbnail Container */}
        <div className="relative h-[200px] w-full bg-gray-100 overflow-hidden">
          <img 
            src={video.thumbnail_url || placeholderImage} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Lock Icon Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[42px] h-[42px] bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          {/* Duration Tag */}
          {video.duration && (
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-[6px]">
              {video.duration}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-[16px] font-bold text-[#2D3142] mb-3">{video.title}</h3>
          
          {/* Equipment needed */}
          <div className="mb-6">
            <p className="text-[11px] text-[#9EB1D4] font-medium mb-1">Kerakli jihozlar:</p>
            <p className="text-[13px] text-[#2D3142]">{video.equipments || "-"}</p>
          </div>

          {/* Actions Bottom */}
          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-10 h-10 rounded-[12px] border border-red-100 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="w-10 h-10 rounded-[12px] border border-[#E0E7FF] text-[#4D89FF] flex items-center justify-center hover:bg-[#F0F5FF] transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Videoni o'chirish"
        description={`"${video.title}" videosini haqiqatan ham o'chirmoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.`}
        isLoading={deleteMutation.isPending}
      />

      <VideoFormModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        video={video}
      />
    </>
  );
}
