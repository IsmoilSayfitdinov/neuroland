import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Loader2 } from "lucide-react";

export function AboutTab() {
  const { useAboutList, usePatchAbout } = useLanding();
  const { data: aboutList, isLoading } = useAboutList();
  const patchAbout = usePatchAbout();

  const about = aboutList?.[0];

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      mission: "",
      vision: "",
    },
  });

  useEffect(() => {
    if (about) {
      reset({
        title: about.title || "",
        description: about.description || "",
        image_url: about.image_url || "",
        mission: about.mission || "",
        vision: about.vision || "",
      });
    }
  }, [about, reset]);

  const onSubmit = (data: any) => {
    if (!about) return;
    patchAbout.mutate({ id: about.id, data });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" /></div>;

  if (!about) return <p className="text-[#9EB1D4] text-center py-8">Biz haqimizda bo'limi topilmadi</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <h3 className="text-[18px] font-bold text-[#2D3142]">Biz haqimizda bo'limini tahrirlash</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Sarlavha</label>
          <input {...register("title")} className="w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Tavsif</label>
          <textarea {...register("description")} rows={3} className="w-full px-4 py-3 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors resize-none" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Rasm URL</label>
          <input {...register("image_url")} className="w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Missiya</label>
          <textarea {...register("mission")} rows={2} className="w-full px-4 py-3 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors resize-none" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Viziya</label>
          <textarea {...register("vision")} rows={2} className="w-full px-4 py-3 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors resize-none" />
        </div>
      </div>

      <button type="submit" disabled={patchAbout.isPending} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[12px] text-[14px] font-medium transition-colors disabled:opacity-70">
        {patchAbout.isPending ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </form>
  );
}
