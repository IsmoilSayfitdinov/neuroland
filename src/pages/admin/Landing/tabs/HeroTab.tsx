import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Loader2 } from "lucide-react";

export function HeroTab() {
  const { useHeroList, usePatchHero } = useLanding();
  const { data: heroes, isLoading } = useHeroList();
  const patchHero = usePatchHero();

  const hero = heroes?.[0];

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      hero_image_url: "",
      cta_text: "",
      cta_link: "",
    },
  });

  useEffect(() => {
    if (hero) {
      reset({
        title: hero.title || "",
        subtitle: hero.subtitle || "",
        hero_image_url: hero.hero_image_url || "",
        cta_text: hero.cta_text || "",
        cta_link: hero.cta_link || "",
      });
    }
  }, [hero, reset]);

  const onSubmit = (data: any) => {
    if (!hero) return;
    patchHero.mutate({ id: hero.id, data });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" /></div>;

  if (!hero) return <p className="text-[#9EB1D4] text-center py-8">Hero bo'limi topilmadi</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <h3 className="text-[18px] font-bold text-[#2D3142]">Hero bo'limini tahrirlash</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Sarlavha</label>
          <input {...register("title")} className="w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Qo'shimcha sarlavha</label>
          <input {...register("subtitle")} className="w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Rasm URL</label>
          <input {...register("hero_image_url")} className="w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">CTA matn</label>
            <input {...register("cta_text")} className="w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">CTA havola</label>
            <input {...register("cta_link")} className="w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={patchHero.isPending}
        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[12px] text-[14px] font-medium transition-colors disabled:opacity-70"
      >
        {patchHero.isPending ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </form>
  );
}
