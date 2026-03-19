import { useState, useMemo } from "react";
import { BookOpen, Loader2, AlertCircle, PlaySquare, Film } from "lucide-react";
import { useVideos } from "@/hooks/parent/useVideos";
import {
  useTopicExercises,
  useStartExercise,
  useEndExercise,
} from "@/hooks/parent/useTopicExercises";
import KnowledgeCard from "@/components/parent/Knowledge/KnowledgeCard";
import TopicExerciseCard from "@/components/parent/Knowledge/TopicExerciseCard";
import { cn } from "@/lib/utils";

type MainTab = "exercises" | "videos";

export default function ParentKnowledge() {
  const [mainTab, setMainTab] = useState<MainTab>("exercises");
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

  // Videos data
  const { data: videos, isLoading: videosLoading, isError: videosError } = useVideos();

  // Topic exercises data
  const {
    data: exercises,
    isLoading: exercisesLoading,
    isError: exercisesError,
  } = useTopicExercises();

  const startExercise = useStartExercise();
  const endExercise = useEndExercise();

  // Video sections for filter
  const sections = useMemo(() => {
    if (!videos) return [];
    const map = new Map<number, string>();
    videos.forEach((v) => {
      if (!map.has(v.section_id)) {
        map.set(v.section_id, `Bo'lim ${v.section_id}`);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (!videos) return [];
    if (selectedSectionId === null) return videos;
    return videos.filter((v) => v.section_id === selectedSectionId);
  }, [videos, selectedSectionId]);

  const isLoading = mainTab === "exercises" ? exercisesLoading : videosLoading;
  const isError = mainTab === "exercises" ? exercisesError : videosError;

  return (
    <div className="bg-white rounded-[40px] p-8 min-h-screen">
      <h1 className="text-[28px] font-bold text-[#1E293B] mb-6">Bilim markazi</h1>

      {/* Main Tabs */}
      <div className="flex items-center gap-1 bg-[#F5F8FF] p-1.5 rounded-2xl w-fit mb-8">
        <button
          onClick={() => setMainTab("exercises")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold transition-all",
            mainTab === "exercises"
              ? "bg-[#1F61F9] text-white shadow-sm"
              : "text-[#9EB1D4] hover:text-[#5A6484]"
          )}
        >
          <PlaySquare className="w-4 h-4" />
          Video mashqlar
        </button>
        <button
          onClick={() => setMainTab("videos")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold transition-all",
            mainTab === "videos"
              ? "bg-[#1F61F9] text-white shadow-sm"
              : "text-[#9EB1D4] hover:text-[#5A6484]"
          )}
        >
          <Film className="w-4 h-4" />
          Barcha videolar
        </button>
      </div>

      {/* Videos tab - Section filter */}
      {mainTab === "videos" && (
        <div className="mb-8">
          <p className="text-[14px] text-[#9EB1D4] font-medium mb-3">Bo'limlar</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedSectionId(null)}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-[14px] font-bold transition-all whitespace-nowrap",
                selectedSectionId === null
                  ? "bg-[#1F61F9] text-white"
                  : "bg-[#F8FAFC] text-[#9EB1D4] hover:bg-gray-100"
              )}
            >
              Barchasi
            </button>
            {sections.map(({ id, name }) => (
              <button
                key={id}
                onClick={() => setSelectedSectionId(id)}
                className={cn(
                  "px-6 py-2.5 rounded-2xl text-[14px] font-bold transition-all whitespace-nowrap",
                  selectedSectionId === id
                    ? "bg-[#1F61F9] text-white"
                    : "bg-[#F8FAFC] text-[#9EB1D4] hover:bg-gray-100"
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-[#1F61F9] animate-spin" />
          <p className="text-[#9EB1D4] font-medium">Yuklanmoqda...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-[#1E293B] font-bold">Xatolik yuz berdi</p>
          <p className="text-[#9EB1D4] text-sm">Ma'lumotlarni yuklashda muammo bo'ldi</p>
        </div>
      )}

      {/* Topic Exercises Tab Content */}
      {mainTab === "exercises" && !isLoading && !isError && (
        <>
          {(!exercises || exercises.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <PlaySquare className="w-7 h-7 text-indigo-400" />
              </div>
              <p className="text-[#1E293B] font-bold">Video mashqlar mavjud emas</p>
              <p className="text-[#9EB1D4] text-sm">
                Hozircha sizga biriktirilgan video mashqlar yo'q
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((exercise) => (
                <TopicExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onStart={(id) => startExercise.mutate(id)}
                  onEnd={(id) => endExercise.mutate(id)}
                  isStarting={startExercise.isPending}
                  isEnding={endExercise.isPending}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Videos Tab Content */}
      {mainTab === "videos" && !isLoading && !isError && (
        <>
          {filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-blue-400" />
              </div>
              <p className="text-[#1E293B] font-bold">Videolar mavjud emas</p>
              <p className="text-[#9EB1D4] text-sm">Hozircha bu bo'limda video qo'shilmagan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <KnowledgeCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
