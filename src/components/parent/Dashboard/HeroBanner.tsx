import { Play, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import ChildIllustration from "@/assets/images/Frame 25.png";
import type { ParentDashboard } from "@/types/analytics.types";

interface Props {
  apiData?: ParentDashboard | null;
}

export default function HeroBanner({ apiData }: Props) {
  const child = apiData?.child;
  const firstName = child?.name?.split(" ")[0] || "Farzand";
  const initial = firstName[0]?.toUpperCase() || "F";
  const ageText = child?.age_text || "—";
  const devPercent = apiData?.overall_percentage ?? 0;
  const growth = apiData?.monthly_growth ?? 0;

  return (
    <div
      className="relative rounded-3xl overflow-hidden text-white"
      style={{ background: "linear-gradient(120deg, #1F61F9 0%, #3DB87E 100%)", minHeight: 200 }}
    >
      <div className="absolute top-[-40px] right-[260px] w-[180px] h-[180px] rounded-full opacity-10 bg-white" />
      <div className="absolute bottom-[-30px] left-[-30px] w-[140px] h-[140px] rounded-full opacity-10 bg-white" />

      <div className="relative z-10 flex items-stretch justify-between px-8 pt-7 pb-7 gap-4">
        <div className="flex flex-col justify-between flex-1">
          <div className="flex items-center gap-3 mb-3">
            {child?.photo ? (
              <img src={import.meta.env.VITE_API_MEDIA_URL + child.photo} alt={firstName} className="w-[52px] h-[52px] rounded-[18px] object-cover" />
            ) : (
              <div className="w-[52px] h-[52px] rounded-[18px] flex items-center justify-center font-bold text-[22px] shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.22)" }}>
                {initial}
              </div>
            )}
            <div>
              <h1 className="text-[22px] font-bold leading-tight">Salom, {firstName}!</h1>
              <p className="text-white/70 text-[13px]">{ageText} · {child?.status === "active" ? "Faol rejim" : "Yangi"}</p>
            </div>
          </div>

          <p className="text-white/80 text-[13.5px] leading-relaxed mb-5 max-w-[340px]">
            Farzandingiz barqaror rivojlanmoqda. Bugun {apiData?.today_tasks?.total ?? 0} mashg'ulot rejalashtirilgan.
          </p>

          <Link to="/parent/tasks" className="self-start cursor-pointer flex items-center gap-2 bg-white text-[#3670E2] font-bold text-[13px] px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95">
            <Play className="w-4 h-4 fill-[#3670E2]" />
            Bugungi mashg'ulotni boshlash
          </Link>
        </div>

        <div className="flex flex-col gap-3 justify-center min-w-[200px]">
          <div className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
            style={{ backgroundColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
            <div>
              <p className="text-[11px] text-white/70 font-medium mb-0.5">O'tgan oyga nisbatan</p>
              <p className="text-[13px] text-white/80">Rivojlanish sur'ati</p>
            </div>
            <div className="flex items-center gap-1 bg-[#22C55E]/20 px-2.5 py-1 rounded-xl">
              <TrendingUp className="w-3.5 h-3.5 text-[#4ade80]" />
              <span className="text-[#4ade80] font-bold text-[13px]">{growth >= 0 ? "+" : ""}{growth}%</span>
            </div>
          </div>

          <div className="rounded-2xl px-4 py-3 flex flex-col items-center justify-center gap-1"
            style={{ backgroundColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
            <p className="text-[32px] font-bold leading-none">{devPercent}%</p>
            <p className="text-[11px] text-white/70">Umumiy rivojlanish</p>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
              <div className="bg-white rounded-full h-1.5 transition-all" style={{ width: `${devPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="w-[200px] shrink-0 self-end">
          <img src={ChildIllustration} alt="Child" className="w-full object-contain" />
        </div>
      </div>
    </div>
  );
}
