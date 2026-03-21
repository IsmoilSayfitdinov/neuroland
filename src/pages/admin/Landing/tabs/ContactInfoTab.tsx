import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLanding } from "@/hooks/admin/useLanding";
import { Loader2 } from "lucide-react";

export function ContactInfoTab() {
  const { useContactInfoList, usePatchContactInfo } = useLanding();
  const { data: contacts, isLoading } = useContactInfoList();
  const patchMutation = usePatchContactInfo();

  const contact = contacts?.[0];

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      phone: "",
      email: "",
      address: "",
      working_hours: "",
    },
  });

  useEffect(() => {
    if (contact) {
      reset({
        phone: contact.phone || "",
        email: contact.email || "",
        address: contact.address || "",
        working_hours: contact.working_hours || "",
      });
    }
  }, [contact, reset]);

  const onSubmit = (data: any) => {
    if (!contact) return;
    patchMutation.mutate({ id: contact.id, data });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" /></div>;

  if (!contact) return <p className="text-[#9EB1D4] text-center py-8">Kontakt ma'lumotlari topilmadi</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <h3 className="text-[18px] font-bold text-[#2D3142]">Kontakt ma'lumotlarini tahrirlash</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Telefon</label>
          <input {...register("phone")} className="w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Email</label>
          <input {...register("email")} type="email" className="w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Manzil</label>
          <input {...register("address")} className="w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#6B7A99] mb-1.5">Ish vaqti</label>
          <input {...register("working_hours")} className="w-full h-[48px] px-4 bg-[#F8F9FB] rounded-[12px] border border-transparent focus:border-[#4D89FF] focus:bg-white outline-none text-[14px] transition-colors" />
        </div>
      </div>

      <button type="submit" disabled={patchMutation.isPending} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[12px] text-[14px] font-medium transition-colors disabled:opacity-70">
        {patchMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </form>
  );
}
