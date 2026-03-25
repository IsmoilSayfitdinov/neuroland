import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChildren } from "@/hooks/specialist/useChildren";
import { useTreatmentComplexes } from "@/hooks/admin/useTreatmentComplexes";
import { CustomSelect } from "@/components/ui/custom-select";
import { toast } from "sonner";
import { DiagnosticsAPI } from "@/api/diagnostics.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SectionGroupedExercise } from "@/types/diagnostics.types";
import { PageInfoButton } from "@/components/specialist/PageInfo";

const SCORE_BUTTONS = [
  { value: 0.0, label: "Bajarmadi", color: "bg-red-500", activeColor: "bg-red-500 text-white", idle: "text-slate-400 hover:text-slate-600" },
  { value: 0.5, label: "Yordam bilan", color: "bg-amber-400", activeColor: "bg-amber-400 text-white", idle: "text-slate-400 hover:text-slate-600" },
  { value: 1.0, label: "Mustaqil", color: "bg-emerald-500", activeColor: "bg-emerald-500 text-white", idle: "text-slate-400 hover:text-slate-600" },
];

function getChildIdFromUrl(): number | null {
  const match = window.location.pathname.match(/\/specialist\/diagnostics\/(\d+)/);
  return match ? Number(match[1]) : null;
}

export default function Diagnostics() {
  const queryClient = useQueryClient();
  const childIdFromRoute = getChildIdFromUrl();

  const { useChildrenList } = useChildren();
  const { useList: useTCList } = useTreatmentComplexes();
  const { data: children, isLoading: childrenLoading } = useChildrenList();
  const { data: treatmentComplexes } = useTCList();

  const [selectedChildId, setSelectedChildId] = useState<number | null>(childIdFromRoute);
  const [selectedTCId, setSelectedTCId] = useState<string>("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<Record<number, number>>({});
  const [comment, setComment] = useState("");

  // Auto-select first treatment complex
  useEffect(() => {
    if (treatmentComplexes && treatmentComplexes.length > 0 && !selectedTCId) {
      setSelectedTCId(treatmentComplexes[0].id.toString());
    }
  }, [treatmentComplexes, selectedTCId]);

  useEffect(() => {
    if (childIdFromRoute) {
      setSelectedChildId(childIdFromRoute);
    } else if (children && children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId, childIdFromRoute]);

  const selectedChild = children?.find((c) => c.id === selectedChildId);

  // Fetch questions — only when treatment_complex_id is selected
  const { data: sections, isLoading: questionsLoading, error: questionsError } = useQuery({
    queryKey: ["diagnostics", "questions", selectedTCId],
    queryFn: () => DiagnosticsAPI.getQuestions({ treatment_complex_id: Number(selectedTCId) }),
    enabled: !!selectedTCId,
    retry: false,
  });

  // Auto-open first section
  useEffect(() => {
    if (sections && sections.length > 0) {
      const first = sections[0].name;
      setOpenSections((prev) => {
        if (Object.keys(prev).length === 0) return { [first]: true };
        return prev;
      });
    }
  }, [sections]);

  const { mutate: saveResult, isPending: isSaving } = useMutation({
    mutationFn: (data: { child: number; comment: string; answers: { exercise: number; score: string }[] }) =>
      DiagnosticsAPI.createResult(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnostics"] });
      queryClient.invalidateQueries({ queryKey: ["diagnostics-results", selectedChildId] });
      toast.success("Diagnostika natijalari saqlandi!");
      setScores({});
      setComment("");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail;
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg || "Saqlashda xatolik yuz berdi");
    },
  });

  const toggleSection = (name: string) => {
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const setScore = (exerciseId: number, value: number) => {
    setScores((prev) => ({ ...prev, [exerciseId]: value }));
  };

  const handleSave = () => {
    if (!selectedChildId) {
      toast.error("Bolani tanlang!");
      return;
    }
    const answers = Object.entries(scores).map(([exId, score]) => ({
      exercise: Number(exId),
      score: score.toFixed(1),
    }));
    if (answers.length === 0) {
      toast.error("Kamida bitta mashqni baholang!");
      return;
    }
    saveResult({ child: selectedChildId, comment, answers });
  };

  // Count scored exercises per section
  const getSectionScore = (section: SectionGroupedExercise) => {
    let total = 0;
    let scored = 0;
    section.age_groups.forEach((ag) => {
      ag.exercises.forEach((ex) => {
        total++;
        if (scores[ex.id] !== undefined) scored++;
      });
    });
    return { scored, total };
  };

  if (childrenLoading || questionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  const diagError = (questionsError as any)?.response?.data?.detail || (questionsError as any)?.message;

  if (diagError) {
    return (
      <div className="flex flex-col gap-6 pb-10">
        <h1 className="text-[24px] font-bold text-[#2D3142]">Diagnostika</h1>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-[16px] font-bold text-red-700 mb-2">Xatolik</h3>
          <p className="text-[14px] text-red-600">{diagError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[24px] font-bold text-[#2D3142]">Diagnostika</h1>
            <PageInfoButton title="Diagnostika">
              <p>Bolalarning rivojlanish darajasini aniqlash uchun diagnostika o'tkazish.</p>
              <p><strong>Qanday ishlaydi:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Kompleks va bolani tanlang</li>
                <li>Har bir mashqni baholang (Bajarmadi / Yordam bilan / Mustaqil)</li>
                <li>Izoh qo'shib natijalarni saqlang</li>
                <li>Natijalar avtomatik hisobotga tushadi</li>
              </ul>
            </PageInfoButton>
          </div>
          {childIdFromRoute && selectedChild && (
            <p className="text-[14px] text-[#9EB1D4] mt-1">{selectedChild.fio}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-[220px]">
            <CustomSelect
              value={selectedTCId}
              onChange={(val) => {
                setSelectedTCId(val.toString());
                setScores({});
                setOpenSections({});
              }}
              options={treatmentComplexes?.map((tc) => ({ label: tc.name, value: tc.id.toString() })) || []}
              placeholder="Kompleks tanlang"
              bgBtnColor="bg-white"
            />
          </div>
          {!childIdFromRoute && (
          <div className="min-w-[200px]">
            <CustomSelect
              value={selectedChildId ?? ""}
              onChange={(val) => setSelectedChildId(Number(val))}
              options={children?.map((c) => ({ label: c.fio, value: c.id })) || []}
              placeholder="Bolani tanlang"
              bgBtnColor="bg-white"
            />
          </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 items-start">
        {/* Main content */}
        <div className="lg:col-span-8 space-y-3">
          {!sections || sections.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-[#9EB1D4] font-medium">Diagnostika mashqlari mavjud emas</p>
            </div>
          ) : (
            sections.map((section) => {
              const isOpen = openSections[section.name] ?? false;
              const { scored, total } = getSectionScore(section);

              return (
                <div key={section.name} className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(section.name)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="text-[15px] font-bold text-[#2D3142]">{section.name}</h3>
                      <span className="text-[13px] text-[#9EB1D4] font-medium">{scored}/{total}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#9EB1D4]" /> : <ChevronDown className="w-5 h-5 text-[#9EB1D4]" />}
                  </button>

                  {/* Section content */}
                  {isOpen && (
                    <div className="border-t border-gray-100">
                      {section.age_groups.map((ageGroup) => (
                        <div key={ageGroup.id}>
                          {/* Age group label */}
                          <div className="px-6 py-2 bg-gray-50/80">
                            <span className="text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wider">
                              {ageGroup.name}
                            </span>
                          </div>

                          {/* Exercises */}
                          {ageGroup.exercises.map((exercise) => (
                            <div
                              key={exercise.id}
                              className="flex items-center justify-between px-6 py-3.5 border-b border-gray-50 last:border-b-0"
                            >
                              <span className="text-[14px] text-[#2D3142] font-medium flex-1 pr-4">
                                {exercise.name}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                {SCORE_BUTTONS.map((btn) => {
                                  const isActive = scores[exercise.id] === btn.value;
                                  return (
                                    <button
                                      key={btn.value}
                                      onClick={() => setScore(exercise.id, btn.value)}
                                      className={cn(
                                        "px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all",
                                        isActive ? btn.activeColor : btn.idle
                                      )}
                                    >
                                      {btn.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* Comment & Save (only in open section) */}
                      {openSections[section.name] && (
                        <div className="px-6 py-4 border-t border-gray-100 space-y-3">
                          <div>
                            <p className="text-[12px] font-bold text-[#9EB1D4] mb-2">Izoh</p>
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Bugungi mashg'ulot natijalarini yozing..."
                              className="w-full h-[80px] p-4 bg-[#F8F9FB] border border-transparent rounded-[12px] text-[13px] outline-none focus:bg-white focus:border-[#4D89FF] transition-all resize-none placeholder:text-[#9EB1D4]"
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={handleSave}
                              disabled={isSaving}
                              className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-bold rounded-[12px] transition-colors disabled:opacity-50"
                            >
                              {isSaving ? "Saqlanmoqda..." : "Saqlash"}
                            </button>
                            <button
                              onClick={() => { setScores({}); setComment(""); }}
                              className="px-6 py-2.5 bg-white border border-gray-200 text-[#2D3142] text-[13px] font-medium rounded-[12px] hover:bg-gray-50 transition-colors"
                            >
                              Bekor qilish
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
