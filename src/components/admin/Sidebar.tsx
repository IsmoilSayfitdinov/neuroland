import { useState } from "react";
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
  FileText,
  Globe,
  CreditCard,
  Stethoscope,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/assets/images/logo.png";
import { useAuthStore } from "@/store/useAuthStore";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Asosiy",
    items: [
      { title: "Bosh sahifa", icon: LayoutGrid, href: "/admin/dashboard" },
    ],
  },
  {
    label: "Boshqaruv",
    items: [
      { title: "Guruhlar",      icon: Users,       href: "/admin/groups" },
      { title: "Mutaxassislar", icon: UserCog,     href: "/admin/specialists" },
      { title: "Bolalar",       icon: Baby,        href: "/admin/child" },
      { title: "Bo'limlar",     icon: Layers,      href: "/admin/departments" },
    ],
  },
  {
    label: "Analitika",
    items: [
      { title: "O'sish tahlili", icon: BarChart3, href: "/admin/growth-analysis" },
      { title: "Faollik",        icon: BarChart2, href: "/admin/activity" },
    ],
  },
  {
    label: "Moliya",
    items: [
      { title: "Moliya",   icon: Wallet,     href: "/admin/finance" },
      { title: "Tariflar", icon: CreditCard, href: "/admin/plans" },
    ],
  },
  {
    label: "Ta'lim & Reja",
    items: [
      { title: "Mavzular",     icon: FileText,      href: "/admin/topics" },
      { title: "Guruh reja",   icon: ClipboardList, href: "/admin/schedule" },
      { title: "Komplekslar",  icon: Stethoscope,   href: "/admin/treatment-complexes" },
      { title: "Bilim markaz", icon: BookOpen,      href: "/admin/knowledge-center" },
    ],
  },
  {
    label: "Tashqi",
    items: [
      { title: "Tadbirlar",     icon: Megaphone, href: "/admin/events" },
      { title: "Yutuqlar",      icon: Trophy,    href: "/admin/achievements" },
      { title: "Landing sahifa",icon: Globe,     href: "/admin/landing" },
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: SidebarProps) {
  const location = useLocation();

  const getInitialOpen = () => {
    const open: Record<string, boolean> = {};
    navGroups.forEach((group) => {
      const hasActive = group.items.some((item) =>
        item.href === "/admin/dashboard"
          ? location.pathname === item.href
          : location.pathname.startsWith(item.href)
      );
      open[group.label] = hasActive || group.label === "Asosiy";
    });
    return open;
  };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(getInitialOpen);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex h-full w-[256px] flex-col bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex h-[72px] items-center px-5 border-b border-gray-50">
        <Link to="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#EEF4FF]">
            <img src={Logo} alt="Neuroland" className="w-[26px] h-[26px] object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold text-[#2D3142]">Neuroland</span>
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-bold rounded-md uppercase tracking-wider leading-none">Beta</span>
            </div>
            <span className="text-[11px] text-[#9EB1D4] mt-0.5">Admin panel</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.label] ?? true;
          const isSingle = group.items.length === 1 && group.label === "Asosiy";

          if (isSingle) {
            const item = group.items[0];
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-all text-[13.5px] font-medium mb-1",
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
          }

          return (
            <div key={group.label} className="mb-1">
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-[10px] hover:bg-[#F8F9FB] transition-colors group"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B0BED4] group-hover:text-[#9EB1D4]">
                  {group.label}
                </span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-[#C8D5E8] transition-transform duration-200",
                    isOpen ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>

              {/* Group items */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="space-y-0.5 pt-0.5">
                  {group.items.map((item) => {
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
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-50">
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
