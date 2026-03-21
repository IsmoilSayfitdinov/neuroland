import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Plus, Pencil, Trash2, Loader2, X, Star } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import type { Testimonial } from "@/types/landing.types";

export function TestimonialsTab() {
  const { useTestimonialsList, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } = useLanding();
  const { data: testimonials, isLoading } = useTestimonialsList();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm();

  const openAdd = () => { reset({ client_name: "", client_role: "", testimonial_text: "", rating: 5, image_url: "" }); setIsAdding(true); setEditing(null); };
  const openEdit = (item: Testimonial) => { reset(item); setEditing(item); setIsAdding(false); };
  const closeForm = () => { setIsAdding(false); setEditing(null); };

  const onSubmit = (data: any) => {
    const payload = { ...data, rating: Number(data.rating) };
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
        <h3 className="text-[18px] font-bold text-[#2D3142]">Mijozlar sharhlari</h3>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-[12px] text-[13px] font-medium transition-colors">
          <Plus className="w-4 h-4" /> Qo'shish
        </button>
      </div>

      {(isAdding || editing) && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#F8F9FB] rounded-[16px] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#2D3142]">{editing ? "Tahrirlash" : "Yangi sharh"}</span>
            <button type="button" onClick={closeForm} className="text-[#9EB1D4] hover:text-[#2D3142]"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register("client_name")} placeholder="Mijoz ismi" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
            <input {...register("client_role")} placeholder="Lavozim" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
            <input {...register("image_url")} placeholder="Rasm URL" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
            <input {...register("rating")} type="number" min={1} max={5} placeholder="Reyting (1-5)" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
          </div>
          <textarea {...register("testimonial_text")} placeholder="Sharh matni" rows={3} className="w-full px-4 py-3 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px] resize-none" />
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-[10px] text-[13px] font-medium disabled:opacity-70">
            {(createMutation.isPending || updateMutation.isPending) ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {testimonials?.map((item) => (
          <div key={item.id} className="p-4 bg-[#F8F9FB] rounded-[14px] group hover:bg-[#EEF4FF] transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#2563EB] font-bold text-[13px]">{item.client_name.charAt(0)}</div>
                )}
                <div>
                  <p className="text-[14px] font-bold text-[#2D3142]">{item.client_name}</p>
                  <p className="text-[12px] text-[#9EB1D4]">{item.client_role}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < item.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-[#4D89FF] hover:bg-blue-50"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteId(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-red-400 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p className="text-[13px] text-[#6B7A99] mt-3 line-clamp-2">"{item.testimonial_text}"</p>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} title="Sharhni o'chirish" description="Ushbu sharhni o'chirishni xohlaysizmi?" isLoading={deleteMutation.isPending} />
    </div>
  );
}
