export type MonthStatus = "Yaxshi" | "O'rta" | "Past";
export type Category = "Diqqat" | "Nutq" | "Emotsional" | "Sensor" | "Motor" | "Kognitiv" | "Ijtimoiy" | "O'z-o'ziga" | "O'yin";

export interface MonthData {
  month: string;
  status: MonthStatus;
  category: Category;
  progress: number;
  tasks: string[];
  isActive?: boolean;
}

export const monthsData: MonthData[] = [
  {
    month: "Yanvar",
    status: "Yaxshi",
    category: "Diqqat",
    progress: 75,
    tasks: [
      "Diqqat mashqlari - 15 daqiqa",
      "Rang ajratish o'yinlari",
      "Xotira takomillash",
    ],
    isActive: true, // The highlighted card in the design
  },
  {
    month: "Fevral",
    status: "O'rta",
    category: "Nutq",
    progress: 45,
    tasks: [
      "Artikulyatsiya mashqlari",
      "So'z boyligini oshirish",
      "Hikoya tuzish",
    ],
  },
  {
    month: "Mart",
    status: "Past",
    category: "Emotsional",
    progress: 30,
    tasks: [
      "His-tuyg'ularni ifodalash",
      "Ijtimoiy stsenariylar",
      "Empati rivojlantirish",
    ],
  },
  {
    month: "Aprel",
    status: "Yaxshi",
    category: "Sensor",
    progress: 70,
    tasks: [
      "Sensory bin faoliyatlari",
      "Tekstura tadqiqoti",
      "Tovush sezgirligini kamaytirish",
    ],
  },
  {
    month: "May",
    status: "O'rta",
    category: "Motor",
    progress: 50,
    tasks: [
      "Yirik motor harakatlari",
      "Muvozanat mashqlari",
      "Koordinatsiya o'yinlari",
    ],
  },
  {
    month: "Iyun",
    status: "Yaxshi",
    category: "Diqqat",
    progress: 65,
    tasks: [
      "Fokus takomillash",
      "Impuls nazorati",
      "Vazifalarni yakunlash",
    ],
  },
  {
    month: "Iyul",
    status: "O'rta",
    category: "Nutq",
    progress: 55,
    tasks: [
      "Nutq ritmi",
      "Fonematik eshitish",
      "Dialog ko'nikmasi",
    ],
  },
  {
    month: "Avgust",
    status: "Yaxshi",
    category: "Kognitiv",
    progress: 72,
    tasks: [
      "Mantiqiy fikrlash",
      "Masala yechish",
      "Xotira kengaytirish",
    ],
  },
  {
    month: "Sentabr",
    status: "Past",
    category: "Ijtimoiy",
    progress: 35,
    tasks: [
      "Do'stlik ko'nikmasi",
      "Guruhda ishlash",
      "Muloqot qilish",
    ],
  },
  {
    month: "Oktabr",
    status: "O'rta",
    category: "O'z-o'ziga",
    progress: 48,
    tasks: [
      "Mustaqil ovqatlanish",
      "Kiyinish ko'nikmasi",
      "Shaxsiy gigiena",
    ],
  },
  {
    month: "Noyabr",
    status: "Yaxshi",
    category: "O'yin",
    progress: 68,
    tasks: [
      "Syujetli o'yinlar",
      "Qoidalar bilan o'yin",
      "Ijodiy faoliyat",
    ],
  },
  {
    month: "Dekabr",
    status: "O'rta",
    category: "Emotsional",
    progress: 52,
    tasks: [
      "Stressni boshqarish",
      "O'z-o'zini tartibga solish",
      "Hissiy barqarorlik",
    ],
  },
];

export const statusColors = {
  Yaxshi: "bg-[#E8FFF3] text-[#3DB87E]",
  "O'rta": "bg-[#FFF4E5] text-[#FF9500]",
  Past: "bg-[#FFEBEB] text-[#FF3B30]",
};

export const statusProgressColors = {
  Yaxshi: "bg-[#3DB87E]",
  "O'rta": "bg-[#FF9500]",
  Past: "bg-[#FF3B30]",
};

export const categoryColors: Record<Category, string> = {
  Diqqat: "bg-[#EEF4FF] text-[#4D89FF]",
  Nutq: "bg-[#F3E8FF] text-[#A855F7]",
  Emotsional: "bg-[#FFE8EC] text-[#FF4D79]",
  Sensor: "bg-[#E8FAFF] text-[#00C2FF]",
  Motor: "bg-[#FFF2E8] text-[#FF8A00]",
  Kognitiv: "bg-[#E8EEFF] text-[#557DE8]",
  Ijtimoiy: "bg-[#E8F8FF] text-[#00A3FF]",
  "O'z-o'ziga": "bg-[#FFFBE8] text-[#F5C200]",
  "O'yin": "bg-[#F0FFE8] text-[#52C41A]",
};
