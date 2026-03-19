import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSkills } from "@/hooks/admin/useSkills";
import { useDiagnostics } from "@/hooks/admin/useDiagnostics";
import { toast } from "sonner";

interface SkillScoringTableProps {
  sectionId: number;
  sectionName: string;
  childId: number | null;
}

export default function SkillScoringTable({ sectionId, sectionName, childId }: SkillScoringTableProps) {
  const { useExercises } = useSkills();
  const { useCreateResult } = useDiagnostics();
  const { data: exercises, isLoading } = useExercises(sectionId);
  const { mutate: createResult, isPending: isSaving } = useCreateResult();

  const [isOpen, setIsOpen] = useState(true);
  const [activeScores, setActiveScores] = useState<Record<number, Record<string, number>>>({});
  const [comment, setComment] = useState("");

  const handleScoreChange = (exerciseId: number, ageRange: string, value: number) => {
    setActiveScores(prev => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {}),
        [ageRange]: value
      }
    }));
  };

  const handleSave = () => {
    if (!childId) {
      toast.error("Iltimos, bolani tanlang!");
      return;
    }

    const answers: any[] = [];
    Object.entries(activeScores).forEach(([exerciseId, scores]) => {
      // The backend expects one score per exercise in the result.
      // However, the UI shows multiple age groups per exercise.
      // Based on common logic for these systems, we might take the average or the latest.
      // For simplicity, let's take the first non-null score for this exercise.
      const scoresArray = Object.values(scores);
      if (scoresArray.length > 0) {
        // Backend expects string: "0.0", "0.5", "1.0"
        const raw = scoresArray[0];
        const score = raw >= 75 ? "1.0" : raw >= 25 ? "0.5" : "0.0";
        answers.push({
          exercise: Number(exerciseId),
          score,
        });
      }
    });

    if (answers.length === 0) {
      toast.error("Hech bo'lmaganda bitta ko'nikmani baholang!");
      return;
    }

    createResult({
      child: childId,
      comment: comment,
      answers: answers
    }, {
      onSuccess: () => {
        toast.success("Natijalar muvaffaqiyatli saqlandi!");
        setActiveScores({});
        setComment("");
      }
    });
  };

  if (isLoading) {
    return <div className="p-4 text-center">Yuklanmoqda...</div>;
  }

  const ageRanges = ["0-1 yosh", "1-2 yosh", "2-3 yosh", "3-4 yosh", "4-5 yosh", "5-6 yosh"];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden mb-6">
      <div 
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-slate-800">{sectionName}</h3>
          <span className="text-xs text-slate-400 font-medium">{exercises?.length || 0} ko'nikma</span>
        </div>
        {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
      </div>

      {isOpen && (
        <div className="px-6 pb-6 space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="pb-2 pl-4">Ko'nikma</th>
                  {ageRanges.map(range => (
                    <th key={range} className="pb-2 text-center whitespace-nowrap px-4">{range}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exercises?.map((exercise) => (
                  <tr key={exercise.id} className="bg-slate-50/30 rounded-xl">
                    <td className="py-4 pl-4 text-xs font-bold text-slate-700">{exercise.name}</td>
                    {ageRanges.map((age) => (
                      <td key={age} className="py-2 px-1">
                        <div className="flex bg-white rounded-lg p-1 border border-slate-100 gap-1 min-w-[120px]">
                          {[0, 50, 100].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleScoreChange(exercise.id, age, val)}
                              className={cn(
                                "flex-1 py-1.5 px-2 rounded-md text-[9px] font-bold transition-all",
                                activeScores[exercise.id]?.[age] === val
                                  ? val === 100 ? "bg-[#2ECC71] text-white" : val === 50 ? "bg-amber-400 text-white" : "bg-red-500 text-white"
                                  : "text-slate-300 hover:text-slate-500"
                              )}
                            >
                              {val}%
                            </button>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Izoh</p>
            <textarea 
              placeholder="Bugungi mashg'ulot natijalarini yozing..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-24 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {isSaving ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
            <Button variant="outline" className="flex-1 border-slate-100 h-11 rounded-xl text-sm font-bold text-slate-400">
              Bekor qilish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
