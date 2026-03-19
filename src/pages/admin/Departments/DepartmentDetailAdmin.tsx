import { ChevronLeft, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import { DepartmentExerciseList } from "./components/DepartmentExerciseList";
import { useSkills } from "@/hooks/admin/useSkills";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ExerciseModal } from "./components/ExerciseModal";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import type { ExerciseSchema } from "@/schemas/skills";
import type { ExerciseOut } from "@/types/skills.types";

export default function DepartmentDetailAdmin() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const departmentId = Number(id);

  const { 
    useSections, 
    useExercises, 
    useAgeGroups, 
    useDeleteSection,
    useCreateExercise,
    useUpdateExercise,
    useDeleteExercise
  } = useSkills();

  const { data: sections, isLoading: isLoadingSections } = useSections();
  const { data: ageGroups, isLoading: isLoadingAgeGroups } = useAgeGroups();
  const { data: exercises, isLoading: isLoadingExercises } = useExercises(departmentId);
  
  const { mutate: deleteSection, isPending: isDeletingSection } = useDeleteSection();
  const { mutate: createExercise, isPending: isCreatingExercise } = useCreateExercise();
  const { mutate: updateExercise, isPending: isUpdatingExercise } = useUpdateExercise();
  const { mutate: deleteExercise, isPending: isDeletingExercise } = useDeleteExercise();

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseOut | null>(null);
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
    isLoading: boolean;
  } | null>(null);

  const section = useMemo(() => {
    return sections?.find(s => s.id === departmentId);
  }, [sections, departmentId]);

  const ageGroup = useMemo(() => {
    return ageGroups?.find(g => g.id === section?.age_group_id);
  }, [ageGroups, section]);
  
  const handleDeleteSection = () => {
    setConfirmConfig({
      title: "Bo'limni o'chirmoqchimisiz?",
      description: `Haqiqatan ham "${section?.name}" bo'limini o'chirmoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.`,
      isLoading: isDeletingSection,
      onConfirm: () => {
        deleteSection(departmentId, {
          onSuccess: () => {  
            toast.success("Bo'lim muvaffaqiyatli o'chirildi");
            navigate({ to: "/admin/departments" });
            setIsConfirmModalOpen(false);
          },
        });
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleExerciseSubmit = (data: ExerciseSchema) => {
    if (editingExercise) {
      updateExercise({ id: editingExercise.id, data: { ...data, video_url: data.video_url || "" } }, {
        onSuccess: () => {
          toast.success("Mashq tahrirlandi");
          setIsExerciseModalOpen(false);
          setEditingExercise(null);
        }
      });
    } else {
      createExercise({ ...data, video_url: data.video_url || "" }, {
        onSuccess: () => {
          toast.success("Yangi mashq qo'shildi");
          setIsExerciseModalOpen(false);
        }
      });
    }
  };

  const handleDeleteExercise = (exercise: ExerciseOut) => {
    setConfirmConfig({
      title: "Mashqni o'chirmoqchimisiz?",
      description: `Haqiqatan ham "${exercise.name}" mashqini o'chirmoqchimisiz?`,
      isLoading: isDeletingExercise,
      onConfirm: () => {
        deleteExercise(exercise.id, {
          onSuccess: () => {
            toast.success("Mashq o'chirildi");
            setIsConfirmModalOpen(false);
          }
        });
      }
    });
    setIsConfirmModalOpen(true);
  };

  if (isLoadingSections || isLoadingExercises || isLoadingAgeGroups) {
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
    <div className=" mx-auto pb-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate({ to: "/admin/departments" })}
            className="w-10 h-10 bg-white border border-gray-200 rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
          </button>
          <h1 className="text-[24px] font-bold text-[#2D3142]">Bo'lim ma'lumotlari</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDeleteSection}
            className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 transition-colors text-red-600 px-5 py-2.5 rounded-[12px] text-[14px] font-medium border border-red-100"
          >
            <Trash2 className="w-4 h-4" />
            O'chirish
          </button>
          <Link 
            to={`/admin/departments/${departmentId}/edit`}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-[#2D3142] px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
          >
            <Edit className="w-4 h-4" />
            Tahrirlash
          </Link>
          <button 
            onClick={() => {
              setEditingExercise(null);
              setIsExerciseModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Mashq qo'shish
          </button>
        </div>
      </div>

      {/* Intro Card */}
      <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[18px] font-bold text-[#2D3142]">{section.name}</h2>
          <div className="flex items-center gap-2">
             <span className="text-[14px] font-bold text-[#4D89FF]">{section.percentage}%</span>
          </div>
        </div>
        <p className="text-[14px] text-[#6B7A99] mb-5">{section.description}</p>
        
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-[#F8F9FB] text-[#6B7A99] rounded-[8px] text-[13px] font-medium">
            {ageGroup?.name || "Yuklanmoqda..."}
          </span>
          <span className="px-3 py-1.5 bg-[#F8F9FB] text-[#6B7A99] rounded-[8px] text-[13px] font-medium">
            {section.exercises_count} ta mashq
          </span>
        </div>
      </div>

      {/* Exercises List Table */}
      <DepartmentExerciseList 
        exercises={exercises || []} 
        ageGroupName={ageGroup?.name || ""} 
        onEdit={(ex) => {
          setEditingExercise(ex);
          setIsExerciseModalOpen(true);
        }}
        onDelete={(id) => {
          const ex = exercises?.find(e => e.id === id);
          if (ex) handleDeleteExercise(ex);
        }}
      />

      <ExerciseModal 
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onSubmit={handleExerciseSubmit}
        initialData={editingExercise}
        isLoading={isCreatingExercise || isUpdatingExercise}
        sectionId={departmentId}
      />

      {confirmConfig && (
        <ConfirmModal 
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
          description={confirmConfig.description}
          isLoading={confirmConfig.isLoading}
        />
      )}

    </div>
  );
}
