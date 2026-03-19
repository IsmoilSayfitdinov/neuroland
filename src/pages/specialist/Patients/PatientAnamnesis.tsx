import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useChildren } from "@/hooks/specialist/useChildren";
import AnamnesisForm from "@/components/shared/AnamnesisForm";

export default function PatientAnamnesis() {
  const navigate = useNavigate();
  const { patientId } = useParams({ strict: false });
  const childId = Number(patientId);

  const { useChildDetail, useUpdateChild } = useChildren();
  const { data: child, isLoading } = useChildDetail(childId, true);
  const { mutateAsync: updateChild, isPending } = useUpdateChild();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#9EB1D4]">Bola topilmadi</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10 mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: `/specialist/patients/${patientId}` })}
          className="w-9 h-9 bg-white border border-gray-200 rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#2D3142]" />
        </button>
        <div>
          <p className="text-[11px] text-[#9EB1D4] font-medium">Anamnez va Konsultatsiya</p>
          <h1 className="text-xl font-bold text-[#2D3142]">{child.fio}</h1>
        </div>
      </div>

      <AnamnesisForm
        child={child}
        onSave={(data) => updateChild({ id: childId, data })}
        isPending={isPending}
        onBack={() => navigate({ to: `/specialist/patients/${patientId}` })}
        onComplete={() => navigate({ to: `/specialist/patients/${patientId}` })}
      />
    </div>
  );
}
