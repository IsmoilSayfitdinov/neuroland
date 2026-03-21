import { BookOpen, Play, VideoOff, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TopicExercise } from "@/types/topic.types";

interface ExerciseCardProps {
  exercise: TopicExercise;
  onRemove: () => void;
  isRemoving: boolean;
}

export function ExerciseCard({ exercise, onRemove, isRemoving }: ExerciseCardProps) {
  const hasVideo = !!exercise.video_url;

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-[#4D89FF]" />
        </div>
        <button onClick={onRemove} disabled={isRemoving}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors shrink-0">
          {isRemoving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>
      <h3 className="text-[15px] font-bold text-[#2D3142] leading-snug">{exercise.title || exercise.exercise_name}</h3>
      {exercise.instruction && <p className="text-[12px] text-[#9EB1D4] leading-relaxed">{exercise.instruction}</p>}
      {exercise.notes && <p className="text-[12px] text-[#9EB1D4]">{exercise.notes}</p>}
      <button onClick={() => hasVideo && window.open(exercise.video_url!, "_blank")} disabled={!hasVideo}
        className={cn("w-full h-[40px] rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 mt-auto",
          hasVideo ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-100 text-[#9EB1D4] cursor-not-allowed")}>
        {hasVideo ? <><Play className="w-4 h-4 fill-white" />Video</> : <><VideoOff className="w-4 h-4" />Video yo'q</>}
      </button>
    </div>
  );
}
