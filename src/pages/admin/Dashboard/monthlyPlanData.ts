import { Eye, MessageSquare, Users, Heart, Brain, Activity, Zap, Hand, Smile } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MonthlyCategoryCard {
  title: string;
  icon: LucideIcon;
  progress: number;
  tasks: string[];
  theme: {
    iconBg: string;
    iconColor: string;
    cardBg: string;
    progressTrack: string;
    progressFill: string;
  };
}

export const monthlyCategories: MonthlyCategoryCard[] = [
  {
    title: "Diqqat",
    icon: Eye,
    progress: 75,
    tasks: [
      "Ranglarni ajratish o'yini - 15 daqiqa",
      "Naqsh topish mashqlari",
      "Diqqat markazini ushlab turish",
    ],
    theme: {
      iconBg: "bg-[#2563EB]",
      iconColor: "text-white",
      cardBg: "bg-[#F4FBFA]", // light teal-ish
      progressTrack: "bg-blue-100",
      progressFill: "bg-[#2563EB]",
    },
  },
  {
    title: "Nutq",
    icon: MessageSquare,
    progress: 45,
    tasks: [
      "Artikulyatsiya gimnastikasi",
      "So'z boyligini oshirish",
      "Hikoyalar tuzish",
    ],
    theme: {
      iconBg: "bg-[#A855F7]",
      iconColor: "text-white",
      cardBg: "bg-[#FCF5FF]", // very light purple
      progressTrack: "bg-purple-100",
      progressFill: "bg-[#A855F7]",
    },
  },
  {
    title: "Ijtimoiy",
    icon: Users,
    progress: 35,
    tasks: [
      "Rolda o'ynash",
      "Guruh ishlari",
      "Do'stlik ko'nikmalari",
    ],
    theme: {
      iconBg: "bg-[#06B6D4]",
      iconColor: "text-white",
      cardBg: "bg-[#FFF5F8]", // light pink
      progressTrack: "bg-cyan-100",
      progressFill: "bg-[#06B6D4]",
    },
  },
  {
    title: "Emotsional",
    icon: Heart,
    progress: 52,
    tasks: [
      "His-tuyg'ularni ifodalash",
      "Empati mashqlari",
      "O'z-o'zini boshqarish",
    ],
    theme: {
      iconBg: "bg-[#EC4899]",
      iconColor: "text-white",
      cardBg: "bg-[#FFFDF5]", // light yellow
      progressTrack: "bg-pink-100",
      progressFill: "bg-[#EC4899]",
    },
  },
  {
    title: "Kognitiv",
    icon: Brain,
    progress: 68,
    tasks: [
      "Mantiqiy topshiriqlar",
      "Xotira o'yinlari",
      "Masala yechish",
    ],
    theme: {
      iconBg: "bg-[#6366F1]",
      iconColor: "text-white",
      cardBg: "bg-[#FFF8F3]", // light orange
      progressTrack: "bg-indigo-100",
      progressFill: "bg-[#6366F1]",
    },
  },
  {
    title: "Motor",
    icon: Activity,
    progress: 58,
    tasks: [
      "Yirik motor harakatlari",
      "Koordinatsiya mashqlari",
      "Muvozanat takomillash",
    ],
    theme: {
      iconBg: "bg-[#F97316]",
      iconColor: "text-white",
      cardBg: "bg-[#FFFDF5]", // light yellow
      progressTrack: "bg-orange-100",
      progressFill: "bg-[#F97316]",
    },
  },
  {
    title: "Sensor",
    icon: Zap,
    progress: 70,
    tasks: [
      "Sensory bin",
      "Tekstura tadqiqoti",
      "Tovush integratsiyasi",
    ],
    theme: {
      iconBg: "bg-[#10B981]",
      iconColor: "text-white",
      cardBg: "bg-[#F2FFF5]", // light green
      progressTrack: "bg-emerald-100",
      progressFill: "bg-[#10B981]",
    },
  },
  {
    title: "O'z-o'ziga xizmat",
    icon: Hand,
    progress: 48,
    tasks: [
      "Mustaqil ovqatlanish",
      "Kiyinish ko'nikmasi",
      "Gigiena ko'nikmalari",
    ],
    theme: {
      iconBg: "bg-[#F59E0B]",
      iconColor: "text-white",
      cardBg: "bg-[#FFFDF5]", // light yellow
      progressTrack: "bg-amber-100",
      progressFill: "bg-[#F59E0B]",
    },
  },
  {
    title: "O'yin",
    icon: Smile,
    progress: 65,
    tasks: [
      "Syujetli o'yinlar",
      "Ijodiy faoliyat",
      "Qoidalar bilan o'yin",
    ],
    theme: {
      iconBg: "bg-[#84CC16]",
      iconColor: "text-white",
      cardBg: "bg-[#FFFDF5]", // light yellow
      progressTrack: "bg-lime-100",
      progressFill: "bg-[#84CC16]",
    },
  },
];
