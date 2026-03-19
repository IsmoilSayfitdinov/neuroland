import { useState } from "react";
import { BookOpen, Users, Calendar, Plus, Loader2, X, RefreshCw, Link as LinkIcon, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { TopicsAPI } from "@/api/topics.api";
import { GroupsAPI } from "@/api/groups.api";
import { SkillsAPI } from "@/api/skills.api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { CustomSelect } from "@/components/ui/custom-select";
import type { TopicList } from "@/types/topic.types";

const inputCls = "w-full h-[46px] bg-[#F8F9FB] rounded-[10px] px-4 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4]";
const textareaCls = "w-full bg-[#F8F9FB] rounded-[10px] px-4 py-3 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4] resize-none";

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) => new Date(d).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${fmt(start)} — ${fmt(end)}`;
}

/* ─── Create Topic Modal ─── */
function CreateTopicModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: "", description: "", category: "", start_date: "", end_date: "" });

  const { data: sections } = useQuery({ queryKey: ["sections"], queryFn: () => SkillsAPI.listSections() });

  const { mutate, isPending } = useMutation({
    mutationFn: () => TopicsAPI.createTopic({
      title: form.title,
      description: form.description || null,
      category: form.category ? Number(form.category) : null,
      start_date: form.start_date || undefined,
      end_date: form.end_date || undefined,
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-topics"] }); toast.success("Mavzu yaratildi!"); onClose(); },
    onError: () => toast.error("Mavzu yaratishda xatolik"),
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] w-full max-w-[480px] p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#2D3142]">Yangi mavzu yaratish</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><X className="w-4 h-4 text-[#9EB1D4]" /></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#2D3142]">Mavzu nomi</label>
            <input className={inputCls} placeholder="Masalan: Hayvonlar olami" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#2D3142]">Tavsif (ixtiyoriy)</label>
            <textarea rows={3} className={textareaCls} placeholder="Mavzu haqida qisqa tavsif" value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <CustomSelect
            label="Kategoriya (ixtiyoriy)"
            options={sections?.map((s) => ({ label: s.name, value: s.id.toString() })) ?? []}
            value={form.category}
            onChange={(val) => set("category", val.toString())}
            placeholder="Kategoriya tanlang..."
            bgBtnColor="bg-[#F8F9FB]"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#2D3142]">Boshlanish</label>
              <CustomDatePicker value={form.start_date} onChange={(v) => set("start_date", v)} placeholder="Sana" className="bg-[#F8F9FB] border-none rounded-[10px]" />
            </div>
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#2D3142]">Tugash</label>
              <CustomDatePicker value={form.end_date} onChange={(v) => set("end_date", v)} placeholder="Sana" className="bg-[#F8F9FB] border-none rounded-[10px]" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50">Bekor qilish</button>
          <button onClick={() => form.title.trim() && mutate()} disabled={!form.title.trim() || isPending}
            className="flex-1 h-[46px] rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yaratish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Assign Group Modal ─── */
function AssignGroupModal({ topicId, onClose }: { topicId: number; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [weekStart, setWeekStart] = useState("");

  const { data: groups } = useQuery({ queryKey: ["groups"], queryFn: () => GroupsAPI.listGroups() });

  const { mutate, isPending } = useMutation({
    mutationFn: () => TopicsAPI.assignGroup(topicId, { group: selectedGroupId!, week_start: weekStart } as any),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-topics"] }); toast.success("Guruh biriktirildi!"); onClose(); },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] w-full max-w-[420px] p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#2D3142]">Guruhga biriktirish</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><X className="w-4 h-4 text-[#9EB1D4]" /></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {groups?.map((g) => (
              <div key={g.id} onClick={() => setSelectedGroupId(g.id)}
                className={cn("p-3 rounded-xl cursor-pointer border-2 transition-all",
                  selectedGroupId === g.id ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200")}>
                <p className="text-[14px] font-bold text-[#2D3142]">{g.name}</p>
                {g.age_group_name && <p className="text-[12px] text-[#9EB1D4]">{g.age_group_name}</p>}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#2D3142]">Hafta boshlanishi</label>
            <CustomDatePicker value={weekStart} onChange={setWeekStart} placeholder="2 haftalik davr boshlanishi" className="bg-[#F8F9FB] border-none rounded-[10px]" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50">Bekor qilish</button>
          <button onClick={() => selectedGroupId && mutate()} disabled={!selectedGroupId || isPending}
            className="flex-1 h-[46px] rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Biriktirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Topic Card ─── */
function TopicCard({ topic, onDelete }: { topic: TopicList; onDelete: () => void }) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const navigate = useNavigate();
  const isActive = topic.active_groups?.length > 0;

  return (
    <>
      <div onClick={() => navigate({ to: "/admin/topics/$topicId", params: { topicId: String(topic.id) } })}
        className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow relative">
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
          <button onClick={(e) => { e.stopPropagation(); setShowAssignModal(true); }}
            className="flex-1 h-[40px] rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200">
            <LinkIcon className="w-3.5 h-3.5" />Guruh
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-[40px] h-[40px] rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 shrink-0">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {showAssignModal && <AssignGroupModal topicId={topic.id} onClose={() => setShowAssignModal(false)} />}
    </>
  );
}

/* ─── Page ─── */
export default function TopicsAdmin() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: topics, isLoading } = useQuery({
    queryKey: ["admin-topics"],
    queryFn: () => TopicsAPI.listTopics(),
  });

  const { mutate: deleteTopic } = useMutation({
    mutationFn: (id: number) => TopicsAPI.deleteTopic(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-topics"] }); toast.success("Mavzu o'chirildi!"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  const { mutate: rotateTopics, isPending: rotating } = useMutation({
    mutationFn: () => TopicsAPI.rotateTopics(),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-topics"] }); toast.success("Mavzular rotatsiya qilindi!"); },
    onError: () => toast.error("Rotatsiyada xatolik"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Mavzular boshqaruvi" />
        <div className="flex items-center justify-center min-h-[300px]"><Loader2 className="h-10 w-10 animate-spin text-blue-500" /></div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#2D3142]">Mavzular boshqaruvi</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => rotateTopics()} disabled={rotating}
            className="flex items-center gap-2 h-10 px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[12px] font-bold rounded-xl transition-colors disabled:opacity-60">
            {rotating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Rotatsiya
          </button>
          <button onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors">
            <Plus className="w-4 h-4" />Yangi mavzu
          </button>
        </div>
      </div>

      {!topics?.length ? (
        <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
          <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#9EB1D4] font-medium">Mavzular mavjud emas</p>
          <button onClick={() => setShowCreateModal(true)}
            className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white text-[13px] font-bold rounded-[10px]">
            <Plus className="w-4 h-4" />Mavzu yaratish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} onDelete={() => deleteTopic(topic.id)} />
          ))}
        </div>
      )}

      {showCreateModal && <CreateTopicModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}
