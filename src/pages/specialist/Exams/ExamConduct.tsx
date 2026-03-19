import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { ChevronLeft, ChevronDown, ChevronUp, Loader2, User } from "lucide-react";
import { cn, calculateAge } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDiagnostics } from "@/hooks/admin/useDiagnostics";
import { useChildren } from "@/hooks/specialist/useChildren";
import { useExams } from "@/hooks/specialist/useExams";
import { toast } from "sonner";
import type { ExamType, ScoreEnum } from "@/types/exam.types";
import type { SectionGroupedExercise } from "@/types/diagnostics.types";

const SCORE_OPTIONS: { value: ScoreEnum; label: string; activeColor: string }[] = [
  { value: 0.0, label: "Bajarmadi", activeColor: "bg-[#EF4444] text-white" },
  { value: 0.5, label: "Yordam bilan", activeColor: "bg-[#F59E0B] text-white" },
  { value: 1.0, label: "Mustaqil", activeColor: "bg-[#22C55E] text-white" },
];

export default function ExamConduct() {
  const navigate = useNavigate();
  const { patientId } = useParams({ strict: false });
  const search = useSearch({ strict: false }) as { type?: string };
  const examType: ExamType = (search.type as ExamType) || "monthly";
  const childId = Number(patientId);

  const { useQuestions } = useDiagnostics();
  const { useChildDetail } = useChildren();
  const { useCreateResult, useGenerateComparison } = useExams();

  const { data: questions, isLoading: questionsLoading } = useQuestions();
  const { data: child, isLoading: childLoading } = useChildDetail(childId, true);
  const { mutateAsync: createResult, isPending: isSaving } = useCreateResult();
  const { mutateAsync: generateComparison } = useGenerateComparison();

  const [scores, setScores] = useState<Record<number, ScoreEnum>>({});
  const [comment, setComment] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Open first section by default
  useEffect(() => {
    if (questions?.length && Object.keys(openSections).length === 0) {
      setOpenSections({ [questions[0].name]: true });
    }
  }, [questions]);

  // Count scored exercises per section
  const sectionProgress = useMemo(() => {
    if (!questions) return {};
    const result: Record<string, { scored: number; total: number }> = {};
    questions.forEach((section) => {
      let total = 0;
      let scored = 0;
      section.age_groups.forEach((ag) => {
        ag.exercises.forEach((ex) => {
          total++;
          if (scores[ex.id] !== undefined) scored++;
        });
      });
      result[section.name] = { scored, total };
    });
    return result;
  }, [questions, scores]);

  const totalExercises = Object.values(sectionProgress).reduce((a, b) => a + b.total, 0);
  const totalScored = Object.values(sectionProgress).reduce((a, b) => a + b.scored, 0);

  // Sidebar stats
  const totalScore = (Object.values(scores) as number[]).reduce((a, b) => a + b, 0);
  const maxScore = totalExercises;
  const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const chronoMonths = child?.birth_date
    ? Math.floor((Date.now() - new Date(child.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    : 0;
  const mentalMonths = Math.round((scorePercent / 100) * chronoMonths);

  const handleScore = (exerciseId: number, value: ScoreEnum) => {
    setScores((prev) => {
      if (prev[exerciseId] === value) {
        const next = { ...prev };
        delete next[exerciseId];
        return next;
      }
      return { ...prev, [exerciseId]: value };
    });
  };

  const toggleSection = (name: string) => {
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = async () => {
    const answers = Object.entries(scores)
      .filter(([, v]) => v !== undefined)
      .map(([exerciseId, score]) => ({
        exercise: Number(exerciseId),
        score: (score as number).toFixed(1),
        answered_at: new Date().toISOString(),
      }));

    if (answers.length === 0) {
      toast.error("Hech bo'lmaganda bitta mashqni baholang!");
      return;
    }

    try {
      const currentMonth = new Date().getMonth() + 1;
      const result = await createResult({
        child: childId,
        exam_type: examType,
        month_number: currentMonth,
        comment: comment || null,
        answers,
      });

      if (examType === "quarterly") {
        try {
          await generateComparison({
            id: result.id,
            data: { child: childId, exam_type: examType },
          });
          toast.success("Choraklik imtihon saqlandi va AI taqqoslama yaratildi!");
        } catch {
          toast.success("Natijalar saqlandi! (AI taqqoslama keyinroq yaratiladi)");
        }
      } else {
        toast.success("Oylik imtihon natijalari saqlandi!");
      }

      navigate({ to: `/specialist/patients/${patientId}` });
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Xatolik yuz berdi");
    }
  };

  if (questionsLoading || childLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: `/specialist/patients/${patientId}` })}
          className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">
          {examType === "quarterly" ? "Choraklik imtihon" : "Oylik imtihon"}
        </h1>
      </div>

      {/* Child Info Bar */}
      {child && (
        <div className="bg-white rounded-2xl border border-slate-100 px-6 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {child.photo ? (
                  <img src={child.photo} alt={child.fio} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{child.fio}</p>
                <p className="text-xs text-slate-400">{calculateAge(child.birth_date)}</p>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-slate-400 font-medium">Tashxis</span>
              <p className="font-bold text-slate-700">{child.diagnosis || "—"}</p>
            </div>
            <div className="text-xs">
              <span className="text-slate-400 font-medium">Guruh</span>
              <p className="font-bold text-slate-700">{child.group_info?.name || "—"}</p>
            </div>

            {examType === "quarterly" && (
              <>
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Boshlang'ich mental yosh</span>
                  <p className="font-bold text-slate-700">{(chronoMonths / 12).toFixed(1)} yosh</p>
                </div>
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Joriy mental yosh</span>
                  <p className="font-bold text-blue-600">{(mentalMonths / 12).toFixed(1)} yosh</p>
                </div>
              </>
            )}

            {examType === "monthly" && (
              <div className="text-xs">
                <span className="text-slate-400 font-medium">O'rtgan oy natijasi</span>
                <p className="font-bold text-blue-600">{scorePercent}%</p>
              </div>
            )}
          </div>

          {/* Progress bar for monthly */}
          {examType === "monthly" && totalExercises > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Retest jarayoni</span>
                <span className="font-bold text-slate-600">
                  {totalScored} / {totalExercises} baholandi
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${(totalScored / totalExercises) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className={cn("grid gap-6 items-start", examType === "quarterly" ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1")}>
        {/* Main Scoring Area */}
        <div className={cn(examType === "quarterly" ? "lg:col-span-8" : "", "space-y-3")}>
          {questions?.map((section) => (
            <SectionAccordion
              key={section.name}
              section={section}
              isOpen={!!openSections[section.name]}
              onToggle={() => toggleSection(section.name)}
              scores={scores}
              onScore={handleScore}
              progress={sectionProgress[section.name]}
            />
          ))}

          {/* Comment + Save */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <textarea
              placeholder="Imtihon natijalari bo'yicha izoh yozing..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-24 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving || totalScored === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                {isSaving ? "Saqlanmoqda..." : "Natijalarni saqlash"}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: `/specialist/patients/${patientId}` })}
                className="flex-1 border-slate-200 h-12 rounded-xl text-sm font-bold text-slate-500"
              >
                Bekor qilish
              </Button>
            </div>
          </div>
        </div>

        {/* Quarterly Sidebar */}
        {examType === "quarterly" && (
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#FFF9E6] rounded-2xl border border-yellow-100 p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-800">Natija xulosasi</h3>

              <div>
                <p className="text-xs text-slate-400 font-medium">Baholangan ko'nikmalar</p>
                <p className="text-2xl font-bold text-slate-800">
                  {totalScored}{" "}
                  <span className="text-sm text-slate-400 font-medium">/ {totalExercises}</span>
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">O'zlashtirish darajasi</p>
                <p className="text-3xl font-bold text-blue-600">{scorePercent}%</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">Mental yosh</p>
                <p className="text-sm text-slate-500">
                  {totalScored > 0 ? `${(mentalMonths / 12).toFixed(1)} yosh` : "Hisoblanmoqda..."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Bo'limlar bo'yicha</h3>
              {questions?.map((section) => {
                const prog = sectionProgress[section.name];
                const sectionTotal = prog?.total || 0;
                const sectionScoreVal = section.age_groups.reduce(
                  (acc, ag) =>
                    acc + ag.exercises.reduce((a, ex) => a + (scores[ex.id] ?? 0), 0),
                  0
                );
                const pct = sectionTotal > 0 ? Math.round((sectionScoreVal / sectionTotal) * 100) : 0;
                return (
                  <div key={section.name} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium truncate flex-1">{section.name}</span>
                    <span className="font-bold text-slate-800 ml-2">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Section Accordion ─── */

interface SectionAccordionProps {
  section: SectionGroupedExercise;
  isOpen: boolean;
  onToggle: () => void;
  scores: Record<number, ScoreEnum>;
  onScore: (exerciseId: number, value: ScoreEnum) => void;
  progress?: { scored: number; total: number };
}

function SectionAccordion({ section, isOpen, onToggle, scores, onScore, progress }: SectionAccordionProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-800 text-sm">{section.name}</h3>
          <span className="text-xs text-slate-400 font-medium">
            {progress?.scored || 0}/{progress?.total || 0}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          {section.age_groups.map((ageGroup) => (
            <div key={ageGroup.id} className="mb-4 last:mb-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2 border-b border-slate-50 mb-2">
                {ageGroup.name}
              </div>
              <div className="space-y-2">
                {ageGroup.exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm text-slate-700 font-medium flex-1 pr-4">
                      {exercise.name}
                    </span>
                    <div className="flex gap-2">
                      {SCORE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => onScore(exercise.id, opt.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                            scores[exercise.id] === opt.value
                              ? opt.activeColor
                              : "bg-white border border-slate-200 text-slate-400 hover:border-slate-300"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
