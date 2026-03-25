import { useState, useEffect } from "react";
import { Plus, X, CheckCircle2, Clock, FileText } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useMeetings } from "@/hooks/specialist/useMeetings";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MeetingsAPI } from "@/api/meetings.api";
import { toast } from "sonner";
import type { MonthlyMeeting } from "@/types/meetings.types";

interface MeetingsTabProps {
  childId: number;
  childName: string;
  autoOpenModal?: boolean;
  onModalClose?: () => void;
}

export default function MeetingsTab({ childId, childName, autoOpenModal, onModalClose }: MeetingsTabProps) {
  const queryClient = useQueryClient();
  const { useChildMeetings, useCreateMeeting, useUpdateMeeting, useCompleteMeeting } = useMeetings();
  const { useSpecialistsList } = useSpecialists();
  const { data: meetings, isLoading } = useChildMeetings(childId);
  const { data: specialists } = useSpecialistsList();
  const createMeeting = useCreateMeeting();
  const updateMeeting = useUpdateMeeting();
  const completeMeeting = useCompleteMeeting();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedMeetingId, setExpandedMeetingId] = useState<number | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  const { mutate: _addGoalReview } = useMutation({
    mutationFn: ({ meetingId, reviews }: { meetingId: number; reviews: { monthly_goal_item: number; comment: string }[] }) =>
      MeetingsAPI.addGoalReviews(meetingId, reviews),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      toast.success("Maqsad sharhi saqlandi");
      setReviewNote("");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  useEffect(() => {
    if (autoOpenModal) {
      setIsModalOpen(true);
    }
  }, [autoOpenModal]);
  const [form, setForm] = useState({
    scheduled_date: "",
    specialists: [] as number[],
    notes: "",
  });

  const handleCreate = async () => {
    if (!form.scheduled_date) return;
    await createMeeting.mutateAsync({
      child: childId,
      scheduled_date: form.scheduled_date,
      specialists: form.specialists,
      notes: form.notes || null,
    });
    setIsModalOpen(false);
    onModalClose?.();
    setForm({ scheduled_date: "", specialists: [], notes: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-[#9EB1D4]">
          Ota-ona bilan oylik uchrashuv tarixi
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-[12px] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi uchrashuv
        </button>
      </div>

      {/* Meetings list */}
      {!meetings || meetings.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-[#9EB1D4] font-medium">Uchrashuvlar mavjud emas</p>
        </div>
      ) : (
        meetings.map((meeting: MonthlyMeeting) => (
          <div key={meeting.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Meeting header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-[13px]">
                    {childName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-[#2D3142] text-[14px]">{childName}</p>
                  <p className="text-[12px] text-[#9EB1D4]">
                    Ota-ona: — · {formatDate(meeting.scheduled_date)}
                  </p>
                </div>
              </div>
              <span className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold",
                meeting.is_completed
                  ? "bg-[#E8FFF3] text-[#3DB87E]"
                  : "bg-amber-50 text-amber-600"
              )}>
                {meeting.is_completed
                  ? <><CheckCircle2 className="w-3.5 h-3.5" /> Yakunlangan</>
                  : <><Clock className="w-3.5 h-3.5" /> Rejalashtirilgan</>
                }
              </span>
            </div>

            {/* Info */}
            <div className="px-5 py-3 space-y-2">
              <div className="flex items-center gap-4 text-[13px]">
                <span className="text-[#9EB1D4] font-medium">Sana:</span>
                <span className="text-[#2D3142] font-bold">{formatDate(meeting.scheduled_date)}</span>
              </div>
              {meeting.notes && (
                <div className="flex items-start gap-4 text-[13px]">
                  <span className="text-[#9EB1D4] font-medium shrink-0">Izoh:</span>
                  <span className="text-[#2D3142]">{meeting.notes}</span>
                </div>
              )}
            </div>

            {/* Actions & Goal Reviews */}
            <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
              <button
                onClick={() => setExpandedMeetingId(expandedMeetingId === meeting.id ? null : meeting.id)}
                className="flex items-center gap-1.5 text-[12px] font-bold text-[#4D89FF] hover:text-blue-700 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                {meeting.goal_reviews?.length ? `${meeting.goal_reviews.length} ta sharh` : "Sharh qo'shish"}
              </button>

              {!meeting.is_completed && (
                <button
                  onClick={() => completeMeeting.mutate({ id: meeting.id })}
                  disabled={completeMeeting.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Yakunlash
                </button>
              )}
            </div>

            {/* Expanded goal reviews */}
            {expandedMeetingId === meeting.id && (
              <div className="px-5 pb-4 space-y-3 border-t border-gray-50 pt-3">
                {meeting.goal_reviews?.length > 0 && (
                  <div className="space-y-2">
                    {meeting.goal_reviews.map((review) => (
                      <div key={review.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                        <span className="text-[13px] text-[#2D3142] font-medium">{review.exercise_name}</span>
                        <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full",
                          review.is_completed ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {review.is_completed ? "Bajarildi" : "Jarayonda"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Uchrashuv sharhi..."
                    className="flex-1 h-[60px] px-3 py-2 bg-[#F8F9FB] rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                  <button
                    onClick={() => {
                      if (reviewNote.trim()) {
                        // Save note as meeting update via PATCH
                        const existingNotes = meeting.notes || "";
                        const newNotes = existingNotes
                          ? `${existingNotes}\n---\n${reviewNote}`
                          : reviewNote;
                        updateMeeting.mutate({
                          id: meeting.id,
                          data: { notes: newNotes },
                        }, {
                          onSuccess: () => setReviewNote(""),
                        });
                      }
                    }}
                    disabled={updateMeeting.isPending || !reviewNote.trim()}
                    className="self-end px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    Saqlash
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); onModalClose?.(); }} />
          <div className="relative bg-white rounded-[24px] w-full max-w-[440px] p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-[#2D3142]">Yangi uchrashuv yaratish</h3>
              <button
                onClick={() => { setIsModalOpen(false); onModalClose?.(); }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-[#9EB1D4]" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Date */}
              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Sana</label>
                <input
                  type="date"
                  value={form.scheduled_date}
                  onChange={(e) => setForm((p) => ({ ...p, scheduled_date: e.target.value }))}
                  className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] transition-colors"
                />
              </div>

              {/* Specialists */}
              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Mutaxassislar</label>
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {specialists?.map((spec) => (
                    <label key={spec.id} className="flex items-center gap-3 cursor-pointer py-1">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                        form.specialists.includes(spec.id)
                          ? "border-[#4D89FF] bg-[#4D89FF]"
                          : "border-gray-300"
                      )}>
                        {form.specialists.includes(spec.id) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-[13px] text-[#2D3142]">
                        {spec.fio}{" "}
                        <span className="text-[#9EB1D4]">({spec.specialist_type_title})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Tavsiyalar</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Uchrashuv tavsiyalari..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] transition-colors resize-none"
                />
              </div>

              {/* Imzo */}
              <div className="flex items-center gap-2 text-[12px] text-[#9EB1D4]">
                <span>✏️</span>
                <span>Raqamli tasdiqlash avtomatik qo'yiladi</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setIsModalOpen(false); onModalClose?.(); }}
                className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.scheduled_date || createMeeting.isPending}
                className="flex-1 h-[46px] rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-colors disabled:opacity-50"
              >
                {createMeeting.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
