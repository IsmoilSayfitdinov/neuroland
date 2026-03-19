import { 
  Activity, 
  Hand, 
  Ear, 
  MessageCircle, 
  Heart, 
  Brain, 
  Users, 
  Apple, 
  Sparkles, 
  Eye, 
  Edit3 
} from "lucide-react";

export const SKILL_ICONS = [
  { id: 'Activity', icon: Activity, label: "Motorika" },
  { id: 'Hand', icon: Hand, label: "Mayda motorika" },
  { id: 'Ear', icon: Ear, label: "Sezgi" },
  { id: 'MessageCircle', icon: MessageCircle, label: "Nutq" },
  { id: 'Heart', icon: Heart, label: "Hissiyot" },
  { id: 'Brain', icon: Brain, label: "Bilish" },
  { id: 'Users', icon: Users, label: "Ijtimoiy" },
  { id: 'Apple', icon: Apple, label: "Salomatlik" },
  { id: 'Sparkles', icon: Sparkles, label: "O'zlik" },
  { id: 'Eye', icon: Eye, label: "Ko'rish" },
  { id: 'Edit3', icon: Edit3, label: "Ijod" },
];

export const SKILL_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#EF4444", // Red
  "#0EA5E9", // Sky
  "#EAB308", // Yellow
  "#14B8A6", // Teal
];

export const getIconById = (id: string) => {
  return SKILL_ICONS.find(item => item.id === id)?.icon || Activity;
};
