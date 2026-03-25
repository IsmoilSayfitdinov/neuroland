import { Rocket, CalendarDays, Target, Sparkles } from "lucide-react";

export default function AnnualPlanPage() {
  return (
    <div className="mx-auto pb-10">
      <h1 className="text-[28px] font-bold text-[#1E293B] mb-6 px-2">Yillik reja</h1>

      <div className="relative bg-gradient-to-br from-[#F0F4FF] via-white to-[#F0FDF4] rounded-[32px] border border-blue-100/50 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-60px] right-[-40px] w-[180px] h-[180px] rounded-full bg-blue-500/5" />
        <div className="absolute bottom-[-30px] left-[-20px] w-[120px] h-[120px] rounded-full bg-emerald-500/5" />

        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-6">
          {/* Animated icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[22px] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-9 h-9 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-sm animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <h2 className="text-[22px] font-bold text-[#2D3142] mb-2 text-center">
            Tez orada ishga tushadi!
          </h2>
          <p className="text-[14px] text-[#768093] text-center max-w-[420px] leading-relaxed mb-8">
            Farzandingizning 12 oylik rivojlanish rejasi tayyorlanmoqda. Bu sahifada oyma-oy maqsadlar va yutuqlarni kuzatib borishingiz mumkin bo'ladi.
          </p>

          {/* Feature preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[560px]">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-[16px] px-4 py-3 border border-gray-100/80">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <CalendarDays className="w-4.5 h-4.5 text-blue-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#2D3142]">12 oy</p>
                <p className="text-[11px] text-[#9EB1D4]">Oylik maqsadlar</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-[16px] px-4 py-3 border border-gray-100/80">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                <Target className="w-4.5 h-4.5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#2D3142]">AI reja</p>
                <p className="text-[11px] text-[#9EB1D4]">Sun'iy intellekt</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-[16px] px-4 py-3 border border-gray-100/80">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-amber-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#2D3142]">Progress</p>
                <p className="text-[11px] text-[#9EB1D4]">Har oylik natija</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
