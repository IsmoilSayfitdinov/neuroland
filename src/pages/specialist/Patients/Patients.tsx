import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useChildren } from "@/hooks/specialist/useChildren";
import PatientCard from "@/components/specialist/Patients/PatientCard";
import type { ChildOut } from "@/types/children.types";

export default function Patients() {
  const { useChildrenList } = useChildren();
  const { data: children, isLoading, isError } = useChildrenList();
  const [activeTab, setActiveTab] = useState<"all" | "new">("all");
  const filtered = useMemo(() => {
    if (!children) return [];
    if (activeTab === "new") return (children as ChildOut[]).filter((c) => !c.diagnosis);
    return children as ChildOut[];
  }, [children, activeTab]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-red-200 px-10">
          <p className="text-slate-500 font-bold">Ma'lumotlarni yuklashda xatolik</p>
          <p className="text-slate-400 text-sm mt-1">Sahifani yangilang yoki qayta urinib ko'ring</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <h1 className="text-2xl font-bold text-slate-800">Bemorlarim</h1>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 p-1 rounded-xl w-fit">
        {(["all", "new"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "text-[#9EB1D4] hover:text-slate-600"
            )}
          >
            {tab === "all" ? "Hammasi" : "Yangi"}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((patient) => (
          <PatientCard key={patient.id} {...patient} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400">Bemorlar topilmadi</p>
          </div>
        )}
      </div>
    </div>
  );
}
