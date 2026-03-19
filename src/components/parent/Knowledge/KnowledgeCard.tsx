import React from 'react';
import { Lock, Clock, Wrench, PlayCircle } from 'lucide-react';
import type { VideoOut } from '@/types/videos.types';

interface KnowledgeCardProps {
  video: VideoOut;
  isLocked?: boolean;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ video, isLocked = false }) => {
  const thumbnail = video.thumbnail_url || `https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800`;
  const equipments = video.equipments ? video.equipments.split(',').map(e => e.trim()).filter(Boolean) : [];

  return (
    <div className="bg-white rounded-[32px] p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      {/* Image Section */}
      <div className="relative aspect-video rounded-[24px] overflow-hidden mb-4 bg-gray-100">
        <img
          src={thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800`;
          }}
        />
        {isLocked ? (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6 text-[#1E293B]" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <PlayCircle className="w-8 h-8 text-[#1F61F9]" />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="space-y-3 px-1">
        <h3 className="text-[16px] font-bold text-[#1E293B] leading-tight line-clamp-2">
          {video.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-50 text-[12px] font-bold text-blue-600 rounded-lg">
            Bo'lim {video.section_id}
          </span>
          {video.duration && (
            <span className="px-3 py-1 bg-gray-50 text-[12px] font-bold text-[#1E293B] rounded-lg flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#9EB1D4]" />
              {video.duration}
            </span>
          )}
        </div>

        {/* Equipment */}
        {equipments.length > 0 && (
          <div className="flex items-start gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-[#9EB1D4] mt-0.5 shrink-0" />
            <p className="text-[12px] text-[#9EB1D4] font-medium">{equipments.join(', ')}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <a
            href={video.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-[#1F61F9] hover:bg-[#1853db] text-white text-[13px] font-bold rounded-2xl transition-colors text-center flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            Videoni ko'rish
          </a>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCard;
