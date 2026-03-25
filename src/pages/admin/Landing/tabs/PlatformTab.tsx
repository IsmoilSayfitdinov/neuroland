import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Loader2 } from "lucide-react";

const inputCls = "w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors";
const textareaCls = "w-full px-4 py-3 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors resize-none";

export function PlatformTab() {
  const { usePlatform, usePatchPlatform } = useLanding();
  const { data: platform, isLoading } = usePlatform();
  const patchPlatform = usePatchPlatform();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      doctor_title: "",
      doctor_subtitle: "",
      parent_title: "",
      parent_subtitle: "",
    },
  });

  useEffect(() => {
    if (platform) {
      reset({
        title: platform.title || "",
        subtitle: platform.subtitle || "",
        doctor_title: platform.doctor_title || "",
        doctor_subtitle: platform.doctor_subtitle || "",
        parent_title: platform.parent_title || "",
        parent_subtitle: platform.parent_subtitle || "",
      });
    }
  }, [platform, reset]);

  const onSubmit = (data: any) => {
    patchPlatform.mutate(data);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" /></div>;
  if (!platform) return <p className="text-[#9EB1D4] text-center py-8">Platforma bo'limi topilmadi</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <h3 className="text-[18px] font-bold text-[#2D3142]">Platforma bo'limini tahrirlash</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Sarlavha</label>
          <input {...register("title")} className={inputCls} />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Qo'shimcha sarlavha</label>
          <textarea {...register("subtitle")} rows={2} className={textareaCls} />
        </div>

        <p className="text-[14px] font-bold text-[#2D3142] pt-2">Shifokor qismi</p>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Shifokor sarlavha</label>
          <input {...register("doctor_title")} className={inputCls} />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Shifokor tavsifi</label>
          <textarea {...register("doctor_subtitle")} rows={2} className={textareaCls} />
        </div>

        <p className="text-[14px] font-bold text-[#2D3142] pt-2">Ota-ona qismi</p>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Ota-ona sarlavha</label>
          <input {...register("parent_title")} className={inputCls} />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Ota-ona tavsifi</label>
          <textarea {...register("parent_subtitle")} rows={2} className={textareaCls} />
        </div>
      </div>

      <button type="submit" disabled={patchPlatform.isPending} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[12px] text-[14px] font-medium transition-colors disabled:opacity-70">
        {patchPlatform.isPending ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </form>
  );
}
