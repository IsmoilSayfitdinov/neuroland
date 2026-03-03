import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <header className="flex h-20 items-center justify-end border-b bg-white px-8">

      <div className="flex items-center justify-end gap-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9EB1D4]" />
          <Input 
            placeholder="Qidirish..." 
            className="pl-10 bg-[#F5F8FF] border-none rounded-xl h-10 placeholder:text-[#9EB1D4]"
          />
        </div>

        <button className="relative p-2 text-[#2D3142] hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#4D89FF] font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
