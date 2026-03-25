import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import type { ValueCard } from "@/types/landing.types";

export function ValuesTab() {
  const { useValuesList, useCreateValueCard, useUpdateValueCard, useDeleteValueCard } = useLanding();
  const { data: values, isLoading } = useValuesList();
  const createMutation = useCreateValueCard();
  const updateMutation = useUpdateValueCard();
  const deleteMutation = useDeleteValueCard();

  const [editing, setEditing] = useState<ValueCard | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm();

  const openAdd = () => { reset({ title: "", description: "", icon: "", order: 0, is_active: true }); setIsAdding(true); setEditing(null); };
  const openEdit = (item: ValueCard) => { reset(item); setEditing(item); setIsAdding(false); };
  const closeForm = () => { setIsAdding(false); setEditing(null); };

  const onSubmit = (data: any) => {
    const payload = { ...data, order: Number(data.order) || 0 };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload }, { onSuccess: closeForm });
    } else {
      createMutation.mutate(payload, { onSuccess: closeForm });
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#2D3142]">Qadriyatlar</h3>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-[12px] text-[13px] font-medium transition-colors">
          <Plus className="w-4 h-4" /> Qo'shish
        </button>
      </div>

      {(isAdding || editing) && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#F8F9FB] rounded-[16px] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#2D3142]">{editing ? "Tahrirlash" : "Yangi qadriyat"}</span>
            <button type="button" onClick={closeForm} className="text-[#9EB1D4] hover:text-[#2D3142]"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register("title")} placeholder="Sarlavha" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
            <input {...register("icon")} placeholder="Ikon nomi (heart, star ...)" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
          </div>
          <textarea {...register("description")} placeholder="Tavsif" rows={2} className="w-full px-4 py-3 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px] resize-none" />
          <div className="flex items-center gap-4">
            <input {...register("order", { valueAsNumber: true })} type="number" placeholder="Tartib" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px] w-32" />
            <label className="flex items-center gap-2 text-[13px] font-medium text-[#6B7A99] cursor-pointer">
              <input {...register("is_active")} type="checkbox" className="w-4 h-4 rounded" />
              Faol
            </label>
          </div>
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-[10px] text-[13px] font-medium disabled:opacity-70">
            {(createMutation.isPending || updateMutation.isPending) ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {values?.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-[#F8F9FB] rounded-[14px] group hover:bg-[#EEF4FF] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2563EB] font-bold text-[14px]">
                {item.icon?.charAt(0)?.toUpperCase() || "V"}
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#2D3142]">{item.title}</p>
                <p className="text-[12px] text-[#9EB1D4] line-clamp-1">{item.description}</p>
                {!item.is_active && <span className="inline-block mt-1 px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded text-[10px] font-bold">Nofaol</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-[#4D89FF] hover:bg-blue-50"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => setDeleteId(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-red-400 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} title="Qadriyatni o'chirish" description="Ushbu qadriyatni o'chirishni xohlaysizmi?" isLoading={deleteMutation.isPending} />
    </div>
  );
}
