import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutGrid,
  Users,
  UserCog,
  BarChart3,
  Wallet,
  BarChart2,
  LogOut,
  Layers,
  BookOpen,
  Baby,
  Megaphone,
  Trophy,
  ClipboardList,
  Brain,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/assets/images/logo.png";
import { useAuthStore } from "@/store/useAuthStore";

const sidebarItems = [
  { title: "Bosh sahifa",    icon: LayoutGrid,  href: "/admin/dashboard" },
  { title: "Guruhlar",       icon: Users,        href: "/admin/groups" },
  { title: "Mutaxassislar",  icon: UserCog,      href: "/admin/specialists" },
  { title: "Bolalar",        icon: Baby,         href: "/admin/child" },
  { title: "O'sish tahlili", icon: BarChart3,    href: "/admin/growth-analysis" },
  { title: "Moliya",         icon: Wallet,       href: "/admin/finance" },
  { title: "Faollik",        icon: BarChart2,    href: "/admin/activity" },
  { title: "Bo'limlar",      icon: Layers,       href: "/admin/departments" },
  { title: "Bilim markaz",   icon: BookOpen,     href: "/admin/knowledge-center" },
  { title: "Tadbirlar",      icon: Megaphone,    href: "/admin/events" },
  { title: "Yutuqlar",       icon: Trophy,       href: "/admin/achievements" },
  { title: "Mavzular",       icon: FileText,     href: "/admin/topics" },
  { title: "Guruh reja",     icon: ClipboardList,href: "/admin/schedule" },
  { title: "AI reja",        icon: Brain,        href: "/admin/ai-plan" },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="flex h-full w-[256px] flex-col bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex h-[72px] items-center px-5 border-b border-gray-50">
        <Link to="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#EEF4FF]">
            <img src={Logo} alt="Neuroland" className="w-[26px] h-[26px] object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold text-[#2D3142]">Neuroland</span>
            <span className="text-[11px] text-[#9EB1D4] mt-0.5">Admin panel</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/admin/dashboard"
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-all text-[13.5px] font-medium",
                isActive
                  ? "bg-[#EEF4FF] text-[#2563EB]"
                  : "text-[#6B7A99] hover:bg-[#F8F9FB] hover:text-[#2D3142]"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-[10px] flex-shrink-0 transition-colors",
                  isActive ? "bg-[#2563EB] text-white" : "bg-transparent text-[#9EB1D4]"
                )}
              >
                <item.icon className="w-[17px] h-[17px]" />
              </div>
              <span>{item.title}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-gray-50 space-y-1">
        {/* Logout */}
        <button
          onClick={() => {
            useAuthStore.getState().logout();
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[12px] text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors text-[13.5px] font-medium"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-red-50 flex-shrink-0">
            <LogOut className="w-[17px] h-[17px]" />
          </div>
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );
}
