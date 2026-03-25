import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Loader2 } from "lucide-react";

const inputCls = "w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors";

export function ContactInfoTab() {
  const { useContactInfo, usePatchContactInfo } = useLanding();
  const { data: contact, isLoading } = useContactInfo();
  const patchMutation = usePatchContactInfo();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      phone: "",
      email: "",
      address: "",
      work_hours: "",
      footer_description: "",
    },
  });

  useEffect(() => {
    if (contact) {
      reset({
        phone: contact.phone || "",
        email: contact.email || "",
        address: contact.address || "",
        work_hours: contact.work_hours || "",
        footer_description: contact.footer_description || "",
      });
    }
  }, [contact, reset]);

  const onSubmit = (data: any) => {
    patchMutation.mutate(data);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" /></div>;
  if (!contact) return <p className="text-[#9EB1D4] text-center py-8">Kontakt ma'lumotlari topilmadi</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <h3 className="text-[18px] font-bold text-[#2D3142]">Kontakt ma'lumotlarini tahrirlash</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Telefon</label>
          <input {...register("phone")} className={inputCls} />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Email</label>
          <input {...register("email")} type="email" className={inputCls} />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Manzil</label>
          <input {...register("address")} className={inputCls} />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Ish vaqti</label>
          <input {...register("work_hours")} className={inputCls} />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Footer tavsifi</label>
          <textarea {...register("footer_description")} rows={3} className="w-full px-4 py-3 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors resize-none" />
        </div>
      </div>

      <button type="submit" disabled={patchMutation.isPending} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[12px] text-[14px] font-medium transition-colors disabled:opacity-70">
        {patchMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </form>
  );
}
