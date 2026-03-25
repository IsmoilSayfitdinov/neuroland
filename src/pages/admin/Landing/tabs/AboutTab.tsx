import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Loader2, Upload, X } from "lucide-react";

const inputCls = "w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors";
const textareaCls = "w-full px-4 py-3 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors resize-none";
const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL || "";

export function AboutTab() {
  const { useAbout, usePatchAbout } = useLanding();
  const { data: about, isLoading } = useAbout();
  const patchAbout = usePatchAbout();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      mission_title: "",
      mission_text: "",
      mission_icon: "",
      goal_title: "",
      goal_text: "",
      goal_icon: "",
    },
  });

  useEffect(() => {
    if (about) {
      reset({
        title: about.title || "",
        description: about.description || "",
        mission_title: about.mission_title || "",
        mission_text: about.mission_text || "",
        mission_icon: about.mission_icon || "",
        goal_title: about.goal_title || "",
        goal_text: about.goal_text || "",
        goal_icon: about.goal_icon || "",
      });
      setImagePreview(about.image ? (about.image.startsWith("http") ? about.image : MEDIA_URL + about.image) : null);
    }
  }, [about, reset]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = (data: any) => {
    const payload: any = { ...data };
    if (imageFile) payload.image = imageFile;
    patchAbout.mutate(payload);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" /></div>;
  if (!about) return <p className="text-[#9EB1D4] text-center py-8">Biz haqimizda bo'limi topilmadi</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <h3 className="text-[18px] font-bold text-[#2D3142]">Biz haqimizda bo'limini tahrirlash</h3>

      <div className="space-y-4">
        {/* Image upload */}
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Rasm</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-[12px] overflow-hidden bg-[#F8F9FB]">
              <img src={imagePreview} alt="About" className="w-full h-full object-cover" />
              <button type="button" onClick={removeImage} className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full h-32 border-2 border-dashed border-gray-200 rounded-[12px] flex flex-col items-center justify-center gap-2 text-[#9EB1D4] hover:border-[#4D89FF] hover:text-[#4D89FF] transition-colors">
              <Upload className="w-5 h-5" />
              <span className="text-[13px]">Rasm yuklash</span>
            </button>
          )}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Sarlavha</label>
          <input {...register("title")} className={inputCls} />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Tavsif</label>
          <textarea {...register("description")} rows={3} className={textareaCls} />
        </div>

        <p className="text-[14px] font-bold text-[#2D3142] pt-2">Missiya</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Missiya sarlavha</label>
            <input {...register("mission_title")} className={inputCls} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Missiya ikon</label>
            <input {...register("mission_icon")} placeholder="target" className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Missiya matni</label>
          <textarea {...register("mission_text")} rows={2} className={textareaCls} />
        </div>

        <p className="text-[14px] font-bold text-[#2D3142] pt-2">Maqsad</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Maqsad sarlavha</label>
            <input {...register("goal_title")} className={inputCls} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Maqsad ikon</label>
            <input {...register("goal_icon")} placeholder="star" className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Maqsad matni</label>
          <textarea {...register("goal_text")} rows={2} className={textareaCls} />
        </div>
      </div>

      <button type="submit" disabled={patchAbout.isPending} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[12px] text-[14px] font-medium transition-colors disabled:opacity-70">
        {patchAbout.isPending ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </form>
  );
}
