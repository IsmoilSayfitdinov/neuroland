import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft, Loader2, User } from "lucide-react";
import { cn, calculateAge, formatDate } from "@/lib/utils";
import { useChildren } from "@/hooks/specialist/useChildren";

// Shared admin tab components (same ChildDetailOut type)
import { BasicInfoTab }          from "@/pages/admin/Children/components/BasicInfoTab";
import { AnamnesisTab }          from "@/pages/admin/Children/components/AnamnesisTab";
import { DiagnostikaNatijalaTab} from "@/pages/admin/Children/components/DiagnostikaNatijalaTab";

// Specialist-specific tabs
import MeetingsTab        from "@/components/specialist/Patients/Detail/MeetingsTab";
import PaymentsHistoryTab from "@/components/specialist/Patients/Detail/PaymentsHistoryTab";

type Tab = "basic" | "anamnesis" | "consultation" | "diagnostika" | "natijalar" | "uchrashuvlar" | "payments";

const TABS: { id: Tab; label: string }[] = [
  { id: "basic",        label: "Asosiy ma'lumotlar"    },
  { id: "anamnesis",    label: "Rivojlanish tarixi"     },
  { id: "natijalar",    label: "Diagnostika natijalari" },
  { id: "uchrashuvlar", label: "Uchrashuvlar"           },
  { id: "payments",     label: "To'lov tarixi"          },
];

export default function PatientDetail() {
  const navigate = useNavigate();
  const { patientId } = useParams({ strict: false });
  const { useChildDetail } = useChildren();
  const { data: child, isLoading, isError } = useChildDetail(Number(patientId), true);
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [openMeetingModal, setOpenMeetingModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError || !child) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#9EB1D4]">Bemor topilmadi</p>
        <button onClick={() => navigate({ to: "/specialist/patients" })} className="mt-4 text-blue-500 font-bold hover:underline text-[13px]">
          Ro'yxatga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/specialist/patients" })}
            className="w-9 h-9 bg-white border border-gray-100 rounded-[10px] flex items-center justify-center hover:bg-gray-50 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
          </button>
          <div>
            <p className="text-[11px] text-[#9EB1D4] font-medium">Bemor profili</p>
            <h1 className="text-[20px] font-bold text-[#2D3142] leading-tight">Bemor tafsilotlari</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ to: `/specialist/patients/${patientId}/anamnesis` })}
            className="px-[21px] py-[14px] bg-[#1F61F926] border border-gray-200 rounded-[16px] text-[12px] font-bold text-[#1F61F9] hover:bg-gray-50 transition-colors"
          >
            Anamnez to'ldirish
          </button>
          <div className="relative group">
            <button
              className="px-[21px] py-[14px] bg-[#1F61F926] border border-gray-200 rounded-[16px] text-[12px] font-bold text-[#1F61F9] hover:bg-gray-50 transition-colors"
            >
              Imtihon qilish
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
              <button
                onClick={() => navigate({ to: `/specialist/patients/${patientId}/exam`, search: { type: "monthly" } } as any)}
                className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                Oylik imtihon
              </button>
              <button
                onClick={() => navigate({ to: `/specialist/patients/${patientId}/exam`, search: { type: "quarterly" } } as any)}
                className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                Choraklik imtihon
              </button>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: `/specialist/diagnostics/${patientId}` })}
            className="flex items-center px-[21px] py-[14px] bg-[#1F61F9] hover:bg-blue-700 text-white rounded-[14px] text-[12px] font-bold transition-colors"
          >
            Diagnostikani boshlash
          </button>
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
              <span className="text-[12px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {child.diagnosis || "RAS (Autizm spektri)"}
              </span>
              <span className="text-[12px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Active
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
        {TABS.map((tab) => (
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
      <div>
        {activeTab === "basic"        && <BasicInfoTab child={child} />}
        {activeTab === "anamnesis"    && <AnamnesisTab child={child} />}
        {activeTab === "natijalar"    && <DiagnostikaNatijalaTab child={child} />}
        {activeTab === "uchrashuvlar" && (
          <MeetingsTab
            childId={child.id}
            childName={child.fio}
            autoOpenModal={openMeetingModal}
            onModalClose={() => setOpenMeetingModal(false)}
          />
        )}
        {activeTab === "payments" && (
          <PaymentsHistoryTab childId={child.id} payments={child.payments || []} />
        )}
      </div>
    </div>
  );
}
