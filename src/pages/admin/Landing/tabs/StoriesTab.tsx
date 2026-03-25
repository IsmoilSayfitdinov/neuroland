import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import type { SuccessStory } from "@/types/landing.types";

export function StoriesTab() {
  const { useStoriesList, useCreateStory, useUpdateStory, useDeleteStory } = useLanding();
  const { data: stories, isLoading } = useStoriesList();
  const createMutation = useCreateStory();
  const updateMutation = useUpdateStory();
  const deleteMutation = useDeleteStory();

  const [editing, setEditing] = useState<SuccessStory | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm();

  const openAdd = () => { reset({ child_name: "", child_age: "", duration_text: "", diagnosis: "", before_text: "", after_text: "", order: 0, is_active: true }); setIsAdding(true); setEditing(null); };
  const openEdit = (item: SuccessStory) => { reset(item); setEditing(item); setIsAdding(false); };
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
        <h3 className="text-[18px] font-bold text-[#2D3142]">Muvaffaqiyat hikoyalari</h3>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-[12px] text-[13px] font-medium transition-colors">
          <Plus className="w-4 h-4" /> Qo'shish
        </button>
      </div>

      {(isAdding || editing) && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#F8F9FB] rounded-[16px] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#2D3142]">{editing ? "Tahrirlash" : "Yangi hikoya"}</span>
            <button type="button" onClick={closeForm} className="text-[#9EB1D4] hover:text-[#2D3142]"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register("child_name")} placeholder="Bola ismi" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
            <input {...register("child_age")} placeholder="Bola yoshi (3 yosh)" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
            <input {...register("duration_text")} placeholder="Davomiyligi (6 oy)" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
            <input {...register("diagnosis")} placeholder="Tashxis" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
          </div>
          <textarea {...register("before_text")} placeholder="Oldin (muammo tavsifi)" rows={2} className="w-full px-4 py-3 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px] resize-none" />
          <textarea {...register("after_text")} placeholder="Keyin (natija tavsifi)" rows={2} className="w-full px-4 py-3 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px] resize-none" />
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
        {stories?.map((story) => (
          <div key={story.id} className="p-4 bg-[#F8F9FB] rounded-[14px] group hover:bg-[#EEF4FF] transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-bold text-[#2D3142]">{story.child_name}</p>
                  <span className="text-[11px] text-[#9EB1D4]">{story.child_age} · {story.duration_text}</span>
                </div>
                <p className="text-[12px] text-[#4D89FF] font-medium mt-0.5">{story.diagnosis}</p>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <p className="text-[10px] font-bold text-red-400 uppercase">Oldin</p>
                    <p className="text-[12px] text-[#9EB1D4] line-clamp-1">{story.before_text}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase">Keyin</p>
                    <p className="text-[12px] text-[#9EB1D4] line-clamp-1">{story.after_text}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(story)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-[#4D89FF] hover:bg-blue-50"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteId(story.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-red-400 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} title="Hikoyani o'chirish" description="Ushbu hikoyani o'chirishni xohlaysizmi?" isLoading={deleteMutation.isPending} />
    </div>
  );
}
