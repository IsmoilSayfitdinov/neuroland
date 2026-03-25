import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft, Loader2, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGroups } from "@/hooks/admin/useGroups";
import { SkillsAPI } from "@/api/skills.api";
import { SessionsAPI } from "@/api/sessions.api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { CustomTimePicker } from "@/components/ui/custom-time-picker";

export default function AssignHomeworkAdmin() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const groupId = Number(id);
  const queryClient = useQueryClient();

  const { useGroupDetail } = useGroups();
  const { data: group, isLoading: groupLoading } = useGroupDetail(groupId);

  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [lateDueDate, setLateDueDate] = useState("");
  const [lateDueTime, setLateDueTime] = useState("");

  const { data: ageGroups, isLoading: sectionsLoading } = useQuery({
    queryKey: ["skills-age-groups"],
    queryFn: () => SkillsAPI.listAgeGroups(),
  });
  const sections = ageGroups?.flatMap((ag) =>
    ag.sections.map((s) => ({ ...s, ageGroupName: ag.name }))
  );

  const effectiveSectionId = activeSectionId ?? sections?.[0]?.id ?? null;

  const { data: exercises, isLoading: exercisesLoading } = useQuery({
    queryKey: ["skills-exercises-by-section", effectiveSectionId],
    queryFn: () => SkillsAPI.listExercisesBySection(effectiveSectionId!),
    enabled: !!effectiveSectionId,
  });

  const children = group?.children ?? [];

  const toggleExercise = (exId: number) =>
    setSelectedExerciseIds((prev) =>
      prev.includes(exId) ? prev.filter((x) => x !== exId) : [...prev, exId]
    );

  const { mutate: submit, isPending } = useMutation({
    mutationFn: async () => {
      if (!children.length) throw new Error("Guruhda bolalar yo'q");
      if (!selectedExerciseIds.length) throw new Error("Kamida 1 ta mashq tanlang");
      if (!dueDate) throw new Error("Topshirish muddatini belgilang");

      const dueDatetime = dueTime ? `${dueDate}T${dueTime}` : dueDate;
      const lateDatetime = lateDueDate
        ? lateDueTime ? `${lateDueDate}T${lateDueTime}` : lateDueDate
        : undefined;

      const items = selectedExerciseIds.map((exId) => {
        const ex = exercises?.find((e) => e.id === exId);
        return { exercise: exId, title: ex?.name || `Mashq #${exId}`, score_target: 0.5, xp_reward: 10 };
      });

      await Promise.all(
        children.map((child) =>
          SessionsAPI.createHomeTask({
            child: child.id,
            due_date: dueDatetime,
            late_due_date: lateDatetime,
            items,
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-tasks"] });
      toast.success(`Uy vazifasi ${children.length} ta bolaga yuborildi!`);
      navigate({ to: "/admin/groups/$id", params: { id: String(groupId) } });
    },
    onError: (err: any) =>
      toast.error(err?.message || err?.response?.data?.detail || "Xatolik yuz berdi"),
  });

  if (groupLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/admin/groups/$id", params: { id: String(groupId) } })}
          className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
        >
          <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
        </button>
        <h1 className="text-[20px] font-bold text-[#2D3142]">Uy vazifa berish</h1>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
        {/* Title */}
        <div>
          <h2 className="text-[17px] font-bold text-[#2D3142]">Uyga vazifa belgilash</h2>
          {group && (
            <p className="text-[13px] text-[#9EB1D4] mt-0.5">
              {group.name} · {children.length} ta bola
            </p>
          )}
        </div>

        {/* Section tabs */}
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wide">Bo'limlar</span>
          {sectionsLoading ? (
            <div className="flex items-center gap-2 text-[13px] text-[#9EB1D4]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Yuklanmoqda...</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sections?.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setActiveSectionId(s.id); setSelectedExerciseIds([]); }}
                  className={cn(
                    "h-9 px-4 rounded-xl text-[13px] font-semibold border transition-all",
                    effectiveSectionId === s.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-[#2D3142] border-gray-200 hover:border-gray-300"
                  )}
                >
                  {s.name} <span className="text-[11px] opacity-70">({s.ageGroupName})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exercise list */}
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          {exercisesLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-[#9EB1D4]" />
            </div>
          ) : !exercises?.length ? (
            <div className="py-10 text-center text-[13px] text-[#9EB1D4]">
              Bu bo'limda mashqlar yo'q
            </div>
          ) : (
            exercises.map((ex) => {
              const isSelected = selectedExerciseIds.includes(ex.id);
              return (
                <div
                  key={ex.id}
                  onClick={() => toggleExercise(ex.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-gray-50 last:border-0 transition-colors",
                    isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                    isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                  )}>
                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                  <span className={cn(
                    "flex-1 text-[14px] transition-colors",
                    isSelected ? "font-semibold text-[#2D3142]" : "font-medium text-[#5A6484]"
                  )}>
                    {ex.name}
                  </span>
                  {isSelected && (
                    <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                      Tanlandi
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Due date row 1 */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[12px] text-[#9EB1D4] font-medium">Uy vazifa topshirish muddati</label>
            <CustomDatePicker
              value={dueDate}
              onChange={setDueDate}
              placeholder="Sanani tanlang"
            />
          </div>
          <div className="w-44 flex flex-col gap-1.5">
            <label className="text-[12px] text-[#9EB1D4] font-medium">Vaqti</label>
            <CustomTimePicker
              value={dueTime}
              onChange={setDueTime}
              placeholder="Vaqt"
            />
          </div>
        </div>

        {/* Due date row 2 */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[12px] text-[#9EB1D4] font-medium">Kechikkan uy vazifa muddati</label>
            <CustomDatePicker
              value={lateDueDate}
              onChange={setLateDueDate}
              placeholder="Sanani tanlang"
              minDate={dueDate || undefined}
            />
          </div>
          <div className="w-44 flex flex-col gap-1.5">
            <label className="text-[12px] text-[#9EB1D4] font-medium">Vaqti</label>
            <CustomTimePicker
              value={lateDueTime}
              onChange={setLateDueTime}
              placeholder="Vaqt"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate({ to: "/admin/groups/$id", params: { id: String(groupId) } })}
            className="flex-1 h-12 bg-white border border-gray-200 rounded-xl text-[14px] font-bold text-[#2D3142] hover:bg-gray-50 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => submit()}
            disabled={isPending || !children.length || !selectedExerciseIds.length || !dueDate}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-[14px] font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Yuborish
          </button>
        </div>
      </div>
    </div>
  );
}
