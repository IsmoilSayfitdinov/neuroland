import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Plus, Pencil, Trash2, Loader2, X, Upload } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import type { Testimonial } from "@/types/landing.types";

const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL || "";

function resolveImage(src: string | null | undefined): string | null {
  if (!src) return null;
  return src.startsWith("http") ? src : MEDIA_URL + src;
}

export function TestimonialsTab() {
  const { useTestimonialsList, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } = useLanding();
  const { data: testimonials, isLoading } = useTestimonialsList();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm();

  const resetFileState = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openAdd = () => {
    reset({ author_name: "", author_info: "", text: "", order: 0, is_active: true });
    resetFileState();
    setIsAdding(true);
    setEditing(null);
  };

  const openEdit = (item: Testimonial) => {
    reset({ author_name: item.author_name, author_info: item.author_info, text: item.text, order: item.order, is_active: item.is_active });
    setPhotoPreview(resolveImage(item.photo));
    setPhotoFile(null);
    setEditing(item);
    setIsAdding(false);
  };

  const closeForm = () => { setIsAdding(false); setEditing(null); resetFileState(); };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: any) => {
    const payload: any = { ...data, order: Number(data.order) || 0 };
    if (photoFile) payload.photo = photoFile;

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

          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
              {photoPreview ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={resetFileState} className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()} className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-[#9EB1D4] hover:border-[#4D89FF] hover:text-[#4D89FF] transition-colors shrink-0">
                  <Upload className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input {...register("author_name")} placeholder="Muallif ismi" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
              <input {...register("author_info")} placeholder="Muallif haqida (ota/ona)" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
            </div>
          </div>

          <textarea {...register("text")} placeholder="Sharh matni" rows={3} className="w-full px-4 py-3 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px] resize-none" />
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
        {testimonials?.map((item) => (
          <div key={item.id} className="p-4 bg-[#F8F9FB] rounded-[14px] group hover:bg-[#EEF4FF] transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {item.photo ? (
                  <img src={resolveImage(item.photo)!} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#2563EB] font-bold text-[13px]">{item.author_name.charAt(0)}</div>
                )}
                <div>
                  <p className="text-[14px] font-bold text-[#2D3142]">{item.author_name}</p>
                  <p className="text-[12px] text-[#9EB1D4]">{item.author_info}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-[#4D89FF] hover:bg-blue-50"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteId(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-red-400 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p className="text-[13px] text-[#6B7A99] mt-3 line-clamp-2">"{item.text}"</p>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} title="Sharhni o'chirish" description="Ushbu sharhni o'chirishni xohlaysizmi?" isLoading={deleteMutation.isPending} />
    </div>
  );
}
