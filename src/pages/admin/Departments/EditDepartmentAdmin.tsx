import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useSkills } from "@/hooks/admin/useSkills";
import { DepartmentForm } from "./components/DepartmentForm";
import type { SectionSchema } from "@/schemas/skills";
import { useMemo } from "react";

export default function EditDepartmentAdmin() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const departmentId = Number(id);

  const { useSections, useUpdateSection } = useSkills();
  const { data: sections, isLoading: isLoadingSections } = useSections();
  const { mutate: updateSection, isPending: isUpdatingSection } = useUpdateSection();

  const section = useMemo(() => {
    return sections?.find(s => s.id === departmentId);
  }, [sections, departmentId]);

  const onSubmit = (data: SectionSchema) => {
    updateSection({ id: departmentId, data }, {
      onSuccess: () => {
        navigate({ to: `/admin/departments/${departmentId}` });
      },
    });
  };

  if (isLoadingSections) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="text-center py-20">
        <p className="text-[#9EB1D4]">Bo'lim topilmadi</p>
        <button 
          onClick={() => navigate({ to: "/admin/departments" })}
          className="mt-4 text-blue-500 hover:underline"
        >
          Orqaga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className=" mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate({ to: `/admin/departments/${departmentId}` })}
          className="w-10 h-10 bg-white border border-gray-200 rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
        </button>
        <h1 className="text-[24px] font-bold text-[#2D3142]">Bo'limni tahrirlash</h1>
      </div>

      <DepartmentForm 
        title="Bo'lim ma'lumotlarini tahrirlash"
        initialData={section}
        onSubmit={onSubmit}
        isLoading={isUpdatingSection}
        onCancel={() => navigate({ to: `/admin/departments/${departmentId}` })}
      />
    </div>
  );
}
