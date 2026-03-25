import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Loader2, Upload, X } from "lucide-react";

const inputCls = "w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors";
const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL || "";

export function HeroTab() {
  const { useHero, usePatchHero } = useLanding();
  const { data: hero, isLoading } = useHero();
  const patchHero = usePatchHero();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      button_text: "",
      stat_1_value: "",
      stat_1_label: "",
      stat_2_value: "",
      stat_2_label: "",
      stat_3_value: "",
      stat_3_label: "",
    },
  });

  useEffect(() => {
    if (hero) {
      reset({
        title: hero.title || "",
        subtitle: hero.subtitle || "",
        button_text: hero.button_text || "",
        stat_1_value: hero.stat_1_value || "",
        stat_1_label: hero.stat_1_label || "",
        stat_2_value: hero.stat_2_value || "",
        stat_2_label: hero.stat_2_label || "",
        stat_3_value: hero.stat_3_value || "",
        stat_3_label: hero.stat_3_label || "",
      });
      setImagePreview(hero.image ? (hero.image.startsWith("http") ? hero.image : MEDIA_URL + hero.image) : null);
    }
  }, [hero, reset]);

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
    patchHero.mutate(payload);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" /></div>;
  if (!hero) return <p className="text-[#9EB1D4] text-center py-8">Hero bo'limi topilmadi</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <h3 className="text-[18px] font-bold text-[#2D3142]">Hero bo'limini tahrirlash</h3>

      <div className="space-y-4">
        {/* Image upload */}
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Rasm</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-[12px] overflow-hidden bg-[#F8F9FB]">
              <img src={imagePreview} alt="Hero" className="w-full h-full object-cover" />
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
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Qo'shimcha sarlavha</label>
          <textarea {...register("subtitle")} rows={3} className="w-full px-4 py-3 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors resize-none" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Tugma matni</label>
          <input {...register("button_text")} className={inputCls} />
        </div>

        <p className="text-[14px] font-bold text-[#2D3142] pt-2">Statistika</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Stat 1 qiymat</label>
            <input {...register("stat_1_value")} placeholder="150+" className={inputCls} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Stat 1 label</label>
            <input {...register("stat_1_label")} placeholder="Bolalar" className={inputCls} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Stat 2 qiymat</label>
            <input {...register("stat_2_value")} className={inputCls} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Stat 2 label</label>
            <input {...register("stat_2_label")} className={inputCls} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Stat 3 qiymat</label>
            <input {...register("stat_3_value")} className={inputCls} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Stat 3 label</label>
            <input {...register("stat_3_label")} className={inputCls} />
          </div>
        </div>
      </div>

      <button type="submit" disabled={patchHero.isPending} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[12px] text-[14px] font-medium transition-colors disabled:opacity-70">
        {patchHero.isPending ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </form>
  );
}
