import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Play, Loader2, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopicsAPI } from "@/api/topics.api";
import { SessionsAPI } from "@/api/sessions.api";
import { toast } from "sonner";
import type { HomeTask } from "@/types/session.types";

interface AssignHomeworkProps {
  sessionId: number | null;
  childId: number | null;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Kutilmoqda", color: "text-amber-600", bg: "bg-amber-50" },
  submitted: { label: "Topshirilgan", color: "text-blue-600", bg: "bg-blue-50" },
  approved: { label: "Tasdiqlangan", color: "text-emerald-600", bg: "bg-emerald-50" },
  rejected: { label: "Rad etilgan", color: "text-red-600", bg: "bg-red-50" },
};

export default function AssignHomework({ sessionId, childId }: AssignHomeworkProps) {
  const queryClient = useQueryClient();
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [lateDueDate, setLateDueDate] = useState("");
  const [activeTab, setActiveTab] = useState<"assign" | "review">("assign");
  const [reviewingTask, setReviewingTask] = useState<HomeTask | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: exercises } = useQuery({
    queryKey: ["topic-exercises"],
    queryFn: () => TopicsAPI.listExercises(),
  });

  const { data: homeTasks } = useQuery({
    queryKey: ["home-tasks", childId],
    queryFn: () => SessionsAPI.listHomeTasks({ child_id: childId! }),
    enabled: !!childId,
  });

  const submittedTasks = homeTasks?.filter((t) => t.status === "submitted") ?? [];

  const toggleExercise = (id: number) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const { mutate: createTask, isPending } = useMutation({
    mutationFn: () => {
      if (!childId) throw new Error("Bola tanlanmagan");
      if (!selectedExerciseIds.length) throw new Error("Mashq tanlanmagan");
      if (!dueDate) throw new Error("Muddati belgilanmagan");

      const items = selectedExerciseIds.map((exId) => {
        const ex = exercises?.find((e) => e.id === exId);
        return {
          topic_exercise: exId,
          exercise: ex?.exercise ?? undefined,
          title: ex?.exercise_name || ex?.title || `Mashq #${exId}`,
          score_target: 0.5,
          xp_reward: 10,
        };
      });

      return SessionsAPI.createHomeTask({
        child: childId,
        session: sessionId ?? undefined,
        due_date: dueDate,
        late_due_date: lateDueDate || undefined,
        items,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-tasks"] });
      toast.success("Uy vazifasi muvaffaqiyatli yuborildi!");
      setSelectedExerciseIds([]);
      setDueDate("");
      setLateDueDate("");
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail?.[0]?.msg || "Uy vazifasi yuborishda xatolik"),
  });

  const { mutate: reviewTask, isPending: reviewing } = useMutation({
    mutationFn: ({ id, decision }: { id: number; decision: "approved" | "rejected" }) =>
      SessionsAPI.reviewHomeTask(id, {
        decision,
        rejection_reason: decision === "rejected" ? rejectionReason : undefined,
      }),
    onSuccess: (_, { decision }) => {
      queryClient.invalidateQueries({ queryKey: ["home-tasks"] });
      toast.success(decision === "approved" ? "Vazifa tasdiqlandi! (+20 XP)" : "Vazifa rad etildi");
      setReviewingTask(null);
      setRejectionReason("");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  return (
    <Card className="border-none shadow-xs rounded-[32px] bg-white h-full">
      <CardContent className="p-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Uy vazifasi</h3>
            <p className="text-sm text-slate-400">Vazifa berish va ko'rib chiqish</p>
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button onClick={() => setActiveTab("assign")}
              className={cn("px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all",
                activeTab === "assign" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400")}>
              Berish
            </button>
            <button onClick={() => setActiveTab("review")}
              className={cn("px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all relative",
                activeTab === "review" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400")}>
              Ko'rish
              {submittedTasks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
                  {submittedTasks.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "assign" ? (
          <>
            {/* Exercise selection — multiple */}
            {exercises && exercises.length > 0 ? (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Mashqlarni tanlang ({selectedExerciseIds.length} ta tanlandi)
                </p>
                <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-2">
                  {exercises.map((ex) => {
                    const isSelected = selectedExerciseIds.includes(ex.id);
                    return (
                      <div key={ex.id} onClick={() => toggleExercise(ex.id)}
                        className={cn("relative cursor-pointer rounded-[16px] border-2 transition-all p-4",
                          isSelected ? "border-blue-500 bg-blue-50" : "border-slate-100 bg-slate-50 hover:border-slate-200")}>
                        <div className="flex items-center gap-3">
                          <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all shrink-0",
                            isSelected ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-transparent")}>
                            <Check size={14} strokeWidth={4} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-slate-700 truncate">
                              {ex.exercise_name || ex.title || `Mashq #${ex.id}`}
                            </p>
                            {ex.video_title && (
                              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                <Play size={10} /> {ex.video_title}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-[13px] text-slate-400 bg-slate-50 rounded-2xl">
                Mashqlar mavjud emas
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Topshirish muddati</p>
                <div className="relative">
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-14 bg-[#F8FAFC] border border-slate-100 rounded-2xl pl-6 pr-12 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                  <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kechikkan muddat</p>
                <div className="relative">
                  <input type="date" value={lateDueDate} onChange={(e) => setLateDueDate(e.target.value)}
                    className="w-full h-14 bg-[#F8FAFC] border border-slate-100 rounded-2xl pl-6 pr-12 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                  <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            <Button onClick={() => createTask()} disabled={isPending || !childId || !selectedExerciseIds.length || !dueDate}
              className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl text-white font-bold text-base shadow-lg shadow-blue-100 transition-all disabled:opacity-50">
              {isPending ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Yuborilmoqda...</> : `Yuborish (${selectedExerciseIds.length} ta mashq)`}
            </Button>
          </>
        ) : (
          /* Review tab */
          <div className="space-y-4">
            {!childId ? (
              <div className="py-12 text-center text-[13px] text-slate-400 bg-slate-50 rounded-2xl">Avval bolani tanlang</div>
            ) : !homeTasks?.length ? (
              <div className="py-12 text-center text-[13px] text-slate-400 bg-slate-50 rounded-2xl">Uy vazifalari mavjud emas</div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {homeTasks.map((task) => {
                  const st = STATUS_MAP[task.status] ?? STATUS_MAP.pending;
                  return (
                    <div key={task.id} className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", st.bg, st.color)}>{st.label}</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock size={10} /> {task.due_date}</span>
                        </div>
                        {task.status === "submitted" && (
                          <button onClick={() => setReviewingTask(reviewingTask?.id === task.id ? null : task)}
                            className="text-blue-600 text-[11px] font-bold flex items-center gap-1 hover:underline">
                            <Eye size={12} /> Ko'rib chiqish
                          </button>
                        )}
                      </div>
                      <div className="text-[13px] font-medium text-slate-700">
                        {task.items?.map((i) => i.title).join(", ") || "Uy vazifasi"}
                      </div>
                      {task.items?.length > 1 && (
                        <p className="text-[11px] text-slate-400">{task.items.length} ta mashq · Jami {task.items.reduce((s, i) => s + i.xp_reward, 0)} XP</p>
                      )}

                      {/* Review panel */}
                      {reviewingTask?.id === task.id && (
                        <div className="border-t border-slate-200 pt-3 space-y-3 mt-2">
                          {task.evidence_file && (
                            <a href={task.evidence_file} target="_blank" rel="noreferrer"
                              className="text-[12px] text-blue-600 underline flex items-center gap-1">
                              <Play size={12} /> Dalilni ko'rish
                            </a>
                          )}
                          {task.rejection_reason && (
                            <p className="text-[12px] text-red-500 bg-red-50 rounded-lg p-2">Oldingi rad: {task.rejection_reason}</p>
                          )}
                          <textarea placeholder="Rad etish sababi (ixtiyoriy)..." value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full h-20 bg-white border border-slate-200 rounded-xl p-3 text-[13px] outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
                          <div className="flex gap-2">
                            <Button onClick={() => reviewTask({ id: task.id, decision: "approved" })} disabled={reviewing}
                              className="flex-1 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-bold gap-2">
                              <CheckCircle2 className="w-4 h-4" />Tasdiqlash (+20 XP)
                            </Button>
                            <Button onClick={() => reviewTask({ id: task.id, decision: "rejected" })} disabled={reviewing}
                              className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[12px] font-bold gap-2">
                              <XCircle className="w-4 h-4" />Rad etish
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
