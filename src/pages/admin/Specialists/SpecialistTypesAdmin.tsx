import { Plus, Edit2, Trash2, Loader2, Briefcase, Info } from "lucide-react";
import { InfoModal } from "@/components/admin/ui/InfoModal";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { useState } from "react";
import { SpecialistTypeModal } from "./components/SpecialistTypeModal";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import type { SpecialistTypeOut, SpecialistTypeCreateRequest } from "@/types/specialists.types";

const TYPE_COLORS = [
  { bg: "from-blue-50 to-indigo-50", border: "border-blue-100", icon: "bg-blue-100 text-blue-600", badge: "bg-blue-100 text-blue-700" },
  { bg: "from-emerald-50 to-teal-50", border: "border-emerald-100", icon: "bg-emerald-100 text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  { bg: "from-amber-50 to-orange-50", border: "border-amber-100", icon: "bg-amber-100 text-amber-600", badge: "bg-amber-100 text-amber-700" },
  { bg: "from-purple-50 to-fuchsia-50", border: "border-purple-100", icon: "bg-purple-100 text-purple-600", badge: "bg-purple-100 text-purple-700" },
  { bg: "from-rose-50 to-pink-50", border: "border-rose-100", icon: "bg-rose-100 text-rose-600", badge: "bg-rose-100 text-rose-700" },
  { bg: "from-cyan-50 to-sky-50", border: "border-cyan-100", icon: "bg-cyan-100 text-cyan-600", badge: "bg-cyan-100 text-cyan-700" },
];

const typesInfo = (
  <>
    <p>Bu bo'limda mutaxassis turlarini (logoped, psixolog, defektolog va h.k.) boshqarish mumkin.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Yangi mutaxassis turi yaratish</li>
      <li>Mavjud turlarni tahrirlash va o'chirish</li>
      <li>Har bir turga biriktirilgan mutaxassislar sonini ko'rish</li>
    </ul>
  </>
);

export default function SpecialistTypesAdmin() {
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

  const [showTypesInfo, setShowTypesInfo] = useState(false);
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

  const getColor = (idx: number) => TYPE_COLORS[idx % TYPE_COLORS.length];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-[28px] font-bold text-[#2D3142]">Mutaxassis turlari</h1>
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      {/* Header */}
      <InfoModal isOpen={showTypesInfo} onClose={() => setShowTypesInfo(false)} title="Mutaxassis turlari">{typesInfo}</InfoModal>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[28px] font-bold text-[#2D3142]">Mutaxassis turlari</h1>
            <button type="button" onClick={() => setShowTypesInfo(true)} className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Info className="w-4 h-4 text-blue-500" />
            </button>
          </div>
          <p className="text-[14px] text-[#9EB1D4] mt-1">Mutaxassislar uchun turlarni boshqaring</p>
        </div>
        <button
          onClick={() => {
            setEditingType(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi tur qo'shish
        </button>
      </div>

      {/* Grid */}
      {!types?.length ? (
        <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
          <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#9EB1D4] font-medium">Mutaxassis turlari mavjud emas</p>
          <button
            onClick={() => {
              setEditingType(null);
              setIsModalOpen(true);
            }}
            className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white text-[13px] font-bold rounded-[10px]"
          >
            <Plus className="w-4 h-4" />
            Tur yaratish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {types.map((type, idx) => {
            const color = getColor(idx);
            return (
              <div
                key={type.id}
                className={`bg-gradient-to-br ${color.bg} p-5 rounded-[20px] border ${color.border} hover:shadow-lg transition-all duration-200 group relative`}
              >
                {/* Actions */}
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingType(type);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white/80 hover:bg-white text-gray-500 hover:text-blue-500 rounded-[10px] transition-colors shadow-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingTypeId(type.id);
                      setIsConfirmOpen(true);
                    }}
                    className="p-2 bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 rounded-[10px] transition-colors shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Icon */}
                <div className={`w-11 h-11 ${color.icon} rounded-[14px] flex items-center justify-center mb-4`}>
                  <Briefcase className="w-5 h-5" />
                </div>

                {/* Title */}
                <h3 className="text-[16px] font-bold text-[#2D3142] mb-2 pr-16 group-hover:pr-0 transition-all">
                  {type.title}
                </h3>

                {/* Description */}
                {type.task && (
                  <p className="text-[13px] text-[#6B7A99] leading-relaxed line-clamp-3">
                    {type.task}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

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
