import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  scores: {
    "0-1 yosh": number;
    "1-2 yosh": number;
    "2-3 yosh": number;
  };
}

const skills: Skill[] = [
  { id: "1", name: "Tovushni takrorlash", scores: { "0-1 yosh": 50, "1-2 yosh": 100, "2-3 yosh": 0 } },
  { id: "2", name: "So'zlarni tushunish", scores: { "0-1 yosh": 50, "1-2 yosh": 100, "2-3 yosh": 0 } },
  { id: "3", name: "Gaplar tuzish", scores: { "0-1 yosh": 50, "1-2 yosh": 100, "2-3 yosh": 0 } },
  { id: "4", name: "Buyruqlarni bajarish", scores: { "0-1 yosh": 50, "1-2 yosh": 100, "2-3 yosh": 0 } },
];

export default function SkillScoringTable() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeScores, setActiveScores] = useState<Record<string, Record<string, number>>>(
    skills.reduce((acc, skill) => ({
      ...acc,
      [skill.id]: { ...skill.scores }
    }), {})
  );

  const handleScoreChange = (skillId: string, ageRange: string, value: number) => {
    setActiveScores(prev => ({
      ...prev,
      [skillId]: {
        ...prev[skillId],
        [ageRange]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden mb-6">
      <div 
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-slate-800">Nutq</h3>
          <span className="text-xs text-slate-400 font-medium">4 ko'nikma</span>
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
                  <th className="pb-2 text-center">0-1 yosh</th>
                  <th className="pb-2 text-center">1-2 yosh</th>
                  <th className="pb-2 text-center">2-3 yosh</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.id} className="bg-slate-50/30 rounded-xl">
                    <td className="py-4 pl-4 text-xs font-bold text-slate-700">{skill.name}</td>
                    {Object.keys(skill.scores).map((age) => (
                      <td key={age} className="py-2 px-1">
                        <div className="flex bg-white rounded-lg p-1 border border-slate-100 gap-1">
                          {[0, 50, 100].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleScoreChange(skill.id, age, val)}
                              className={cn(
                                "flex-1 py-1.5 px-2 rounded-md text-[9px] font-bold transition-all",
                                activeScores[skill.id][age] === val
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
              className="w-full h-24 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 rounded-xl text-sm font-bold shadow-lg shadow-blue-100">
              Saqlash
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
