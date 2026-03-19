import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  TrendingUp, 
  Brain, 
  AlertTriangle, 
  HeartHandshake 
} from "lucide-react";

export const adminStats = [
  {
    title: "Faol bolalar",
    value: "142",
    icon: Users,
    trend: {
      value: "+12%",
      isPositive: true,
      text: "o'tgan oyga nisbatan",
    },
    iconBgColor: "bg-[#EEF4FF]",
    iconColor: "text-[#4D89FF]",
  },
  {
    title: "Yangi (bu oy)",
    value: "18",
    icon: UserPlus,
    trend: {
      value: "+5",
      isPositive: true,
      text: "o'tgan oydan",
    },
    iconBgColor: "bg-[#EEF4FF]",
    iconColor: "text-[#4D89FF]",
  },
  {
    title: "Bitirganlar",
    value: "23",
    icon: GraduationCap,
    trend: {
      value: "Bu yil",
      isPositive: true,
      text: "",
    },
    iconBgColor: "bg-[#EEF4FF]",
    iconColor: "text-[#4D89FF]",
  },
  {
    title: "O'rtacha o'sish %",
    value: "78%",
    icon: TrendingUp,
    trend: {
      value: "+4%",
      isPositive: true,
      text: "o'tgan chorakdan",
    },
    iconBgColor: "bg-[#EEF4FF]",
    iconColor: "text-[#4D89FF]",
  },
  {
    title: "Aqliy yosh o'sishi",
    value: "3.2 oy",
    icon: Brain,
    trend: {
      value: "O'rtacha oshish",
      isPositive: true,
      text: "",
    },
    iconBgColor: "bg-[#EEF4FF]",
    iconColor: "text-[#4D89FF]",
  },
  {
    title: "Qarzdorlar",
    value: "7",
    icon: AlertTriangle,
    trend: {
      value: "Diqqat talab etadi",
      isWarning: true,
      isPositive: false,
      text: "",
    },
    iconBgColor: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    title: "Ota-onalar faolligi",
    value: "85%",
    icon: HeartHandshake,
    trend: {
      value: "+2%",
      isPositive: true,
      text: "o'tgan oydan",
    },
    iconBgColor: "bg-[#EEF4FF]",
    iconColor: "text-[#4D89FF]",
  },
];
