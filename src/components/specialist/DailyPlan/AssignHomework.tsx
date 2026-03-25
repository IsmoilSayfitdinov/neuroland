import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SkillsAPI } from "@/api/skills.api";
import { SessionsAPI } from "@/api/sessions.api";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

interface Child {
  id: number;
  fio: string;
}

interface AssignHomeworkProps {
  sessionId?: number | null;
  children: Child[];
  onCancel?: () => void;
}

export default function AssignHomework({ sessionId, children, onCancel }: AssignHomeworkProps) {
  const queryClient = useQueryClient();
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

  const toggleExercise = (id: number) =>
    setSelectedExerciseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const { mutate: submit, isPending } = useMutation({
    mutationFn: async () => {
      if (!children.length) throw new Error("Guruhda bolalar yo'q");
      if (!selectedExerciseIds.length) throw new Error("Mashq tanlanmagan");
      if (!dueDate) throw new Error("Topshirish muddati belgilanmagan");

      const dueDatetime = dueTime ? `${dueDate}T${dueTime}` : dueDate;
      const lateDatetime = lateDueDate
        ? lateDueTime ? `${lateDueDate}T${lateDueTime}` : lateDueDate
        : undefined;

      const items = selectedExerciseIds.map((exId) => {
        const ex = exercises?.find((e) => e.id === exId);
        return {
          exercise: exId,
          title: ex?.name || `Mashq #${exId}`,
          score_target: 0.5,
          xp_reward: 10,
        };
      });

      await Promise.all(
        children.map((child) =>
          SessionsAPI.createHomeTask({
            child: child.id,
            session: sessionId ?? undefined,
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
      setSelectedExerciseIds([]);
      setDueDate("");
      setDueTime("");
      setLateDueDate("");
      setLateDueTime("");
      onCancel?.();
    },
    onError: (err: any) =>
      toast.error(err?.message || err?.response?.data?.detail || "Uy vazifasi yuborishda xatolik"),
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Section label + tabs */}
      <div className="space-y-3">
        <p className="text-[13px] font-bold text-[#9EB1D4] uppercase tracking-wide">Mavzular</p>
        {sectionsLoading ? (
          <div className="flex items-center gap-2 text-[13px] text-[#9EB1D4]">
            <Loader2 className="w-4 h-4 animate-spin" /> Yuklanmoqda...
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sections?.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={cn(
                  "h-9 px-4 rounded-xl text-[13px] font-bold transition-all",
                  effectiveSectionId === section.id
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-[#2D3142] hover:bg-gray-50"
                )}
              >
                {section.name} <span className="text-[11px] opacity-70">({section.ageGroupName})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Exercise list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {exercisesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-[#9EB1D4]" />
          </div>
        ) : !exercises?.length ? (
          <div className="py-12 text-center text-[13px] text-[#9EB1D4]">
            Bu bo'limda mashqlar mavjud emas
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {exercises.map((ex) => {
              const isSelected = selectedExerciseIds.includes(ex.id);
              return (
                <div
                  key={ex.id}
                  onClick={() => toggleExercise(ex.id)}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors",
                    isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 bg-white"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                  </div>
                  <span className="flex-1 text-[14px] font-medium text-[#2D3142]">{ex.name}</span>
                  {isSelected && (
                    <span className="text-[12px] font-bold text-blue-500 shrink-0">Mashq ball</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Date + time fields */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1.5">
            <p className="text-[12px] text-[#9EB1D4] font-medium">Uy vazifa topshirish muddati</p>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="Topshirish kunini belgilang"
              className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-[13px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-[#C5D0E6]"
            />
          </div>
          <div className="w-44 space-y-1.5">
            <p className="text-[12px] text-[#9EB1D4] font-medium">Vaqti</p>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              placeholder="Vaqtini kiriting"
              className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-[13px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-[#C5D0E6]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1.5">
            <p className="text-[12px] text-[#9EB1D4] font-medium">Kechikkan uy vazifa muddati</p>
            <input
              type="date"
              value={lateDueDate}
              onChange={(e) => setLateDueDate(e.target.value)}
              placeholder="Topshirish kunini belgilang"
              className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-[13px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-[#C5D0E6]"
            />
          </div>
          <div className="w-44 space-y-1.5">
            <p className="text-[12px] text-[#9EB1D4] font-medium">Vaqti</p>
            <input
              type="time"
              value={lateDueTime}
              onChange={(e) => setLateDueTime(e.target.value)}
              placeholder="Vaqtini kiriting"
              className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-[13px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-[#C5D0E6]"
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 h-12 bg-white border border-gray-200 rounded-xl text-[14px] font-bold text-[#2D3142] hover:bg-gray-50 transition-colors"
          >
            Bekor qilish
          </button>
        )}
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
  );
}
