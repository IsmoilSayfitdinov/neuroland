import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopicCardProps {
  topic: {
    title: string;
    section: string;
    group: string;
    duration: string;
    themeNumber: number;
  };
  onAddTopic: () => void;
}

export function TopicCard({ topic, onAddTopic }: TopicCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EEF4FF] rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#4D89FF]" />
          </div>
          <h2 className="text-[16px] font-bold text-[#2D3142]">{topic.themeNumber} haftalik mavzu</h2>
        </div>
        <Button 
          onClick={onAddTopic}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-5 rounded-[12px] flex items-center gap-2 text-[14px] font-bold shadow-lg shadow-[#2563EB]/20"
        >
          <Plus className="w-4 h-4" />
          Mavzu qo'shish
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-[#F8F9FB] p-5 rounded-[12px] border-none">
          <div className="text-[12px] text-[#9EB1D4] font-medium mb-1">Mavzu nomi</div>
          <div className="text-[14px] font-bold text-[#2D3142]">{topic.title}</div>
        </div>
        
        <div className="bg-[#F8F9FB] p-5 rounded-[12px] border-none">
          <div className="text-[12px] text-[#9EB1D4] font-medium mb-1">Bo'lim</div>
          <div className="text-[14px] font-bold text-[#2D3142]">{topic.section}</div>
        </div>

        <div className="bg-[#F8F9FB] p-5 rounded-[12px] border-none">
          <div className="text-[12px] text-[#9EB1D4] font-medium mb-1">Guruh</div>
          <div className="text-[14px] font-bold text-[#2D3142]">{topic.group}</div>
        </div>

        <div className="bg-[#F8F9FB] p-5 rounded-[12px] border-none">
          <div className="text-[12px] text-[#9EB1D4] font-medium mb-1">Muddat</div>
          <div className="text-[14px] font-bold text-[#2D3142]">{topic.duration}</div>
        </div>
      </div>
    </div>
  );
}
