import { useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Users, Calendar, Play, Loader2, VideoOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TopicsAPI } from "@/api/topics.api";
import { SkillsAPI } from "@/api/skills.api";
import type { TopicExercise } from "@/types/topic.types";

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${fmt(start)} — ${fmt(end)}`;
}

function ExerciseCard({ exercise }: { exercise: TopicExercise }) {
  const hasVideo = !!exercise.video_url;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
        <BookOpen className="w-5 h-5 text-[#4D89FF]" />
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-bold text-[#2D3142] leading-snug">{exercise.title}</h3>

      {/* Notes */}
      {exercise.notes && (
        <p className="text-[13px] text-[#9EB1D4] leading-relaxed flex-1">{exercise.notes}</p>
      )}

      {/* Video button */}
      <button
        onClick={() => hasVideo && window.open(exercise.video_url!, "_blank")}
        disabled={!hasVideo}
        className={`w-full h-[42px] rounded-xl text-[13px] font-bold transition-colors flex items-center justify-center gap-2 mt-auto ${
          hasVideo
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-100 text-[#9EB1D4] cursor-not-allowed"
        }`}
      >
        {hasVideo ? (
          <>
            <Play className="w-4 h-4 fill-white" />
            Videoni ko'rish
          </>
        ) : (
          <>
            <VideoOff className="w-4 h-4" />
            Video mavjud emas
          </>
        )}
      </button>
    </div>
  );
}

export default function TopicDetail() {
  const { topicId } = useParams({ strict: false });
  const navigate = useNavigate();

  const { data: topic, isLoading } = useQuery({
    queryKey: ["topic", topicId],
    queryFn: () => TopicsAPI.getTopicById(Number(topicId)),
  });

  const { data: ageGroups } = useQuery({
    queryKey: ["age-groups"],
    queryFn: () => SkillsAPI.listAgeGroups(),
  });

  const categoryName = (() => {
    if (!topic?.category || !ageGroups) return null;
    for (const ag of ageGroups) {
      const section = ag.sections.find((s) => s.id === topic.category);
      if (section) return `${section.name} (${ag.name})`;
    }
    return `Kategoriya #${topic.category}`;
  })();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!topic) return null;

  const groupNames = topic.group_assignments.map((g) => g.group_name);

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate({ to: "/specialist/topics" })}
          className="flex items-center gap-2 text-[#9EB1D4] hover:text-[#2D3142] transition-colors w-fit text-[14px] font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Orqaga
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-[22px] font-bold text-[#2D3142] leading-snug">{topic.title}</h1>
            {categoryName && (
              <span className="shrink-0 px-3 py-1 bg-[#EEF4FF] text-[#4D89FF] text-[12px] font-bold rounded-full">
                {categoryName}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {groupNames.length > 0 ? (
              groupNames.map((name, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-[#5A6484]">
                  <Users className="w-4 h-4 text-[#9EB1D4] shrink-0" />
                  <span>{name}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 text-[13px] text-[#9EB1D4]">
                <Users className="w-4 h-4 shrink-0" />
                <span>Guruh biriktirilmagan</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-[13px] text-[#9EB1D4]">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{formatDateRange(topic.start_date, topic.end_date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[18px] font-bold text-[#2D3142]">
          Mashqlar ({topic.exercises.length})
        </h2>

        {topic.exercises.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-[#9EB1D4] font-medium">Mashqlar mavjud emas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {topic.exercises.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
