import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutGrid,
  ClipboardCheck,
  TrendingUp,
  CalendarRange,
  Trophy,
  BookOpen,
  Baby,
  CreditCard,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/assets/images/logo.png";
import { useAuthStore } from "@/store/useAuthStore";

const sidebarItems = [
  {
    title: "Bosh sahifa",
    icon: LayoutGrid,
    href: "/parent/dashboard",
  },
  {
    title: "Vazifalar",
    icon: ClipboardCheck,
    href: "/parent/tasks",
  },
  {
    title: "Rivojlanish",
    icon: TrendingUp,
    href: "/parent/development",
  },
  {
    title: "Yillik reja",
    icon: CalendarRange,
    href: "/parent/annual-plan",
  },
  {
    title: "Yutuqlar",
    icon: Trophy,
    href: "/parent/achievements",
  },
  {
    title: "Bilim markazi",
    icon: BookOpen,
    href: "/parent/knowledge",
  },
  {
    title: "Bolam ma'lumotlari",
    icon: Baby,
    href: "/parent/child-info",
  },
 
  {
    title: "To'lovlar",
    icon: CreditCard,
    href: "/parent/payments",
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function ParentSidebar({ onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="flex h-full w-[256px] flex-col border-r bg-white shadow-sm lg:shadow-none">
      <div className="flex h-20 items-center justify-between px-6 border-b">
        <Link to="/" className="flex items-center gap-[12px]" onClick={onClose}>
          <div className="w-10 h-10 flex items-center justify-center rounded-lg">
            <img src={Logo} alt="Neuroland" className="w-[47px] h-[37px] object-contain" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-bold leading-none text-black">Neuroland</span>
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-bold rounded-md uppercase tracking-wider leading-none">Beta</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Platform</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium",
                isActive
                  ? "bg-[#EEF4FF] text-[#4D89FF]"
                  : "text-[#9EB1D4] hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive ? "text-[#4D89FF]" : "text-[#9EB1D4]")} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => {
            useAuthStore.getState().logout();
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-400 hover:bg-red-50 transition-colors font-medium"
        >
          <LogIn className="w-6 h-6 rotate-180" />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );
}
