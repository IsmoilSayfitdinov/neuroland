import { useState, useRef } from "react";
import {
  CheckCircle2,
  Eye,
  Circle,
  PlayCircle,
  Upload,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import type { Task } from "./types";
import { SessionsAPI } from "@/api/sessions.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
}

const statusStyles = {
  confirmed: {
    border: "border-[#22C55E80]",
    bg: "bg-[#F0FDF4]",
    badge: "bg-[#22C55E] text-white",
    badgeText: "Tasdiqlangan",
    icon: <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />,
  },
  review: {
    border: "border-[#3B82F680]",
    bg: "bg-[#EFF6FF]",
    badge: "bg-[#3B82F6] text-white",
    badgeText: "Tekshiruvda",
    icon: <Eye className="w-5 h-5 text-[#3B82F6]" />,
  },
  pending: {
    border: "border-gray-100",
    bg: "bg-white",
    badge: "bg-gray-100 text-[#9EB1D4]",
    badgeText: "Bajarilmagan",
    icon: <Circle className="w-5 h-5 text-gray-300" />,
  },
};

export default function TaskCard({ task }: TaskCardProps) {
  const style = statusStyles[task.status];
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !task.homeTaskId) return;
    setIsSubmitting(true);
    try {
      await SessionsAPI.submitHomeTask(task.homeTaskId, selectedFile);
      toast.success("Vazifa muvaffaqiyatli yuborildi!");
      setSelectedFile(null);
      queryClient.removeQueries({ queryKey: ["parent", "home-tasks"] });
      queryClient.refetchQueries({ queryKey: ["parent", "home-tasks"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Yuborishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = task.status === "pending" && !task.hasWarning;

  return (
    <div
      className={`rounded-[24px] p-6 border-2 shadow-sm transition-all ${style.border} ${style.bg}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="mt-1">{style.icon}</div>
          <div>
            <h3 className="font-bold text-[#1E293B] text-[16px]">{task.title}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="bg-gray-100 text-[#1E293B] text-[10px] font-bold px-2 py-0.5 rounded-md">
                {task.category}
              </span>
              <span className="text-[11px] text-[#9EB1D4]">{task.subtitle}</span>
            </div>

            {task.hasWarning && (
              <div className="flex items-center gap-1.5 mt-3 text-[#EF4444]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Rad etilgan — qaytadan yuborishingiz mumkin</span>
              </div>
            )}

            {/* File selection preview */}
            {selectedFile && (
              <div className="flex items-center gap-2 mt-3 bg-blue-50 rounded-lg px-3 py-2">
                <span className="text-[12px] text-blue-600 font-medium truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
                <button onClick={() => setSelectedFile(null)} className="text-blue-400 hover:text-blue-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 mt-4">
              {/* Video button */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 bg-white text-[13px] font-bold text-[#1E293B] hover:bg-gray-50 transition-colors">
                <PlayCircle className="w-4 h-4 text-[#3B82F6]" />
                Video
              </button>

              {/* Upload evidence */}
              {canSubmit && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 bg-white text-[13px] font-bold text-[#1E293B] hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-[#768093]" />
                    Isbot yuklash
                  </button>
                </>
              )}

              {/* Submit button — shown when file selected */}
              {selectedFile && canSubmit && (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#3B82F6] text-white text-[13px] font-bold hover:bg-[#2563EB] transition-colors shadow-blue-200 shadow-lg disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Yuborish"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full shrink-0 ${style.badge}`}>
          {style.badgeText}
        </div>
      </div>
    </div>
  );
}
