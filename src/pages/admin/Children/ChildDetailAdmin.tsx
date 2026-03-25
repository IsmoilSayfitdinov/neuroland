import { type ComponentType } from "react";
import { ChevronLeft, User } from "lucide-react";
import { cn, calculateAge, formatDate } from "@/lib/utils";
import { CHILD_DETAIL_TABS, CHILD_STATUS_LABELS, type ChildTab } from "@/constants/children";
import { BasicInfoTab } from "./components/BasicInfoTab";
import { AnamnesisTab } from "./components/AnamnesisTab";
import { PaymentsTab } from "./components/PaymentsTab";
import { DiagnostikaTab } from "./components/DiagnostikaTab";
import { DiagnostikaNatijalaTab } from "./components/DiagnostikaNatijalaTab";
import { UchrashuvlarTab } from "./components/UchrashuvlarTab";
import { useChildDetailAdminPage } from "@/hooks/admin/useChildDetailAdminPage";
import type { ChildDetailOut } from "@/types/children.types";

const TAB_COMPONENTS: Record<ChildTab, ComponentType<{ child: ChildDetailOut }>> = {
  basic: BasicInfoTab,
  anamnesis: AnamnesisTab,
  diagnostika: DiagnostikaTab,
  natijalar: DiagnostikaNatijalaTab,
  uchrashuvlar: UchrashuvlarTab,
  tolov: PaymentsTab,
};

export default function ChildDetailAdmin() {
  const { child, isLoading, activeTab, setActiveTab, goBack } = useChildDetailAdminPage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#9EB1D4]">Bola topilmadi</p>
        <button onClick={goBack} className="mt-4 text-blue-500 font-bold hover:underline text-[13px]">
          Ro'yxatga qaytish
        </button>
      </div>
    );
  }

  const statusCfg = CHILD_STATUS_LABELS[child.status] ?? CHILD_STATUS_LABELS.active;
  const TabContent = TAB_COMPONENTS[activeTab as ChildTab];

  return (
    <div className="space-y-5 pb-10">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="w-9 h-9 bg-white border border-gray-100 rounded-[10px] flex items-center justify-center hover:bg-gray-50 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
        </button>
        <div>
          <p className="text-[11px] text-[#9EB1D4] font-medium">Bemor profili</p>
          <h1 className="text-[20px] font-bold text-[#2D3142] leading-tight">Bemor tafsilotlari</h1>
        </div>
      </div>

      {/* Patient profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-blue-500" />
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
            {child.photo ? (
              <img src={import.meta.env.VITE_API_MEDIA_URL + child.photo} alt={child.fio} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <User className="w-8 h-8 text-blue-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-[20px] font-bold text-[#2D3142]">{child.fio}</h2>
              {child.diagnosis && (
                <span className="text-[12px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                  {child.diagnosis}
                </span>
              )}
              <span className={cn("text-[12px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5", statusCfg.cls)}>
                <span className="w-1.5 h-1.5 bg-current rounded-full opacity-70" />
                {statusCfg.label}
              </span>
            </div>
            <p className="text-[13px] text-[#9EB1D4] mb-2">
              Guruh: <span className="text-[#2D3142] font-semibold">{child.group_info?.name || "Guruhsiz"}</span>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[12px]">
              <span className="text-[#9EB1D4]">
                Tug'ilgan sana: <span className="text-[#2D3142] font-bold">{formatDate(child.birth_date)}</span>
              </span>
              <span className="text-[#9EB1D4]">
                Yoshi: <span className="text-[#2D3142] font-bold">{calculateAge(child.birth_date)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-white border border-gray-100 rounded-2xl shadow-sm w-fit max-w-full">
        {CHILD_DETAIL_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-[#9EB1D4] hover:text-[#2D3142]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {TabContent && <TabContent child={child} />}
    </div>
  );
}
