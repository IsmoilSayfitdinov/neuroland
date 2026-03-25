import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Plus, Pencil, Trash2, Loader2, X, Upload } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import type { GalleryItem } from "@/types/landing.types";

const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL || "";

function resolveImage(src: string | null | undefined): string | null {
  if (!src) return null;
  return src.startsWith("http") ? src : MEDIA_URL + src;
}

export function GalleryTab() {
  const { useGalleryList, useCreateGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem } = useLanding();
  const { data: gallery, isLoading } = useGalleryList();
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  const [editing, setEditing] = useState<GalleryItem | null>(null);
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
    reset({ title: "", description: "", order: 0, is_active: true });
    resetFileState();
    setIsAdding(true);
    setEditing(null);
  };

  const openEdit = (item: GalleryItem) => {
    reset({ title: item.title, description: item.description, order: item.order, is_active: item.is_active });
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
      if (!photoFile) return;
      createMutation.mutate(payload, { onSuccess: closeForm });
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

          {/* Photo upload */}
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Rasm {!editing && <span className="text-red-400">*</span>}</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            {photoPreview ? (
              <div className="relative w-full h-40 rounded-[10px] overflow-hidden bg-gray-100">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={resetFileState} className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="w-full h-28 border-2 border-dashed border-gray-200 rounded-[10px] flex flex-col items-center justify-center gap-1.5 text-[#9EB1D4] hover:border-[#4D89FF] hover:text-[#4D89FF] transition-colors">
                <Upload className="w-5 h-5" />
                <span className="text-[12px]">Rasm yuklash</span>
              </button>
            )}
          </div>

          <input {...register("title")} placeholder="Sarlavha" className="w-full h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery?.map((item) => (
          <div key={item.id} className="rounded-[16px] overflow-hidden bg-[#F8F9FB] group">
            {item.photo && (
              <div className="aspect-video relative">
                <img src={resolveImage(item.photo)!} alt={item.title} className="w-full h-full object-cover" />
                {!item.is_active && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-800/70 text-white rounded text-[10px] font-bold">Nofaol</div>
                )}
              </div>
            )}
            <div className="p-4">
              <p className="text-[14px] font-bold text-[#2D3142]">{item.title}</p>
              {item.description && <p className="text-[12px] text-[#9EB1D4] line-clamp-1">{item.description}</p>}
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
