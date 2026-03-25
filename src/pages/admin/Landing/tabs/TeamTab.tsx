import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Plus, Pencil, Trash2, Loader2, X, Upload } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import type { TeamMember } from "@/types/landing.types";

const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL || "";

function resolveImage(src: string | null | undefined): string | null {
  if (!src) return null;
  return src.startsWith("http") ? src : MEDIA_URL + src;
}

export function TeamTab() {
  const { useTeamList, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember } = useLanding();
  const { data: team, isLoading } = useTeamList();
  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();
  const deleteMutation = useDeleteTeamMember();

  const [editing, setEditing] = useState<TeamMember | null>(null);
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
    reset({ name: "", specialty: "", experience_years: 0, order: 0, is_active: true });
    resetFileState();
    setIsAdding(true);
    setEditing(null);
  };

  const openEdit = (item: TeamMember) => {
    reset({ name: item.name, specialty: item.specialty, experience_years: item.experience_years, order: item.order, is_active: item.is_active });
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
    const payload: any = { ...data, experience_years: Number(data.experience_years) || 0, order: Number(data.order) || 0 };
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
        <h3 className="text-[18px] font-bold text-[#2D3142]">Jamoa a'zolari</h3>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-[12px] text-[13px] font-medium transition-colors">
          <Plus className="w-4 h-4" /> Qo'shish
        </button>
      </div>

      {(isAdding || editing) && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#F8F9FB] rounded-[16px] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#2D3142]">{editing ? "Tahrirlash" : "Yangi a'zo"}</span>
            <button type="button" onClick={closeForm} className="text-[#9EB1D4] hover:text-[#2D3142]"><X className="w-4 h-4" /></button>
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Rasm</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={resetFileState} className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()} className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-[#9EB1D4] hover:border-[#4D89FF] hover:text-[#4D89FF] transition-colors shrink-0">
                  <Upload className="w-4 h-4" />
                </button>
              )}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input {...register("name")} placeholder="Ism" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
                <input {...register("specialty")} placeholder="Mutaxassislik" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input {...register("experience_years", { valueAsNumber: true })} type="number" placeholder="Tajriba (yil)" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
            <input {...register("order", { valueAsNumber: true })} type="number" placeholder="Tartib" className="h-[44px] px-4 bg-white rounded-[10px] border border-gray-100 focus:border-[#4D89FF] outline-none text-[14px]" />
            <label className="flex items-center gap-2 text-[13px] font-medium text-[#6B7A99] cursor-pointer h-[44px]">
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
        {team?.map((member) => (
          <div key={member.id} className="p-4 bg-[#F8F9FB] rounded-[16px] group hover:bg-[#EEF4FF] transition-colors">
            <div className="flex items-start gap-3">
              {member.photo ? (
                <img src={resolveImage(member.photo)!} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[#2563EB] font-bold text-[14px]">
                  {member.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#2D3142] truncate">{member.name}</p>
                <p className="text-[12px] text-[#4D89FF]">{member.specialty}</p>
                <p className="text-[11px] text-[#9EB1D4] mt-1">{member.experience_years} yil tajriba</p>
                {!member.is_active && <span className="inline-block mt-1 px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded text-[10px] font-bold">Nofaol</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(member)} className="flex-1 h-8 flex items-center justify-center gap-1 rounded-lg bg-white text-[#4D89FF] hover:bg-blue-50 text-[12px] font-medium"><Pencil className="w-3 h-3" /> Tahrirlash</button>
              <button onClick={() => setDeleteId(member.id)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white text-red-400 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} title="A'zoni o'chirish" description="Ushbu jamoa a'zosini o'chirishni xohlaysizmi?" isLoading={deleteMutation.isPending} />
    </div>
  );
}
