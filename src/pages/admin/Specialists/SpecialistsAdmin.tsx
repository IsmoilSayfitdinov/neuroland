import { Plus, Settings, UserPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SpecialistCard } from "./components/SpecialistCard";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import type { SpecialistOut } from "@/types/specialists.types";
import { CardSkeleton } from "@/components/admin/ui/CardSkeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";

export default function SpecialistsAdmin() {
  const { useSpecialistsList } = useSpecialists();
  const { data: specialists, isLoading: isLoadingSpecialists } = useSpecialistsList();

  

  if (isLoadingSpecialists) {
    return (
      <div className="space-y-8">
        <PageHeader title="Mutaxassislar" />
        <CardSkeleton count={8} />
      </div>
    );
  }

  return (
    <div className=" space-y-8">
      {/* Header */}
      <PageHeader 
        title="Mutaxassislar" 
        action={
          <div className="flex items-center gap-3">
             <Link 
              to="/admin/specialists/types" 
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-[#2D3142] px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
            >
              <Settings className="w-[18px] h-[18px]" />
              Turlarni boshqarish
            </Link>
            <Link 
              to="/admin/specialists/create" 
              className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
            >
              <Plus className="w-[18px] h-[18px]" />
              Mutaxassis qo'shish
            </Link>
          </div>
        } 
      />

      {/* Grid */}
      {specialists?.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="Mutaxassislar topilmadi"
          description={specialists?.length === 0 ? "Bu turda hozircha mutaxassislar mavjud emas." : "Hozircha hech qanday mutaxassis qo'shilmagan."}
          action={
            !specialists?.length
              ? { label: "Mutaxassis qo'shish", onClick: () => {}, icon: Plus }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {specialists?.map((spec: SpecialistOut) => (
            <SpecialistCard key={spec?.id} data={spec} />
          ))}
        </div>
      )}
    </div>
  );
}
