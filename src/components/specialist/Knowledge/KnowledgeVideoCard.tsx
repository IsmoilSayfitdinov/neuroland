import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, User, Play, CheckCircle2, Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TopicsAPI } from "@/api/topics.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { VideoOut } from "@/types/videos.types";

interface KnowledgeVideoCardProps {
  video: VideoOut;
  sectionName?: string;
  ageGroupName?: string;
  isUnlocked?: boolean;
}

export default function KnowledgeVideoCard({
  video,
  sectionName,
  ageGroupName,
  isUnlocked = true,
}: KnowledgeVideoCardProps) {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const hasExercise = !!video.exercise_id;
  const placeholderImage = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop";

  const { mutate: startExercise, isPending: starting } = useMutation({
    mutationFn: () => TopicsAPI.startExercise(video.exercise_id!),
    onSuccess: () => {
      setIsStarted(true);
      toast.success("Video boshlandi");
    },
    onError: () => toast.error("Videoni boshlashda xatolik"),
  });

  const { mutate: endExercise, isPending: ending } = useMutation({
    mutationFn: () => TopicsAPI.endExercise(video.exercise_id!),
    onSuccess: () => {
      setIsEnded(true);
      queryClient.invalidateQueries({ queryKey: ["topic-exercises"] });
      toast.success("Video yakunlandi!");
      setShowModal(false);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail?.[0]?.msg || err?.response?.data?.detail || "Xatolik";
      toast.error(typeof msg === "string" ? msg : "Xatolik yuz berdi");
    },
  });

  const handleStart = () => {
    if (hasExercise) {
      startExercise();
    }
    setShowModal(true);
  };

  const handleEnd = () => {
    if (hasExercise && isStarted) {
      endExercise();
    } else {
      setShowModal(false);
    }
  };

  return (
    <>
      <Card className="border border-slate-50 shadow-xs rounded-[32px] overflow-hidden bg-white hover:shadow-sm transition-shadow">
        <CardContent className="p-5">
          <div className="relative aspect-[1.3] overflow-hidden rounded-[24px] mb-5 cursor-pointer group" onClick={isUnlocked ? handleStart : undefined}>
            <img src={video.thumbnail_url || placeholderImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={video.title} />
            {!isUnlocked ? (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-800 shadow-xl">
                  <Lock size={18} fill="currentColor" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                  <Play size={22} className="text-blue-600 ml-1" fill="currentColor" />
                </div>
              </div>
            )}
            {isEnded && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                <CheckCircle2 size={12} /> Ko'rildi
              </div>
            )}
          </div>

          <div className="space-y-4 px-1">
            <h4 className="font-bold text-slate-800 text-sm">{video.title}</h4>

            <div className="flex flex-wrap gap-2">
              {sectionName && (
                <span className="bg-[#F8FAFC] text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg">{sectionName}</span>
              )}
              <span className="bg-[#F8FAFC] text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <User size={12} className="text-slate-400" />
                {ageGroupName || "Barcha yoshlar"}
              </span>
              {video.duration && (
                <span className="bg-[#F8FAFC] text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg">{video.duration}</span>
              )}
            </div>

            {video.equipments && (
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-medium">Kerakli jihozlar:</p>
                <p className="text-xs text-slate-700 font-bold">{video.equipments}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button onClick={handleStart} disabled={!isUnlocked || starting || isStarted}
                className={cn("h-10 rounded-xl font-bold text-[11px] border-none",
                  isStarted ? "bg-emerald-100 text-emerald-600" : "bg-blue-600 hover:bg-blue-700 text-white")}>
                {starting ? <Loader2 size={14} className="animate-spin mr-1" /> : isStarted ? <CheckCircle2 size={14} className="mr-1" /> : <Play size={14} className="mr-1" />}
                {isStarted ? "Boshlangan" : "Boshlash"}
              </Button>
              <Button onClick={handleEnd} disabled={!isStarted || ending || isEnded} variant="ghost"
                className={cn("h-10 rounded-xl font-bold text-[11px] border-none",
                  isEnded ? "bg-emerald-50 text-emerald-600" : "bg-[#F8FAFC] hover:bg-slate-100 text-slate-400")}>
                {ending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                {isEnded ? "Yakunlandi" : "Yakunlash"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isStarted && setShowModal(false)} />
          <div className="relative bg-black rounded-[24px] w-full max-w-[800px] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-black/80">
              <h3 className="text-white font-bold text-[14px] truncate">{video.title}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              {video.video_url.includes("youtube") || video.video_url.includes("youtu.be") ? (
                <iframe
                  src={video.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={video.video_url} controls autoPlay className="w-full h-full" />
              )}
            </div>
            {isStarted && !isEnded && (
              <div className="p-4 flex justify-center">
                <Button onClick={handleEnd} disabled={ending}
                  className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[14px] rounded-xl flex items-center gap-2">
                  {ending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Videoni yakunlash
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
