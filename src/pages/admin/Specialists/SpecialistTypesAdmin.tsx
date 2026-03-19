import { Plus, ChevronLeft, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { useState } from "react";
import { SpecialistTypeModal } from "./components/SpecialistTypeModal";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import type { SpecialistTypeOut, SpecialistTypeCreateRequest } from "@/types/specialists.types";

export default function SpecialistTypesAdmin() {
  const navigate = useNavigate();
  const { 
    useSpecialistTypes, 
    useCreateSpecialistType, 
    useUpdateSpecialistType, 
    useDeleteSpecialistType 
  } = useSpecialists();

  const { data: types, isLoading } = useSpecialistTypes();
  const { mutate: createType, isPending: isCreating } = useCreateSpecialistType();
  const { mutate: updateType, isPending: isUpdating } = useUpdateSpecialistType();
  const { mutate: deleteType, isPending: isDeleting } = useDeleteSpecialistType();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<SpecialistTypeOut | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingTypeId, setDeletingTypeId] = useState<number | null>(null);

  const handleSubmit = (data: SpecialistTypeCreateRequest) => {
    if (editingType) {
      updateType({ id: editingType.id, data }, {
        onSuccess: () => setIsModalOpen(false),
      });
    } else {
      createType(data, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDelete = () => {
    if (deletingTypeId) {
      deleteType(deletingTypeId, {
        onSuccess: () => setIsConfirmOpen(false),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className=" space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate({ to: "/admin/specialists" })}
          className="w-10 h-10 bg-white border border-gray-200 rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
        </button>
        <h1 className="text-[24px] font-bold text-[#2D3142]">Mutaxassis turlari</h1>
      </div>

      <PageHeader 
        title="" 
        action={
          <button 
            onClick={() => {
              setEditingType(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
          >
            <Plus className="w-[18px] h-[18px]" />
            Yangi tur qo'shish
          </button>
        } 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {types?.map((type) => (
          <div key={type.id} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[18px] font-bold text-[#2D3142]">{type.title}</h3>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingType(type);
                    setIsModalOpen(true);
                  }}
                  className="p-2 hover:bg-blue-50 text-[#6B7A99] hover:text-blue-500 rounded-full transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    setDeletingTypeId(type.id);
                    setIsConfirmOpen(true);
                  }}
                  className="p-2 hover:bg-red-50 text-[#6B7A99] hover:text-red-500 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-[14px] text-[#6B7A99] leading-relaxed line-clamp-3">
              {type.task}
            </p>
          </div>
        ))}
      </div>

      <SpecialistTypeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingType}
        isLoading={isCreating || isUpdating}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Mutaxassis turini o'chirish"
        description="Haqiqatan ham ushbu mutaxassis turini o'chirmoqchimisiz? Bu turdagi mutaxassislar ma'lumotlariga ta'sir qilishi mumkin."
        isLoading={isDeleting}
      />
    </div>
  );
}
