import { Trophy } from "lucide-react";

interface PlanSummaryCardProps {
  completedMonths: number;
  totalMonths: number;
}

export default function PlanSummaryCard({ completedMonths, totalMonths }: PlanSummaryCardProps) {
  const percentage = Math.round((completedMonths / totalMonths) * 100);
  const remainingMonths = totalMonths - completedMonths;

  return (
    <div 
      className="rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 mb-8"
      style={{ background: 'linear-gradient(98.96deg, rgba(59, 133, 206, 0.08) 0%, rgba(57, 172, 124, 0.08) 50%, rgba(59, 133, 206, 0.04) 100%)' }}
    >
      <div className="flex items-start gap-4 sm:gap-6 flex-1">
        <div className="bg-white p-4 rounded-2xl shadow-sm hidden sm:block">
          <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-500" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] mb-2 flex items-center gap-3">
             <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500 sm:hidden" />
             {totalMonths} oylik rivojlanish rejasi
          </h2>
          <p className="text-[#64748B] text-sm sm:text-base leading-relaxed max-w-xl">
            Farzandingizning har oylik rivojlanish yo'lini kuzating. Har bir bosqichni muvaffaqiyatli yakunlang va keyingi oyga o'ting!
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[24px] shadow-sm w-full md:w-[320px] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[#64748B] font-medium text-sm">Umumiy jarayon</span>
          <span className="text-xl font-bold text-[#1E293B]">{completedMonths} / {totalMonths}</span>
        </div>
        
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-linear-to-r from-[#3B82F6] to-[#22C55E] rounded-full transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <p className="text-xs text-[#64748B] font-medium">
          {percentage}% bajarildi - {remainingMonths} oy qoldi
        </p>
      </div>
    </div>
  );
}
