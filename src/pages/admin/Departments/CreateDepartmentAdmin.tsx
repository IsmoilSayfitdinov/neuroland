import { ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useSkills } from "@/hooks/admin/useSkills";
import { DepartmentForm } from "./components/DepartmentForm";
import type { SectionSchema } from "@/schemas/skills";

export default function CreateDepartmentAdmin() {
  const navigate = useNavigate();
  const { useCreateSection } = useSkills();
  const { mutate: createSection, isPending: isCreatingSection } = useCreateSection();

  const onSubmit = (data: SectionSchema) => {
    createSection(data, {
      onSuccess: () => {
        navigate({ to: "/admin/departments" });
      },
    });
  };

  return (
    <div className=" mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate({ to: "/admin/departments" })}
          className="w-10 h-10 bg-white border border-gray-200 rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
        </button>
        <h1 className="text-[24px] font-bold text-[#2D3142]">Bo'lim qo'shish</h1>
      </div>

      <DepartmentForm 
        title="Yangi bo'lim ma'lumotlari"
        onSubmit={onSubmit}
        isLoading={isCreatingSection}
        onCancel={() => navigate({ to: "/admin/departments" })}
      />
    </div>
  );
}
