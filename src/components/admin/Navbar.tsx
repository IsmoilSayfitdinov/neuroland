import { Search, Globe, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { NotificationBell } from "@/components/shared/NotificationBell";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function AdminNavbar({ onMenuClick }: NavbarProps) {
  const user = useAuthStore((s) => s.user);
  const initials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  return (
    <header className="flex h-20 items-center justify-between lg:justify-end border-b bg-white px-4 lg:px-8">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Right Side Items */}
      <div className="flex items-center justify-end gap-3 lg:gap-6">
        <div className="relative hidden sm:block w-48 lg:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9EB1D4]" />
          <Input
            placeholder="Qidirish..."
            className="pl-10 bg-[#F5F8FF] border-none rounded-xl h-10 placeholder:text-[#9EB1D4]"
          />
        </div>

        {/* Language Toggle */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F8FF] text-[#4D89FF] text-sm font-medium hover:bg-[#EEF4FF] transition-colors">
          <Globe className="w-4 h-4" />
          <span>O'z</span>
        </button>

        {/* Notifications */}
        <NotificationBell basePath="admin" />

        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#4D89FF] font-bold text-sm">
          {initials}
        </div>
      </div>
    </header>
  );
}
