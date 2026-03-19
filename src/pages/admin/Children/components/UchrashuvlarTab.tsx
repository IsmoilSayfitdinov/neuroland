import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MeetingsAPI } from "@/api/meetings.api";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import type { ChildDetailOut } from "@/types/children.types";
import { formatDate } from "@/lib/utils";
import { Loader2, Calendar, Plus, X, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { toast } from "sonner";

interface Props {
  child: ChildDetailOut;
}

const inputCls = "w-full h-[46px] bg-[#F8F9FB] rounded-[10px] px-4 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4]";
const textareaCls = "w-full bg-[#F8F9FB] rounded-[10px] px-4 py-3 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4] resize-none";

export function UchrashuvlarTab({ child }: Props) {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGoalReviewModal, setShowGoalReviewModal] = useState<number | null>(null);

  const { data: allMeetings, isLoading } = useQuery({
    queryKey: ["monthly-meetings"],
    queryFn: () => MeetingsAPI.listMonthlyMeetings(),
  });

  const { useSpecialistsList } = useSpecialists();
  const { data: specialists } = useSpecialistsList();

  const { mutate: deleteMeeting } = useMutation({
    mutationFn: (id: number) => MeetingsAPI.deleteMonthlyMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-meetings"] });
      toast.success("Uchrashuv o'chirildi");
    },
    onError: () => toast.error("Xatolik"),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  const meetings = (allMeetings ?? []).filter((m) => m.child === child.id);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-[#9EB1D4]">Oylik rivojlanish uchrashuvlari</p>
        <button onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-[10px] transition-colors">
          <Plus className="w-3.5 h-3.5" />Uchrashuv yaratish
        </button>
      </div>

      {!meetings.length ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center py-16">
          <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-[#9EB1D4] font-medium">Uchrashuvlar mavjud emas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date)).map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-[14px] font-bold text-[#2D3142]">{formatDate(meeting.scheduled_date)}</span>
                  <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full",
                    meeting.is_completed ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                    {meeting.is_completed ? "Yakunlangan" : "Kutilmoqda"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowGoalReviewModal(meeting.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <MessageSquare className="w-3 h-3" />Maqsad ko'rish
                  </button>
                  <button onClick={() => deleteMeeting(meeting.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {meeting.notes && (
                <p className="text-[13px] text-[#5A6484] leading-relaxed bg-gray-50 rounded-xl p-3">{meeting.notes}</p>
              )}

              {/* Goal reviews */}
              {meeting.goal_reviews?.length > 0 && (
                <div className="border-t border-gray-50 pt-3 space-y-2">
                  <p className="text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wider">Maqsad ko'rib chiqildi:</p>
                  {meeting.goal_reviews.map((gr) => (
                    <div key={gr.id} className="flex items-center justify-between text-[12px] bg-emerald-50/50 rounded-lg p-2.5">
                      <span className="text-[#2D3142] font-medium">{gr.exercise_name}</span>
                      <span className={cn("font-bold", gr.is_completed ? "text-emerald-600" : "text-amber-600")}>
                        {gr.is_completed ? "Bajarildi" : "Davom etmoqda"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <CreateMeetingModal
          childId={child.id}
          specialistOptions={specialists?.map((s) => ({ label: `${s.fio} (${s.specialist_type_title})`, value: s.id.toString() })) ?? []}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Goal Review Modal */}
      {showGoalReviewModal && (
        <GoalReviewModal meetingId={showGoalReviewModal} onClose={() => setShowGoalReviewModal(null)} />
      )}
    </div>
  );
}

/* ─── Create Meeting Modal ─── */
function CreateMeetingModal({ childId, specialistOptions, onClose }: {
  childId: number;
  specialistOptions: { label: string; value: string }[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ specialist: "", date: "", summary: "", recommendations: "" });

  const { mutate, isPending } = useMutation({
    mutationFn: () => MeetingsAPI.createMonthlyMeeting({
      child: childId,
      specialist: form.specialist ? Number(form.specialist) : undefined,
      date: form.date || undefined,
      scheduled_date: form.date || undefined,
      summary: form.summary || null,
      recommendations: form.recommendations || null,
      notes: [form.summary, form.recommendations].filter(Boolean).join("\n\n") || null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-meetings"] });
      toast.success("Uchrashuv yaratildi!");
      onClose();
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] w-full max-w-[460px] p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#2D3142]">Uchrashuv yaratish</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><X className="w-4 h-4 text-[#9EB1D4]" /></button>
        </div>
        <div className="space-y-4">
          <CustomSelect label="Mutaxassis" options={specialistOptions} value={form.specialist}
            onChange={(val) => setForm((p) => ({ ...p, specialist: val.toString() }))} placeholder="Mutaxassis tanlang..." bgBtnColor="bg-[#F8F9FB]" />
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#2D3142]">Sana</label>
            <CustomDatePicker value={form.date} onChange={(v) => setForm((p) => ({ ...p, date: v }))} placeholder="Sanani tanlang" className="bg-[#F8F9FB] border-none rounded-[10px]" />
          </div>
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#2D3142]">Xulosa</label>
            <textarea rows={3} className={textareaCls} placeholder="Oylik natijalari muhokamasi..." value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#2D3142]">Tavsiyalar</label>
            <textarea rows={3} className={textareaCls} placeholder="Uyda ko'proq kitob o'qing..." value={form.recommendations} onChange={(e) => setForm((p) => ({ ...p, recommendations: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50">Bekor qilish</button>
          <button onClick={() => form.date && mutate()} disabled={!form.date || isPending}
            className="flex-1 h-[46px] rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yaratish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Goal Review Modal ─── */
function GoalReviewModal({ meetingId, onClose }: { meetingId: number; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [reviews, setReviews] = useState<{ monthly_goal_item: string; comment: string }[]>([
    { monthly_goal_item: "", comment: "" },
  ]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => MeetingsAPI.addGoalReviews(
      meetingId,
      reviews.filter((r) => r.monthly_goal_item).map((r) => ({
        monthly_goal_item: Number(r.monthly_goal_item),
        comment: r.comment,
      }))
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-meetings"] });
      toast.success("Maqsadlar ko'rib chiqildi!");
      onClose();
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const addRow = () => setReviews((p) => [...p, { monthly_goal_item: "", comment: "" }]);
  const updateRow = (idx: number, key: string, value: string) =>
    setReviews((p) => p.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] w-full max-w-[500px] p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#2D3142]">Maqsadlarni ko'rib chiqish</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><X className="w-4 h-4 text-[#9EB1D4]" /></button>
        </div>

        <div className="space-y-4">
          {reviews.map((r, idx) => (
            <div key={idx} className="bg-[#F8F9FB] rounded-xl p-4 space-y-3">
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-[#2D3142]">Maqsad ID (monthly_goal_item)</label>
                <input type="number" className={inputCls} placeholder="1" value={r.monthly_goal_item}
                  onChange={(e) => updateRow(idx, "monthly_goal_item", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-[#2D3142]">Izoh</label>
                <input className={inputCls} placeholder="Yaxshi rivojlanmoqda" value={r.comment}
                  onChange={(e) => updateRow(idx, "comment", e.target.value)} />
              </div>
            </div>
          ))}
          <button onClick={addRow} className="text-[12px] font-bold text-blue-600 hover:underline flex items-center gap-1">
            <Plus className="w-3 h-3" />Yana qo'shish
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50">Bekor qilish</button>
          <button onClick={() => mutate()} disabled={isPending || !reviews.some((r) => r.monthly_goal_item)}
            className="flex-1 h-[46px] rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}
