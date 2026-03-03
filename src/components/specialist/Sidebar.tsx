import { Link, useLocation } from "@tanstack/react-router";
import { 
  LayoutGrid, 
  Users, 
  ClipboardList, 
  FileEdit, 
  Calendar, 
  BookOpen, 
  Users2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/assets/images/logo.png";
const sidebarItems = [
  {
    title: "Bosh sahifa",
    icon: LayoutGrid,
    href: "/specialist/dashboard",
  },
  {
    title: "Bemorlarim",
    icon: Users,
    href: "/specialist/patients",
  },
  {
    title: "Diagnostika",
    icon: ClipboardList,
    href: "/specialist/diagnostics",
  },
  {
    title: "AI reja",
    icon: FileEdit,
    href: "/specialist/ai-plan",
  },
  {
    title: "Kunlik reja",
    icon: Calendar,
    href: "/specialist/daily-plan",
  },
  {
    title: "Bilim markazi",
    icon: BookOpen,
    href: "/specialist/knowledge",
  },
  {
    title: "Guruhlar",
    icon: Users2,
    href: "/specialist/groups",
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-[256px] flex-col border-r bg-white">
      <div className="flex h-20 items-center px-6 border-b">
        <Link to="/" className="flex items-center gap-[12px]">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg">
             <img src={Logo} alt="Neuroland" className="w-[47px] h-[37px] object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold leading-none text-black">Neuroland</span>
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
    </div>
  );
}
