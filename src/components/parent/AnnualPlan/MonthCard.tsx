import { CheckCircle2, Lock, ChevronRight, Sparkles } from "lucide-react";

export type MonthStatus = "completed" | "active" | "locked";

interface MonthCardProps {
  monthNumber: number;
  monthName: string;
  status: MonthStatus;
  progress?: number;
  skills?: string[];
}

export default function MonthCard({ 
  monthNumber, 
  monthName, 
  status, 
  progress = 0, 
  skills = [] 
}: MonthCardProps) {
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const isLocked = status === "locked";

  const containerClasses = `
    relative rounded-[24px] p-5 transition-all duration-300 border-2
    ${isCompleted ? "bg-[#F0FDF4] border-[#DCFCE7]" : ""}
    ${isActive ? "bg-[#EFF6FF] border-[#DBEAFE] shadow-lg scale-[1.02]" : ""}
    ${isLocked ? "bg-[#F8FAFC] border-transparent opacity-60" : ""}
  `;

  return (
    <div className={containerClasses}>
      {isActive && (
        <span className="absolute -top-3 right-4 bg-[#3B82F6] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
          Hozirgi
        </span>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`text-xl font-bold ${isLocked ? "text-[#94A3B8]" : "text-[#1E293B]"}`}>
            {monthNumber}-oy
          </h3>
          <p className="text-xs text-[#64748B] font-medium">{monthName}</p>
        </div>
        
        {isCompleted ? (
          <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
        ) : isLocked ? (
          <Lock className="w-5 h-5 text-[#94A3B8]" />
        ) : (
          <div className="w-7 h-7 bg-[#DBEAFE] rounded-full flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-[#3B82F6]" />
          </div>
        )}
      </div>

      {!isLocked && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#64748B] mb-1.5">
            <span>Jarayon</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isCompleted ? "bg-[#22C55E]" : "bg-[#3B82F6]"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {isLocked ? (
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] mt-6">
          <Lock className="w-3.5 h-3.5" />
          <span>Qulflangan</span>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          {skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? "text-[#22C55E]" : "text-[#3B82F6]"}`} />
              <span className={`text-[11px] font-medium ${isCompleted ? "text-[#166534]" : "text-[#1E40AF]"}`}>{skill}</span>
            </div>
          ))}
          {isCompleted && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#166534] pt-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              <span>Tabriklaymiz!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
