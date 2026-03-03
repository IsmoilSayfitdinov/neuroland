import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import MonthlyPlanCard from "@/components/specialist/AIPlan/MonthlyPlanCard";
import CategoryPlanCard from "@/components/specialist/AIPlan/CategoryPlanCard";

type MonthlyPlan = {
  month: string;
  status: 'good' | 'average' | 'poor';
  category: string;
  progress: number;
  tasks: string[];
  isActive?: boolean;
};

const months: MonthlyPlan[] = [
  { month: "Yanvar", status: 'good', category: "Diqqat", progress: 75, tasks: ["Diqqat mashqlari - 15 daqiqa", "Rang ajratish o'yinlari", "Xotira takomillash"], isActive: true },
  { month: "Fevral", status: 'average', category: "Nutq", progress: 45, tasks: ["Artikulyatsiya mashqlari", "So'z boyligini oshirish", "Hikoya tuzish"] },
  { month: "Mart", status: 'poor', category: "Emotsional", progress: 30, tasks: ["His-tuyg'ularni ifodalash", "Ijtimoiy ssenariylar", "Empati rivojlantirish"] },
  { month: "Aprel", status: 'good', category: "Sensor", progress: 70, tasks: ["Sensory bin faoliyatlari", "Tekstura tadqiqoti", "Tovush sezgirligini kamaytirish"] },
  { month: "May", status: 'average', category: "Motor", progress: 50, tasks: ["Yirik motor harakatlari", "Muvozanat mashqlari", "Koordinatsiya o'yinlari"] },
  { month: "Iyun", status: 'good', category: "Diqqat", progress: 68, tasks: ["Fokus takomillash", "Impuls nazorati", "Vazifalarni yakunlash"] },
  { month: "Iyul", status: 'average', category: "Nutq", progress: 85, tasks: ["Nutq ritmi", "Fonomatik eshitish", "Qofiya ko'nikmasi"] },
  { month: "Avgust", status: 'good', category: "Kognitiv", progress: 72, tasks: ["Mantiqiy fikrlash", "Masala yechish", "Xotira kengaytirish"] },
  { month: "Sentabr", status: 'poor', category: "Ijtimoiy", progress: 35, tasks: ["Do'stlik ko'nikmasi", "Guruhda ishlash", "Muloqot qilish"] },
  { month: "Oktabr", status: 'average', category: "O-o'ziga", progress: 48, tasks: ["Mustaqil ovqatlanish", "Kiyinish ko'nikmasi", "Shaxsiy gigiyena"] },
  { month: "Noyabr", status: 'good', category: "O'yin", progress: 60, tasks: ["Syujetli o'yinlar", "Qoidalar bilan o'yin", "Ijodiy faoliyat"] },
  { month: "Dekabr", status: 'average', category: "Emotsional", progress: 52, tasks: ["Stressni boshqarish", "O'z-o'zini tartibga solish", "Hissiy barqarorlik"] },
];

type CategoryPlan = {
  category: "Diqqat" | "Nutq" | "Ijtimoiy" | "Emotsional" | "Kognitiv" | "Motorika" | "Sensor" | "O-o'ziga xizmat" | "O'yin";
  progress: number;
  recommendations: string[];
};

const currentMonthPlans: CategoryPlan[] = [
  { category: "Diqqat", progress: 75, recommendations: ["Ranglarni ajratish o'yini - 15 daqiqa", "Narsani topish mashqlari", "Diquat markazini ushlab turish"] },
  { category: "Nutq", progress: 45, recommendations: ["Artikulyatsiya gimnastikasi", "So'z boyligini oshirish", "Hikoyalar tuzish"] },
  { category: "Ijtimoiy", progress: 35, recommendations: ["Rollarni o'ynash", "Guruh o'yinlari", "Muloqot ko'nikmalari"] },
  { category: "Emotsional", progress: 52, recommendations: ["His-tuyg'ularni ifodalash", "Empati mashqlari", "O'z-o'zini boshqarish"] },
  { category: "Kognitiv", progress: 68, recommendations: ["Mantiqiy topshiriqlar", "Xotira o'yinlari", "Masala yechish"] },
  { category: "Motorika", progress: 58, recommendations: ["Yirik motor harakatlar", "Tekislikda tadqiqot", "Muvozanat takomillash"] },
  { category: "Sensor", progress: 70, recommendations: ["Sensory bin", "Tekstura tadqiqoti", "Tovush integratsiyasi"] },
  { category: "O-o'ziga xizmat", progress: 48, recommendations: ["Mustaqil ovqatlanish", "Kiyinish ko'nikmasi", "Gigiyena ko'nikmalari"] },
  { category: "O'yin", progress: 65, recommendations: ["Syujetli o'yinlar", "Ijodiy faoliyat", "Qoidalar bilan o'yin"] },
];

export default function AIPlanDetail() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">AI Rejalashtiruvchi – Guruh uchun 12 oylik rivojlanish dasturi</h1>
          <p className="text-xs text-slate-400">Diagnostika natijalari asosida sun'iy intelekt tomonidan shakllantirilgan</p>
        </div>
        <Button className="bg-blue-50 text-blue-600 hover:bg-blue-100 h-10 px-4 rounded-xl flex items-center gap-2 text-xs font-bold border-none">
          <RefreshCw className="w-3 h-3" />
          Rejani qayta generatsiya qilish
        </Button>
      </div>

      <div className="bg-white rounded-[40px] p-1.5 border border-slate-50 w-full">
        <div className="flex items-center gap-10 p-4">
          <div className="bg-[#F1F5F9]/50 p-2 rounded-[24px] flex items-center gap-4 border border-slate-100 pr-12">
            <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-sm uppercase">
              AK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">Guruh A</span>
                <RefreshCw className="w-3 h-3 text-slate-300" />
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-tight">3-4 yosh</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            Al reja har bir bola uchun individual shakllantiriladi
          </p>
        </div>
      </div>

      {/* 12-Month Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4">
        {months.map((item, idx) => (
          <MonthlyPlanCard key={idx} {...item} />
        ))}
      </div>

      {/* Current Month Detail Section */}
      <div className="mt-12 bg-white rounded-[40px] p-10 border border-slate-50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-slate-800">Joriy oy rejasi — Yanvar</h2>
          <Button variant="ghost" className="bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-10 px-6 rounded-xl flex items-center gap-2 text-xs font-bold border-none">
            <RefreshCw className="w-3.5 h-3.5" />
            Faol oy
          </Button>
        </div>
        <p className="text-sm text-slate-400 mb-10">9 ta asosiy rivojlanish yo'nalishi bo'yicha batafsil reja</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentMonthPlans.map((plan, idx) => (
            <CategoryPlanCard key={idx} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
}
