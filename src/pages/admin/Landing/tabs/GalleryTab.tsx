import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import type { GalleryItem } from "@/types/landing.types";

export function GalleryTab() {
  const { useGalleryList, useCreateGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem } = useLanding();
  const { data: gallery, isLoading } = useGalleryList();
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm();

  const openAdd = () => { reset({ title: "", description: "", image_url: "", category: "", order: 0 }); setIsAdding(true); setEditing(null); };
  const openEdit = (item: GalleryItem) => { reset(item); setEditing(item); setIsAdding(false); };
  const closeForm = () => { setIsAdding(false); setEditing(null); };

  const onSubmit = (data: any) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data }, { onSuccess: closeForm });
    } else {
      createMutation.mutate(data, { onSuccess: closeForm });
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#2D3142]">Galereya</h3>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-[12px] text-[13px] font-medium transition-colors">
          <Plus className="w-4 h-4" /> Qo'shish
        </button>
      </div>

      {(isAdding || editing) && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#F8F9FB] rounded-[16px] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#2D3142]">{editing ? "Tahrirlash" : "Yangi rasm"}</span>
            <button type="button" onClick={closeForm} className="text-[#9EB1D4] hover:text-[#2D3142]"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register("title")} placeholder="Sarlavha" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
            <input {...register("category")} placeholder="Kategoriya" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
          </div>
          <input {...register("image_url")} placeholder="Rasm URL" className="w-full h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
          <textarea {...register("description")} placeholder="Tavsif" rows={2} className="w-full px-4 py-3 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px] resize-none" />
          <input {...register("order", { valueAsNumber: true })} type="number" placeholder="Tartib" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px] w-32" />
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-[10px] text-[13px] font-medium disabled:opacity-70">
            {(createMutation.isPending || updateMutation.isPending) ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery?.map((item) => (
          <div key={item.id} className="rounded-[16px] overflow-hidden bg-[#F8F9FB] group">
            {item.image_url && (
              <div className="aspect-video relative">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <p className="text-[14px] font-bold text-[#2D3142]">{item.title}</p>
              <p className="text-[12px] text-[#9EB1D4] line-clamp-1">{item.description}</p>
              {item.category && <span className="inline-block mt-2 px-2 py-0.5 bg-[#EEF4FF] text-[#2563EB] rounded-full text-[11px] font-medium">{item.category}</span>}
              <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="flex-1 h-8 flex items-center justify-center gap-1 rounded-lg bg-white text-[#4D89FF] hover:bg-blue-50 text-[12px] font-medium"><Pencil className="w-3 h-3" /> Tahrirlash</button>
                <button onClick={() => setDeleteId(item.id)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white text-red-400 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} title="Rasmni o'chirish" description="Ushbu galereya elementini o'chirishni xohlaysizmi?" isLoading={deleteMutation.isPending} />
    </div>
  );
}
