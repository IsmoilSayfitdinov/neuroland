import { useState } from "react";
import { BookOpen, Users, Calendar, Trash2, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { AssignGroupModal } from "./AssignGroupModal";
import { formatDateRange } from "@/hooks/admin/useTopicsAdminPage";
import type { TopicList } from "@/types/topic.types";

interface TopicCardProps {
  topic: TopicList;
  onDelete: () => void;
  onAssignGroup: (data: { topicId: number; data: any }) => void;
  isAssigning: boolean;
}

export function TopicCard({ topic, onDelete, onAssignGroup, isAssigning }: TopicCardProps) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const navigate = useNavigate();
  const isActive = topic.active_groups?.length > 0;

  return (
    <>
      <div
        onClick={() => navigate({ to: "/admin/topics/$topicId", params: { topicId: String(topic.id) } })}
        className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow relative"
      >
        {isActive && (
          <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-[#E8FFF3] text-[#3DB87E] text-[11px] font-bold rounded-full">Faol</span>
        )}
        <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-[#4D89FF]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-[15px] font-bold text-[#2D3142] pr-14">{topic.title}</h3>
          {topic.start_date && topic.end_date && (
            <p className="text-[12px] text-[#9EB1D4] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateRange(topic.start_date, topic.end_date)}
            </p>
          )}
        </div>
        {topic.active_groups?.length > 0 && (
          <div className="space-y-1.5">
            {topic.active_groups.map((name, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px] text-[#5A6484]">
                <Users className="w-3.5 h-3.5 text-[#9EB1D4]" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={(e) => { e.stopPropagation(); setShowAssignModal(true); }}
            className="flex-1 h-[40px] rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
          >
            <LinkIcon className="w-3.5 h-3.5" />Guruh
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-[40px] h-[40px] rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {showAssignModal && (
        <AssignGroupModal
          topicId={topic.id}
          onClose={() => setShowAssignModal(false)}
          onSave={(data) => { onAssignGroup(data); setShowAssignModal(false); }}
          isPending={isAssigning}
        />
      )}
    </>
  );
}
