import { Menu } from "lucide-react";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { useAuthStore } from "@/store/useAuthStore";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const user = useAuthStore((s) => s.user);
  const initials = user?.username
    ? user.username.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "D";

  return (
    <header className="flex h-20 items-center justify-between lg:justify-end border-b bg-white px-4 lg:px-8">
      <button
        className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center justify-end gap-3 lg:gap-6">
        <NotificationBell basePath="specialist" />
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#4D89FF] font-bold text-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}
