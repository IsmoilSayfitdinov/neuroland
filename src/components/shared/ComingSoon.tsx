import { Wrench } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export default function ComingSoon({ 
  title = "Bu bo'lim hali ishlab chiqilmoqda",
  description = "Biz farzandingiz uchun shakllantiriladigan yillik yo'l xaritasini tayyorlayapmiz. Tez orada bu yerda batafsil reja paydo bo'ladi."
}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-[24px] p-12 shadow-sm border border-gray-50 min-h-[450px] text-center">
      <div className="relative mb-8 flex items-center justify-center">
        {/* Outer dashed circle with animation */}
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#3B82F6] animate-[spin_10s_linear_infinite]" />
        
        {/* Inner solid circle with icon */}
        <div className="absolute w-16 h-16 rounded-full bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-100">
          <Wrench className="w-8 h-8 text-white" />
        </div>
      </div>

      <h2 className="text-[22px] font-bold text-[#1E293B] mb-3">
        {title}
      </h2>
      <p className="text-[15px] text-[#768093] max-w-[520px] leading-relaxed mb-10">
        {description}
      </p>

      <Link
        to="/parent/dashboard"
        className="bg-[#3B82F6] text-white font-bold text-[15px] px-10 py-3.5 rounded-2xl hover:bg-[#2563EB] transition-all active:scale-95 shadow-lg shadow-blue-200"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
