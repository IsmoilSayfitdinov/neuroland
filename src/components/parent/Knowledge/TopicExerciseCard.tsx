import { useState } from "react";
import { PlayCircle, CheckCircle2, Clock, X, Loader2 } from "lucide-react";
import type { TopicExercise } from "@/types/topic.types";
import { cn } from "@/lib/utils";

interface TopicExerciseCardProps {
  exercise: TopicExercise;
  onStart: (id: number) => void;
  onEnd: (id: number) => void;
  isStarting: boolean;
  isEnding: boolean;
}

export default function TopicExerciseCard({
  exercise,
  onStart,
  onEnd,
  isStarting,
  isEnding,
}: TopicExerciseCardProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [started, setStarted] = useState(false);

  const hasVideo = !!exercise.video_url;

  const handlePlay = () => {
    if (!hasVideo) return;
    setShowVideo(true);
    if (!started) {
      setStarted(true);
      onStart(exercise.id);
    }
  };

  const handleFinish = () => {
    setShowVideo(false);
    onEnd(exercise.id);
  };

  const handleClose = () => {
    setShowVideo(false);
  };

  // Detect if video_url is embeddable (YouTube, etc.) or direct link
  const getEmbedUrl = (url: string) => {
    // YouTube
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    return url;
  };

  return (
    <>
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
        {/* Thumbnail / Play area */}
        <div
          className="relative aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 cursor-pointer"
          onClick={handlePlay}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg",
                hasVideo
                  ? "bg-white/90 group-hover:scale-110"
                  : "bg-gray-200"
              )}
            >
              <PlayCircle
                className={cn(
                  "w-9 h-9",
                  hasVideo ? "text-[#1F61F9]" : "text-gray-400"
                )}
              />
            </div>
            {!hasVideo && (
              <span className="text-[12px] text-gray-400 font-medium">
                Video mavjud emas
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-[15px] font-bold text-[#1E293B] leading-snug line-clamp-2">
            {exercise.title || exercise.exercise_name}
          </h3>

          {exercise.notes && (
            <p className="text-[13px] text-[#9EB1D4] leading-relaxed line-clamp-2">
              {exercise.notes}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-indigo-50 text-[11px] font-bold text-indigo-600 rounded-lg">
              {exercise.exercise_name}
            </span>
            {exercise.added_by_name && (
              <span className="px-3 py-1 bg-gray-50 text-[11px] font-bold text-[#5A6484] rounded-lg">
                {exercise.added_by_name}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            {hasVideo && (
              <button
                onClick={handlePlay}
                className="flex-1 py-3 px-4 bg-[#1F61F9] hover:bg-[#1853db] text-white text-[13px] font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                {isStarting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlayCircle className="w-4 h-4" />
                )}
                Ko'rishni boshlash
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && hasVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-[16px] font-bold text-[#1E293B] truncate pr-4">
                {exercise.title || exercise.exercise_name}
              </h3>
              <button
                onClick={handleClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors shrink-0"
              >
                <X className="w-5 h-5 text-[#5A6484]" />
              </button>
            </div>

            {/* Video */}
            <div className="aspect-video bg-black">
              {exercise.video_url!.match(
                /(?:youtube\.com|youtu\.be)/
              ) ? (
                <iframe
                  src={getEmbedUrl(exercise.video_url!)}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  src={exercise.video_url!}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-[13px] text-[#9EB1D4]">
                <Clock className="w-4 h-4" />
                Video ko'rilmoqda...
              </div>
              <button
                onClick={handleFinish}
                disabled={isEnding}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-[13px] font-bold rounded-2xl transition-colors disabled:opacity-60"
              >
                {isEnding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Yakunlash
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
