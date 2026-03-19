import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Users, Calendar, Play, Loader2, VideoOff, Plus, X, Trash2, Unlink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopicsAPI } from "@/api/topics.api";
import { SkillsAPI } from "@/api/skills.api";
import { VideosAPI } from "@/api/videos.api";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { CustomSelect } from "@/components/ui/custom-select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { TopicExercise } from "@/types/topic.types";

const inputCls = "w-full h-[46px] bg-[#F8F9FB] rounded-[10px] px-4 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4]";
const textareaCls = "w-full bg-[#F8F9FB] rounded-[10px] px-4 py-3 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4] resize-none";

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) => new Date(d).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${fmt(start)} — ${fmt(end)}`;
}

/* ─── Add Exercise Modal ─── */
function AddExerciseModal({ topicId, onClose }: { topicId: number; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [sectionId, setSectionId] = useState("");
  const [form, setForm] = useState({ exercise: "", video: "", order: "1", instruction: "" });

  const { data: sections } = useQuery({ queryKey: ["sections"], queryFn: () => SkillsAPI.listSections() });

  // Mashqlar tanlangan bo'limga qarab filtrlanadi
  const { data: exercises } = useQuery({
    queryKey: ["exercises-by-section", sectionId],
    queryFn: () => SkillsAPI.listExercisesBySection(Number(sectionId)),
    enabled: !!sectionId,
  });

  // Videolar ro'yxati
  const { data: videos } = useQuery({ queryKey: ["videos-list"], queryFn: () => VideosAPI.listVideos() });

  // Tanlangan mashq nomi — title uchun
  const selectedExercise = exercises?.find((ex) => ex.id === Number(form.exercise));

  const { mutate, isPending } = useMutation({
    mutationFn: () => TopicsAPI.addExercise(topicId, {
      title: selectedExercise?.name || `Mashq #${form.exercise}`,
      exercise: form.exercise ? Number(form.exercise) : undefined,
      video: form.video ? Number(form.video) : undefined,
      order: Number(form.order) || 1,
      instruction: form.instruction || undefined,
    } as any),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-topic"] }); toast.success("Mashq qo'shildi!"); onClose(); },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] w-full max-w-[480px] p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#2D3142]">Mashq qo'shish</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><X className="w-4 h-4 text-[#9EB1D4]" /></button>
        </div>
        <div className="space-y-4">
          {/* Bo'lim tanlash */}
          <CustomSelect
            label="Bo'lim"
            options={sections?.map((s) => ({ label: s.name, value: s.id.toString() })) ?? []}
            value={sectionId}
            onChange={(val) => { setSectionId(val.toString()); set("exercise", ""); }}
            placeholder="Bo'limni tanlang..."
            bgBtnColor="bg-[#F8F9FB]"
          />

          {/* Mashq tanlash */}
          <CustomSelect
            label="Mashq"
            options={exercises?.map((ex) => ({ label: ex.name, value: ex.id.toString() })) ?? []}
            value={form.exercise}
            onChange={(val) => set("exercise", val.toString())}
            placeholder={sectionId ? "Mashqni tanlang..." : "Avval bo'lim tanlang"}
            disabled={!sectionId}
            bgBtnColor="bg-[#F8F9FB]"
          />

          {/* Video tanlash */}
          <CustomSelect
            label="Video (ixtiyoriy)"
            options={videos?.map((v) => ({ label: v.title, value: v.id.toString() })) ?? []}
            value={form.video}
            onChange={(val) => set("video", val.toString())}
            placeholder="Video tanlang..."
            bgBtnColor="bg-[#F8F9FB]"
          />


          {/* Ko'rsatma */}
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#2D3142]">Ko'rsatma (ixtiyoriy)</label>
            <textarea rows={3} className={textareaCls} placeholder="Ushbu videoni bolaga ko'rsating va takrorlashga undang" value={form.instruction} onChange={(e) => set("instruction", e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50">Bekor qilish</button>
          <button onClick={() => form.exercise && mutate()} disabled={!form.exercise || isPending}
            className="flex-1 h-[46px] rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Exercise Card ─── */
function ExerciseCard({ exercise, topicId }: { exercise: TopicExercise; topicId: number }) {
  const queryClient = useQueryClient();
  const hasVideo = !!exercise.video_url;

  const { mutate: removeExercise, isPending } = useMutation({
    mutationFn: () => TopicsAPI.removeExercise(topicId, exercise.id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-topic"] }); toast.success("Mashq olib tashlandi"); },
    onError: () => toast.error("Xatolik"),
  });

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-[#4D89FF]" />
        </div>
        <button onClick={() => removeExercise()} disabled={isPending}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors shrink-0">
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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

/* ─── Page ─── */
export default function TopicDetailAdmin() {
  const { topicId } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: topic, isLoading } = useQuery({
    queryKey: ["admin-topic", topicId],
    queryFn: () => TopicsAPI.getTopicById(Number(topicId)),
  });

  const { data: sections } = useQuery({ queryKey: ["sections"], queryFn: () => SkillsAPI.listSections() });
  const categoryName = topic?.category && sections ? sections.find((s) => s.id === topic.category)?.name : null;

  const { mutate: deleteTopic, isPending: deleting } = useMutation({
    mutationFn: () => TopicsAPI.deleteTopic(Number(topicId)),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-topics"] }); toast.success("Mavzu o'chirildi"); navigate({ to: "/admin/topics" }); },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  const { mutate: detachGroup } = useMutation({
    mutationFn: (groupId: number) => TopicsAPI.detachGroup(Number(topicId), groupId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-topic"] }); toast.success("Guruh uzildi"); },
    onError: () => toast.error("Xatolik"),
  });

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-10 w-10 animate-spin text-blue-500" /></div>;
  if (!topic) return null;

  return (
    <div className="flex flex-col gap-6 pb-10 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate({ to: "/admin/topics" })}
            className="w-9 h-9 bg-white border border-gray-200 rounded-[10px] flex items-center justify-center hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 text-[#2D3142]" />
          </button>
          <h1 className="text-[22px] font-bold text-[#2D3142]">Mavzu tafsilotlari</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors">
            <Plus className="w-4 h-4" />Mashq qo'shish
          </button>
          <button onClick={() => setDeleteModalOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-red-100 hover:bg-red-50 text-red-400 rounded-xl transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Topic info */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[20px] font-bold text-[#2D3142]">{topic.title}</h2>
          {categoryName && <span className="shrink-0 px-3 py-1 bg-[#EEF4FF] text-[#4D89FF] text-[12px] font-bold rounded-full">{categoryName}</span>}
        </div>
        <div className="flex flex-wrap gap-4">
          {topic.group_assignments?.length > 0 ? (
            topic.group_assignments.map((g) => (
              <div key={g.id} className="flex items-center gap-2 text-[13px] text-[#5A6484] bg-gray-50 px-3 py-1.5 rounded-lg">
                <Users className="w-3.5 h-3.5 text-[#9EB1D4]" />
                <span>{g.group_name}</span>
                {g.is_active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                <button onClick={() => detachGroup(g.group)} className="ml-1 text-red-400 hover:text-red-600" title="Guruhdan uzish">
                  <Unlink className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-[13px] text-[#9EB1D4]">
              <Users className="w-3.5 h-3.5" /><span>Guruh biriktirilmagan</span>
            </div>
          )}
          {topic.start_date && topic.end_date && (
            <div className="flex items-center gap-2 text-[13px] text-[#9EB1D4]">
              <Calendar className="w-3.5 h-3.5" /><span>{formatDateRange(topic.start_date, topic.end_date)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Exercises */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#2D3142]">Mashqlar ({topic.exercises?.length || 0})</h2>
      </div>
      {!topic.exercises?.length ? (
        <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
          <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#9EB1D4] font-medium">Mashqlar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topic.exercises.map((ex) => <ExerciseCard key={ex.id} exercise={ex} topicId={topic.id} />)}
        </div>
      )}

      {showAddModal && <AddExerciseModal topicId={topic.id} onClose={() => setShowAddModal(false)} />}
      <ConfirmModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={() => deleteTopic()}
        title="Mavzuni o'chirish" description={`"${topic.title}" mavzusini o'chirmoqchimisiz? Bu qaytarib bo'lmaydi.`} isLoading={deleting} />
    </div>
  );
}
