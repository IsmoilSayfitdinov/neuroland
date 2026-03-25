import { Plus, Search, Eye, Edit2, Trash2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/custom-select";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { TableSkeleton } from "@/components/admin/ui/TableSkeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Users } from "lucide-react";
import { useChildrenPage } from "@/hooks/admin/useChildrenPage";
import { CHILD_STATUS_LABELS, AGE_RANGE_OPTIONS } from "@/constants/children";
import type { ChildOut } from "@/types/children.types";

const childrenInfo = (
  <>
    <p>Bu bo'limda markazga ro'yxatdan o'tgan barcha bolalar ro'yxatini ko'rishingiz mumkin.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Yangi bola qo'shish va mavjudlarini tahrirlash</li>
      <li>Guruh, yosh va holat bo'yicha filtrlash</li>
      <li>Bolaning shaxsiy sahifasiga o'tish va anamnez ma'lumotlarini ko'rish</li>
      <li>Diagnostika natijalarini kuzatish</li>
    </ul>
  </>
);

export default function ChildrenAdmin() {
  const {
    isLoading,
    groups,
    groupsOptions,
    filteredChildren,
    searchQuery,
    setSearchQuery,
    selectedGroup,
    setSelectedGroup,
    selectedAge,
    setSelectedAge,
    selectedStatus,
    setSelectedStatus,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
    isDeleting,
    navigate,
  } = useChildrenPage();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Bolalar" infoTitle="Bolalar bo'limi" infoContent={childrenInfo} />
        <TableSkeleton rows={8} columns={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bolalar"
        infoTitle="Bolalar bo'limi"
        infoContent={childrenInfo}
        action={
          <Button
            onClick={() => navigate({ to: "/admin/child/create" })}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-6 rounded-[12px] flex items-center gap-2 text-[15px] font-bold"
          >
            <Plus className="w-5 h-5" />
            Bola qo'shish
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9EB1D4]" />
          <input
            type="text"
            placeholder="Bola ismini qidirish"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[48px] pl-12 pr-4 bg-white border border-gray-100 rounded-[14px] outline-none focus:border-[#4D89FF] transition-colors text-[14px]"
          />
        </div>

        <div className="min-w-[160px]">
          <CustomSelect
            options={groupsOptions}
            value={selectedGroup}
            onChange={(val) => setSelectedGroup(val.toString())}
            placeholder="Guruh"
            bgBtnColor="bg-white"
          />
        </div>

        <div className="min-w-[160px]">
          <CustomSelect
            options={AGE_RANGE_OPTIONS}
            value={selectedAge}
            onChange={(val) => setSelectedAge(val.toString())}
            placeholder="Yosh"
            bgBtnColor="bg-white"
          />
        </div>

        <div className="min-w-[160px]">
          <CustomSelect
            options={[
              { label: "Faol", value: "active" },
              { label: "Yangi", value: "new" },
            ]}
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val.toString())}
            placeholder="Holat"
            bgBtnColor="bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-5 text-[13px] font-semibold text-[#9EB1D4] uppercase tracking-wider">Bola ismi</th>
                <th className="px-6 py-5 text-[13px] font-semibold text-[#9EB1D4] uppercase tracking-wider">Yoshi</th>
                <th className="px-6 py-5 text-[13px] font-semibold text-[#9EB1D4] uppercase tracking-wider">Tashxis</th>
                <th className="px-6 py-5 text-[13px] font-semibold text-[#9EB1D4] uppercase tracking-wider">Guruh</th>
                <th className="px-6 py-5 text-[13px] font-semibold text-[#9EB1D4] uppercase tracking-wider">Holati</th>
                <th className="px-6 py-5 text-[13px] font-semibold text-[#9EB1D4] uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredChildren.map((child: ChildOut) => {
                const childAge = Math.floor(
                  (new Date().getTime() - new Date(child.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
                );

                return (
                  <tr key={child.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#2D3142]">{child.fio}</div>
                      {child.alias && <div className="text-[12px] text-[#9EB1D4] font-medium">{child.alias}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#2D3142] text-[14px] font-medium">{childAge}.0 yosh</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#2D3142] text-[14px] font-medium line-clamp-1 max-w-[200px]" title={child.diagnosis || ""}>
                        {child.diagnosis || "Belgilanmagan"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#2D3142] text-[14px] font-medium">
                        {groups?.find((g) => g.id === child.group_id)?.name || "Guruhsiz"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const cfg = CHILD_STATUS_LABELS[child.status] ?? CHILD_STATUS_LABELS.active;
                        return (
                          <span className={cn("px-4 py-1 rounded-full text-[12px] font-bold", cfg.cls)}>
                            {cfg.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate({ to: `/admin/child/${child.id}` })}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-500"
                          title="Ko'rish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate({ to: `/admin/child/${child.id}/anamnesis` })}
                          className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-gray-400 hover:text-emerald-600"
                          title="Anamnez to'ldirish"
                        >
                          <ClipboardList className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate({ to: `/admin/child/${child.id}/edit` })}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(child.id, child.fio)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredChildren.length === 0 && (
            <div className="px-6 py-4">
              <EmptyState
                icon={Users}
                title="Bolalar topilmadi"
                description={
                  searchQuery
                    ? `"${searchQuery}" qidiruvi bo'yicha hech qanday bola topilmadi.`
                    : "Hozircha bolalar ro'yxati bo'sh."
                }
                action={
                  !searchQuery
                    ? {
                        label: "Bola qo'shish",
                        onClick: () => navigate({ to: "/admin/child/create" }),
                        icon: Plus,
                      }
                    : undefined
                }
                className="border-none shadow-none py-12"
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Bolani o'chirish"
        description={`${deleteModal.name}ni haqiqatan ham o'chirmoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
