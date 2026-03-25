import { useNavigate, useParams } from "@tanstack/react-router";
import { useChildren } from "@/hooks/specialist/useChildren";
import ChildDetail from "@/pages/shared/ChildDetail";

export default function PatientDetail() {
  const navigate = useNavigate();
  const { patientId } = useParams({ strict: false });
  const { useChildDetail } = useChildren();
  const { data: child, isLoading, isError } = useChildDetail(Number(patientId), true);

  const headerActions = (
    <>
      <button
        onClick={() => navigate({ to: `/specialist/patients/${patientId}/anamnesis` })}
        className="px-[21px] py-[14px] bg-[#1F61F926] border border-gray-200 rounded-[16px] text-[12px] font-bold text-[#1F61F9] hover:bg-gray-50 transition-colors"
      >
        Anamnez to'ldirish
      </button>
      <div className="relative group">
        <button className="px-[21px] py-[14px] bg-[#1F61F926] border border-gray-200 rounded-[16px] text-[12px] font-bold text-[#1F61F9] hover:bg-gray-50 transition-colors">
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
    </>
  );

  return (
    <ChildDetail
      child={child}
      isLoading={isLoading}
      isError={isError}
      onGoBack={() => navigate({ to: "/specialist/patients" })}
      headerActions={headerActions}
    />
  );
}
