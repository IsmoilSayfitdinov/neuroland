import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationBell } from "@/components/shared/NotificationBell";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
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

        <NotificationBell basePath="specialist" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#4D89FF] font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
