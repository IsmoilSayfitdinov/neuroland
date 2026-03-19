import type { ChildDetailOut } from "@/types/children.types";
import { BarChart3 } from "lucide-react";


interface DetailedAnalysisSidebarProps {
  child: ChildDetailOut;
}

export function DetailedAnalysisSidebar({ child }: DetailedAnalysisSidebarProps) {
  // Get metrics from the latest diagnostic result if available
  const latestResult = child.diagnostic_results?.[child.diagnostic_results.length - 1];
  
  const metrics = latestResult?.answers ? Object.values(
    latestResult.answers.reduce((acc, current) => {
      if (!acc[current.section_name]) {
        acc[current.section_name] = { label: current.section_name, total: 0, count: 0 };
      }
      acc[current.section_name].total += current.score;
      acc[current.section_name].count += 1;
      return acc;
    }, {} as Record<string, { label: string; total: number; count: number }>)
  ).map(section => ({
    label: section.label,
    value: Math.round((section.total / (section.count * 10)) * 100), 
    color: section.label.toLowerCase().includes("nutq") ? "bg-[#F39C12]" : (section.label.toLowerCase().includes("motor") ? "bg-[#2ECC71]" : "bg-[#2196F3]")
  })) : [
    { label: "Nutq darajasi", value: 25, color: "bg-[#F39C12]" },
    { label: "Motorika darajasi", value: 55, color: "bg-[#2ECC71]" },
    { label: "Sensor holat", value: 40, color: "bg-[#2196F3]" },
  ];

  return (
    <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-8 sticky top-6">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-50 uppercase tracking-wider text-[14px] font-bold text-[#2D3142]">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <span>Qisqa tahlil</span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-[#9EB1D4]">Yoshi</span>
          <span className="text-[#2D3142] font-bold">{calculateAge(child.birth_date)}</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-[#9EB1D4]">Tashxis</span>
          <span className="text-[#2D3142] font-bold">{child.diagnosis || "Tashxis yo'q"}</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-[#9EB1D4]">Tavsiya yo'nalishi</span>
          <span className="text-[#2D3142] font-bold text-right">Sensor-motor integratsiya</span>
        </div>
      </div>

      <div className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex justify-between items-center text-[12px] font-bold">
              <span className="text-[#9EB1D4]">{metric.label}</span>
              <span className="text-[#2D3142]">{metric.value}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${metric.color} rounded-full transition-all duration-1000`} 
                style={{ width: `${metric.value}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F0F5FF] rounded-[16px] p-4">
        <p className="text-[12px] text-blue-600 leading-relaxed font-medium">
          Intensiv kursga tavsiya etilgan. Doimiy monitoring talab etiladi.
        </p>
      </div>
    </div>
  );
}

function calculateAge(birthDate: string) {
  if (!birthDate) return "-";
  const birth = new Date(birthDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  return `${years} yil ${months} oy`;
}
