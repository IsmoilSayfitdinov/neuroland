import { useState } from "react";
import { Plus, Star, Edit2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { useGamification } from "@/hooks/admin/useGamification";
import { CardSkeleton } from "@/components/admin/ui/CardSkeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { BadgeModal } from "./components/BadgeModal";
import { cn } from "@/lib/utils";
import type { Badge } from "@/types/gamification.types";

export default function AchievementsAdmin() {
  const { useBadgesList, useCreateBadge, useUpdateBadge, usePatchBadge, useDeleteBadge } = useGamification();
  const { data: badges, isLoading } = useBadgesList();
  const createMutation = useCreateBadge();
  const updateMutation = useUpdateBadge();
  const patchMutation = usePatchBadge();
  const deleteMutation = useDeleteBadge();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openCreate = () => { setEditingBadge(null); setIsModalOpen(true); };
  const openEdit = (badge: Badge) => { setEditingBadge(badge); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingBadge(null); };

  const handleSave = (data: { name: string; icon: string; description: string; condition_rules: string; is_active: boolean }) => {
    if (editingBadge) {
      updateMutation.mutate({ id: editingBadge.id, data }, { onSuccess: closeModal });
    } else {
      createMutation.mutate(data, { onSuccess: closeModal });
    }
  };

  const handleToggleStatus = (badge: Badge) => {
    patchMutation.mutate({ id: badge.id, data: { is_active: !badge.is_active } });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Yutuqlar boshqaruvi" />
        <CardSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-8">
      <PageHeader
        title="Yutuqlar boshqaruvi"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
          >
            <Plus className="w-[18px] h-[18px]" />
            Badge qo'shish
          </button>
        }
      />

      {badges?.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Badgelar topilmadi"
          description="Hozircha tizimda badgelar mavjud emas."
          action={{ label: "Badge qo'shish", onClick: openCreate, icon: Plus }}
        />
      ) : (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Badge nomi</th>
                  <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Tavsif</th>
                  <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Shart</th>
                  <th className="px-6 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-[12px] font-bold text-[#9EB1D4] uppercase tracking-wider text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {badges?.map((badge) => (
                  <tr key={badge.id} className="group hover:bg-[#F8F9FB] transition-colors">
                    <td className="px-8 py-5">
                      <span className="text-[22px]">{badge.icon || "🏅"}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] font-bold text-[#2D3142]">{badge.name}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] text-[#9EB1D4] font-medium leading-relaxed">
                        {badge.description || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] text-[#9EB1D4] font-medium">
                        {badge.condition_rules || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleToggleStatus(badge)}
                        className="w-[44px] h-[22px] rounded-full relative transition-all duration-200 focus:outline-none cursor-pointer"
                        style={{ backgroundColor: badge.is_active ? "#2563EB" : "#E1E5EE" }}
                      >
                        <div className={cn(
                          "absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full transition-transform duration-200 shadow-sm",
                          badge.is_active ? "translate-x-[24px]" : "translate-x-[2px]"
                        )} />
                      </button>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(badge)}
                          className="p-2 text-[#4D89FF] hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-[16px] h-[16px]" />
                        </button>
                        <button
                          onClick={() => setDeleteId(badge.id)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-[16px] h-[16px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <BadgeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initialData={editingBadge}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
        title="Badgeni o'chirish"
        description="Ushbu badgeni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
