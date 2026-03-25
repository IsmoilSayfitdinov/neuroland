import { useState } from "react";
import { Plus, Edit2, Trash2, Loader2, CreditCard } from "lucide-react";
import { useBilling } from "@/hooks/admin/useBilling";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { Plan, PlanRequest } from "@/types/billing.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const plansInfo = (
  <>
    <p>Bu bo'limda platformaning tarif rejalarini boshqarish mumkin. Ota-onalar shu tariflar orqali obuna bo'ladi.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Yangi tarif yaratish (nom, narx, muddat)</li>
      <li>Mavjud tariflarni tahrirlash</li>
      <li>Tariflarni o'chirish</li>
    </ul>
  </>
);

export default function PlansAdmin() {
  const { usePlansList, useCreatePlan, useUpdatePlan, useDeletePlan } = useBilling();
  const { data: plans, isLoading } = usePlansList();
  const createMutation = useCreatePlan();
  const updateMutation = useUpdatePlan();
  const deleteMutation = useDeletePlan();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openCreate = () => { setEditingPlan(null); setIsModalOpen(true); };
  const openEdit = (plan: Plan) => { setEditingPlan(plan); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingPlan(null); };

  const handleSave = (data: PlanRequest) => {
    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data }, { onSuccess: closeModal });
    } else {
      createMutation.mutate(data, { onSuccess: closeModal });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Tariflar" infoTitle="Tariflar bo'limi" infoContent={plansInfo} />
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      <PageHeader
        title="Tariflar"
        action={
          <button onClick={openCreate} className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm transition-colors">
            <Plus className="w-[18px] h-[18px]" />
            Tarif qo'shish
          </button>
        }
      />

      {!plans?.length ? (
        <EmptyState icon={CreditCard} title="Tariflar mavjud emas" description="Hozircha tarif yaratilmagan." action={{ label: "Tarif qo'shish", onClick: openCreate, icon: Plus }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-[17px] font-bold text-[#2D3142]">{plan.name}</h3>
                    {plan.description && (
                      <p className="text-[13px] text-[#9EB1D4] mt-1 line-clamp-2">{plan.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(plan)} className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(plan.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-[28px] font-bold text-[#2D3142] mb-4">
                  {Number(plan.price).toLocaleString("uz-UZ")} <span className="text-[14px] font-medium text-[#9EB1D4]">so'm</span>
                </div>

                <div className="space-y-2.5">
                  {plan.sessions_per_week && (
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-[#9EB1D4]">Haftasiga seanslar</span>
                      <span className="font-bold text-[#2D3142]">{plan.sessions_per_week} ta</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#9EB1D4]">Holat</span>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                      plan.is_active !== false ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                    )}>
                      {plan.is_active !== false ? "Faol" : "Nofaol"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PlanModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initialData={editingPlan}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        title="Tarifni o'chirish"
        description="Ushbu tarifni o'chirmoqchimisiz?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

function PlanModal({ isOpen, onClose, onSave, initialData, isPending }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PlanRequest) => void;
  initialData?: Plan | null;
  isPending: boolean;
}) {
  const { register, handleSubmit, reset } = useForm<PlanRequest>();

  useEffect(() => {
    if (initialData) {
      reset({ name: initialData.name, price: initialData.price, sessions_per_week: initialData.sessions_per_week, description: initialData.description });
    } else {
      reset({ name: "", price: "", sessions_per_week: 5, description: "" });
    }
  }, [initialData, isOpen, reset]);

  const inputCls = "w-full h-[48px] px-4 bg-[#F8F9FB] border-none rounded-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4]";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-[24px] sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Tarifni tahrirlash" : "Yangi tarif"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Tarif nomi</label>
            <input {...register("name", { required: true })} placeholder="Masalan: Standard" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Narxi (so'm)</label>
            <input {...register("price", { required: true })} placeholder="2500000" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Haftasiga seanslar</label>
            <input {...register("sessions_per_week", { valueAsNumber: true })} type="number" placeholder="5" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Tavsif</label>
            <textarea {...register("description")} placeholder="Tarif haqida..." className="w-full h-[100px] p-4 bg-[#F8F9FB] border-none rounded-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] resize-none" />
          </div>
          <DialogFooter className="pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-[12px] text-[14px] font-medium text-[#2D3142] hover:bg-gray-100 transition-colors">Bekor qilish</button>
            <button type="submit" disabled={isPending} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[12px] text-[14px] font-medium disabled:opacity-70 transition-colors">
              {isPending ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
