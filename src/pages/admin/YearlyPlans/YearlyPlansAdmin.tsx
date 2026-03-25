import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Plus,
  Trash2,
  CalendarRange,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { PlansAPI } from "@/api/plans.api";
import { useGroups } from "@/hooks/admin/useGroups";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MONTH_NAMES = [
  "", "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const monthName = MONTH_NAMES[d.getMonth() + 1];
  const year = d.getFullYear();
  return `${day} ${monthName} ${year}`;
}

const yearlyPlansInfo = (
  <>
    <p>Bu bo'limda guruhlar uchun yillik rejalarni yaratish va boshqarish mumkin.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Guruh uchun yangi yillik reja yaratish</li>
      <li>Mavjud rejalarni ko'rish va tafsilotlariga o'tish</li>
      <li>Guruh bo'yicha filtrlash</li>
      <li>Keraksiz rejalarni o'chirish</li>
    </ul>
  </>
);

export default function YearlyPlansAdmin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [groupFilter, setGroupFilter] = useState<number | "">("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form state
  const [formGroup, setFormGroup] = useState<number | "">("");
  const [formDate, setFormDate] = useState("");
  const [formError, setFormError] = useState("");

  const { useGroupsList } = useGroups();
  const { data: groups, isLoading: groupsLoading } = useGroupsList();

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["yearly-plans", groupFilter || undefined],
    queryFn: () =>
      PlansAPI.listYearlyPlans(
        groupFilter ? { group_id: groupFilter as number } : undefined
      ),
  });

  const createMutation = useMutation({
    mutationFn: (data: { group: number; start_date: string }) =>
      PlansAPI.createYearlyPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yearly-plans"] });
      toast.success("Yillik reja muvaffaqiyatli yaratildi");
      handleCloseCreate();
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => PlansAPI.deleteYearlyPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yearly-plans"] });
      toast.success("Yillik reja o'chirildi");
      setDeleteId(null);
    },
    onError: () => toast.error("O'chirishda xatolik yuz berdi"),
  });

  const isLoading = groupsLoading || plansLoading;

  const groupOptions = [
    { value: "", label: "Barcha guruhlar" },
    ...(groups?.map((g) => ({ value: g.id, label: g.name })) ?? []),
  ];

  const handleOpenCreate = () => {
    setFormGroup("");
    setFormDate("");
    setFormError("");
    setCreateModalOpen(true);
  };

  const handleCloseCreate = () => {
    setCreateModalOpen(false);
    setFormGroup("");
    setFormDate("");
    setFormError("");
  };

  const handleCreate = () => {
    if (!formGroup) {
      setFormError("Guruhni tanlang");
      return;
    }
    if (!formDate) {
      setFormError("Sanani kiriting");
      return;
    }
    setFormError("");
    createMutation.mutate({ group: formGroup as number, start_date: formDate });
  };

  const inputCls =
    "w-full h-10 px-4 bg-[#F8F9FB] border border-gray-100 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-[#9EB1D4]";

  return (
    <div className="mx-auto pb-10 space-y-6">
      <PageHeader
        title="Yillik Reja"
        infoTitle="Yillik rejalar"
        infoContent={yearlyPlansInfo}
        action={
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yangi reja
          </button>
        }
      />

      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="w-[220px]">
          <CustomSelect
            options={groupOptions as { value: string | number; label: string }[]}
            value={groupFilter}
            onChange={(v) => setGroupFilter(v === "" ? "" : Number(v))}
            placeholder="Guruh bo'yicha filter"
            bgBtnColor="bg-white"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 space-y-3"
            >
              <Skeleton className="h-5 w-2/3 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
              <Skeleton className="h-4 w-1/3 rounded-lg" />
              <Skeleton className="h-9 w-full rounded-xl mt-2" />
            </div>
          ))}
        </div>
      ) : !plans?.length ? (
        <EmptyState
          icon={CalendarRange}
          title="Yillik rejalar mavjud emas"
          description="Hozircha hech qanday yillik reja yaratilmagan."
          action={{ label: "Yangi reja", onClick: handleOpenCreate, icon: Plus }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 flex flex-col gap-3 group cursor-pointer hover:shadow-md transition-shadow"
              onClick={() =>
                navigate({
                  to: "/admin/yearly-plans/$id",
                  params: { id: String(plan.id) },
                })
              }
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-[12px] bg-blue-50 flex items-center justify-center shrink-0">
                    <CalendarRange className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold text-[#2D3142] truncate">
                      {plan.group_name}
                    </h3>
                    <p className="text-[12px] text-[#9EB1D4] mt-0.5">
                      Guruh
                    </p>
                  </div>
                </div>
                {/* Delete button — stop propagation so card click doesn't fire */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(plan.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl hover:bg-red-50 text-[#9EB1D4] hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Info rows */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#9EB1D4]">Boshlanish sanasi</span>
                  <span className="font-semibold text-[#2D3142]">
                    {formatDate(plan.start_date)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#9EB1D4]">Yaratilgan</span>
                  <span className="font-semibold text-[#2D3142]">
                    {formatDate(plan.created_at)}
                  </span>
                </div>
              </div>

              {/* View button */}
              <div className="mt-auto pt-1">
                <div className="w-full h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[12px] font-bold rounded-xl flex items-center justify-center transition-colors">
                  Ko'rish
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={createModalOpen} onOpenChange={(open) => !open && handleCloseCreate()}>
        <DialogContent className="rounded-[24px] sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Yangi yillik reja</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Group select */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#2D3142]">
                Guruh <span className="text-red-400">*</span>
              </label>
              <CustomSelect
                options={
                  groups?.map((g) => ({ value: g.id, label: g.name })) ?? []
                }
                value={formGroup}
                onChange={(v) => {
                  setFormGroup(Number(v));
                  setFormError("");
                }}
                placeholder="Guruhni tanlang"
                bgBtnColor="bg-[#F8F9FB]"
              />
            </div>

            {/* Start date */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#2D3142]">
                Boshlanish sanasi <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => {
                  setFormDate(e.target.value);
                  setFormError("");
                }}
                className={inputCls}
              />
            </div>

            {formError && (
              <p className="text-[12px] text-red-500 font-medium">{formError}</p>
            )}
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={handleCloseCreate}
              className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#6B7A99] hover:bg-gray-100 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-colors disabled:opacity-70"
            >
              {createMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              Yaratish
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
        }}
        title="Yillik rejani o'chirish"
        description="Ushbu yillik rejani o'chirmoqchimisiz? Bu amal qaytarib bo'lmaydi."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
