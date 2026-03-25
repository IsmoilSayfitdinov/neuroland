import { Plus, Trash2, BookOpen } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { useSkills } from "@/hooks/admin/useSkills";
import { useState, useMemo } from "react";
import { getIconById } from "@/constants/skills.constants";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { AgeGroupModal } from "./components/AgeGroupModal";
import type { AgeGroupOut, AgeGroupCreateRequest, SectionOut } from "@/types/skills.types";
import { CardSkeleton } from "@/components/admin/ui/CardSkeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";

const departmentsInfo = (
  <>
    <p>Bu bo'limda yosh toifalari va bo'limlarni boshqarish mumkin. Har bir bo'lim yosh toifasiga biriktiriladi.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Yosh toifalarini yaratish va o'chirish</li>
      <li>Bo'limlar yaratish va tahrirlash</li>
      <li>Yosh toifasi bo'yicha bo'limlarni filtrlash</li>
      <li>Bo'lim tafsilotlarini ko'rish</li>
    </ul>
  </>
);

export default function DepartmentsAdmin() {
  const navigate = useNavigate();
  const { 
    useAgeGroups, 
    useSections, 
    useDeleteAgeGroup, 
    useCreateAgeGroup, 
  } = useSkills();

  const { data: ageGroups, isLoading: isLoadingAgeGroups } = useAgeGroups();
  const { data: sections, isLoading: isLoadingSections } = useSections();
  
  const { mutate: deleteAgeGroup, isPending: isDeleting } = useDeleteAgeGroup();
  const { mutate: createAgeGroup, isPending: isCreating } = useCreateAgeGroup();
  
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState<number | null>(null);
  const [isAgeGroupModalOpen, setIsAgeGroupModalOpen] = useState(false);
  const [editingAgeGroup, setEditingAgeGroup] = useState<AgeGroupOut | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingAgeGroupData, setDeletingAgeGroupData] = useState<{id: number, name: string} | null>(null);

  const sortedAgeGroups = useMemo(() => {
    if (!ageGroups) return [];
    return [...ageGroups].sort((a, b) => {
      const numA = parseInt(a.name.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.name.match(/\d+/)?.[0] || "0");
      if (numA !== numB) return numA - numB;
      return a.name.localeCompare(b.name);
    });
  }, [ageGroups]);

  const filteredSections = useMemo(() => {
    if (!sections) return [];
    const currentId = selectedAgeGroupId || (sortedAgeGroups?.[0]?.id || null);
    return sections.filter((s: SectionOut) => s.age_group_id === currentId);
  }, [sections, selectedAgeGroupId, sortedAgeGroups]);

  const currentAgeGroupId = selectedAgeGroupId || (sortedAgeGroups?.[0]?.id || null);

  const handleAgeGroupSubmit = (data: AgeGroupCreateRequest) => {
    // Note: only create is supported by backend currently
    createAgeGroup(data, {
      onSuccess: () => setIsAgeGroupModalOpen(false),
    });
  };

  const onConfirmDelete = () => {
    if (deletingAgeGroupData) {
      deleteAgeGroup(deletingAgeGroupData.id, {
        onSuccess: () => {
          if (selectedAgeGroupId === deletingAgeGroupData.id) {
            setSelectedAgeGroupId(null);
          }
          setIsConfirmModalOpen(false);
        }
      });
    }
  };

  if (isLoadingAgeGroups || isLoadingSections) {
    return (
      <div className="space-y-8">
        <PageHeader title="Bo'limlar" infoTitle="Bo'limlar" infoContent={departmentsInfo} />
        <CardSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className=" mx-auto pb-10 space-y-8">
      {/* Header */}
      <PageHeader 
        title="Bo'limlar" 
        action={
          <div className="flex items-center gap-3">
             <button 
              onClick={() => {
                setEditingAgeGroup(null);
                setIsAgeGroupModalOpen(true);
              }}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-[#2D3142] px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Yosh toifasi
            </button>
            <button 
              onClick={() => navigate({ to: "/admin/departments/create" })}
              className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Bo'lim qo'shish
            </button>
          </div>
        } 
      />

      {/* Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto py-[20px]">
        {sortedAgeGroups?.map((group: AgeGroupOut) => (
          <div key={group.id} className="relative group/tab shrink-0">
            <button 
              onClick={() => setSelectedAgeGroupId(group.id)}
              className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all whitespace-nowrap border ${
                currentAgeGroupId === group.id 
                  ? "bg-[#2563EB] text-white border-[#2563EB]" 
                  : "bg-white hover:bg-gray-50 text-[#6B7A99] border-gray-100 shadow-sm"
              }`}
            >
              {group.name}
            </button>
            
            <div className="absolute -top-3 -right-2 flex items-center gap-1 opacity-0 group-hover/tab:opacity-100 transition-opacity z-10">
              {/* Note: Backend doesn't support edit for AgeGroups yet */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingAgeGroupData({ id: group.id, name: group.name });
                  setIsConfirmModalOpen(true);
                }}
                className="w-6 h-6 bg-white border border-gray-100 text-[#6B7A99] rounded-full flex items-center justify-center hover:text-red-500 shadow-sm transition-colors"
                title="O'chirish"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => {
            setEditingAgeGroup(null);
            setIsAgeGroupModalOpen(true);
          }}
          className="shrink-0 w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all ml-2"
          title="Yangi toifa qo'shish"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Grid */}
      {filteredSections.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Bo'limlar topilmadi"
          description="Bu yosh toifasi uchun hozircha bo'limlar mavjud emas."
          action={{
            label: "Bo'lim qo'shish",
            onClick: () => navigate({ to: "/admin/departments/create" }),
            icon: Plus,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section: SectionOut) => {
            const IconComponent = getIconById(section.icon || "Activity");
            const ageGroup = ageGroups?.find(g => g.id === section.age_group_id);

            return (
              <div
                key={section.id}
                onClick={() => navigate({ to: `/admin/departments/${section.id}` })}
                className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center text-center cursor-pointer hover:border-blue-100 hover:shadow-md transition-all group"
              >
                <div
                  className={`w-14 h-14 rounded-[16px] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  style={{ backgroundColor: `${section.color || "#4D89FF"}15`, color: section.color || "#4D89FF" }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="text-[16px] font-bold text-[#2D3142] mb-1.5">{section.name}</h3>
                <p className="text-[13px] text-[#9EB1D4] mb-5 line-clamp-2">{section.description}</p>

                <div className="flex items-center gap-3 mt-auto">
                  <span className="px-3 py-1 bg-[#F8F9FB] text-[#6B7A99] rounded-full text-[12px] font-medium">
                    {ageGroup?.name}
                  </span>
                  <span className="px-3 py-1 bg-[#F8F9FB] text-[#6B7A99] rounded-full text-[12px] font-medium">
                    {section.exercises_count} ta mashq
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AgeGroupModal 
        isOpen={isAgeGroupModalOpen}
        onClose={() => setIsAgeGroupModalOpen(false)}
        onSubmit={handleAgeGroupSubmit}
        initialData={editingAgeGroup}
        isLoading={isCreating}
      />

      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={onConfirmDelete}
        title="Yosh toifasini o'chirish"
        description={`Haqiqatan ham "${deletingAgeGroupData?.name}" yosh toifasini o'chirmoqchimisiz? Ushbu toifadagi barcha bo'limlar ham o'chib ketishi mumkin.`}
        isLoading={isDeleting}
      />

    </div>
  );
}
