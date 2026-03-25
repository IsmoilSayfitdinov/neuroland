import { ChevronLeft, Image as ImageIcon, Upload, X } from "lucide-react";
import { useNavigate, useBlocker } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/custom-select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { specialistSchema, type SpecialistSchema } from "@/schemas/specialists";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import type { SpecialistOut } from "@/types/specialists.types";
import { toast } from "sonner";
import { IMaskInput } from "react-imask";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";

interface SpecialistFormProps {
  initialData?: SpecialistOut;
  onSubmit: (data: any) => void;
  isPending: boolean;
  title: string;
}

export function SpecialistForm({ initialData, onSubmit, isPending, title }: SpecialistFormProps) {
  const navigate = useNavigate();
  const { useSpecialistTypes } = useSpecialists();
  const { data: types } = useSpecialistTypes();

  const [selectedShift, setSelectedShift] = useState(initialData?.shift || "Kunlik (9:00 - 17:00)");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialData?.work_days ? initialData.work_days.split(", ").filter(Boolean) : []
  );
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors, isDirty }, setValue, watch, reset, control } = useForm<SpecialistSchema>({
    resolver: zodResolver(specialistSchema),
    defaultValues: {
      is_certified: false,
      max_patients: 0,
      max_groups: 0,
      weekly_hour_limit: 0,
      shift: "Kunlik (9:00 - 17:00)",
      work_days: "",
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fio: initialData.fio || initialData?.fio || "",
        phone_number: initialData?.phone_number || "",
        email: initialData?.email || "",
        photo: initialData?.photo || "",
        specialist_type_id: initialData.specialist_type_id,
        shift: initialData.shift || "Kunlik (9:00 - 17:00)",
        work_days: initialData.work_days || "",
        max_patients: initialData.max_patients || 0,
        max_groups: initialData.max_groups || 0,
        weekly_hour_limit: initialData.weekly_hour_limit || 0,
        is_certified: initialData.is_certified || false,
      });
      setSelectedShift(initialData.shift || "Kunlik (9:00 - 17:00)");
      setSelectedDays(initialData.work_days ? initialData.work_days.split(", ").filter(Boolean) : []);
      setPhotoPreview(initialData.photo || null);
    }
  }, [initialData, reset]);

  const blocker = useBlocker({
    shouldBlockFn: ({ next, current }: { next: any; current: any }) => {
      if (isSubmittingInternal || !isDirty) return false;
      return next.pathname !== current.pathname;
    },
    withResolver: true,
  }) as any;

  useEffect(() => {
    if (blocker.status === 'blocked') {
      setShowLeaveModal(true);
    }
  }, [blocker.status]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmittingInternal) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmittingInternal]);

  const handleConfirmLeave = () => {
    blocker.proceed();
    setShowLeaveModal(false);
  };

  const handleCancelLeave = () => {
    blocker.reset();
    setShowLeaveModal(false);
  };



  const isCertified = watch("is_certified");
  const daysOfWeek = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

  const toggleDay = (day: string) => {
    const updated = selectedDays.includes(day) 
      ? selectedDays.filter(d => d !== day) 
      : [...selectedDays, day];
    setSelectedDays(updated);
    setValue("work_days", updated.join(", "));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Rasm hajmi 5MB dan oshmasligi kerak");
        return;
      }
      setValue("photo", file, { shouldDirty: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setValue("photo", undefined, { shouldDirty: true });
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (data: SpecialistSchema) => {
    if (selectedDays.length === 0) {
      toast.error("Kamida bitta ish kunini tanlang");
      return;
    }
    setIsSubmittingInternal(true);
    try {
      await onSubmit({
        ...data,
        phone_number: data.phone_number.replace(/\s/g, ""),
        shift: selectedShift,
        work_days: selectedDays.join(", "),
      });
    } catch (err) {
      setIsSubmittingInternal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className=" mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => navigate({ to: "/admin/specialists" })}
            className="w-10 h-10 bg-white border border-gray-200 rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
          </button>
          <h1 className="text-[24px] font-bold text-[#2D3142]">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => navigate({ to: "/admin/specialists" })}
            className="px-6 py-2.5 bg-white border border-gray-200 text-[#2D3142] text-[13px] font-medium rounded-[12px] hover:bg-gray-50 transition-colors"
          >
            Bekor qilish
          </button>
          <button 
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-[#2563EB] text-white text-[13px] font-medium rounded-[12px] hover:bg-[#1D4ED8] transition-colors shadow-sm disabled:opacity-70"
          >
            {isPending ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          {/* Shaxsiy ma'lumotlar */}
          <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#2D3142] mb-1">Shaxsiy ma'lumotlar</h2>
            <p className="text-[14px] text-[#9EB1D4] mb-6">Mutaxassisning asosiy ma'lumotlari</p>

            <div className="space-y-5">
              <div>
                <label className="block text-[14px] font-medium text-[#2D3142] mb-2">F.I.O</label>
                <input 
                  {...register("fio")}
                  type="text" 
                  placeholder="Ismni kiriting"
                  className={cn(
                    "w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none transition-colors text-[14px]",
                    errors.fio && "border-red-500 bg-red-50"
                  )}
                />
                {errors.fio && <p className="text-[11px] text-red-500 mt-1">{errors.fio.message}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#2D3142] mb-2">Telefon raqam</label>
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="+{998} 00 000 00 00"
                      value={field.value}
                      onAccept={(value) => field.onChange(value)}
                      placeholder="+998 90 123 45 67"
                      className={cn(
                        "w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none transition-colors text-[14px]",
                        errors.phone_number && "border-red-500 bg-red-50"
                      )}
                    />
                  )}
                />
                {errors.phone_number && <p className="text-[11px] text-red-500 mt-1">{errors.phone_number.message}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#2D3142] mb-2">Email</label>
                <input 
                  {...register("email")}
                  type="email" 
                  placeholder="email@example.com"
                  className={cn(
                    "w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none transition-colors text-[14px]",
                    errors.email && "border-red-500 bg-red-50"
                  )}
                />
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              {!initialData && (
                <div>
                  <label className="block text-[14px] font-medium text-[#2D3142] mb-2">Parol</label>
                  <input 
                    {...register("password")}
                    type="password" 
                    placeholder="********"
                    className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none transition-colors text-[14px]"
                  />
                  <p className="text-[11px] text-[#9EB1D4] mt-1">Ko'rsatilmasa, 'Specialist123!' o'rnatiladi</p>
                </div>
              )}

              <div>
                <label className="block text-[14px] font-medium text-[#2D3142] mb-2">Profil rasmi</label>
                <div className="flex items-center gap-4">
                  <div className="w-[100px] h-[100px] bg-[#F8F9FB] rounded-[24px] border border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                    {photoPreview ? (
                      <>
                        <img src={import.meta.env.VITE_API_MEDIA_URL + photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-6 h-6 text-white" />
                        </button>
                      </>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#9EB1D4]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-[12px] text-[13px] font-medium text-[#2D3142] hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Rasm yuklash
                    </button>
                    <p className="text-[11px] text-[#9EB1D4] mt-2">
                      PNG, JPG yoki WEBP. Maksimum 5MB.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rol tanlash */}
          <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#2D3142] mb-1">Rol tanlash</h2>
            <p className="text-[14px] text-[#9EB1D4] mb-6">Mutaxassisning asosiy yo'nalishi</p>

            <div>
              <Controller
                name="specialist_type_id"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Mutaxassis turi"
                    options={types?.map(t => ({ label: t.title, value: t.id })) || []}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    error={errors.specialist_type_id?.message}
                    placeholder="Mutaxassis turini tanlang"
                    bgBtnColor="bg-slate-50"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Ish jadvali */}
          <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#2D3142] mb-1">Ish jadvali</h2>
            <p className="text-[14px] text-[#9EB1D4] mb-6">Ish vaqti va kunlarini belgilang</p>

            <div className="space-y-6">
              <div>
                <label className="block text-[14px] font-medium text-[#2D3142] mb-3">Smena</label>
                <div className="space-y-3">
                  {[
                    { id: "1", label: "09:00 - 12:00", val: "1-smena (9:00 - 12:00)" },
                    { id: "2", label: "13:00 - 17:00", val: "2-smena (13:00 - 17:00)" },
                    { id: "full", label: "09:00 - 17:00", val: "Kunlik (9:00 - 17:00)" }
                  ].map(s => (
                    <label key={s.id} className={cn(
                      "flex items-center gap-3 p-4 rounded-[12px] border cursor-pointer transition-colors",
                      selectedShift === s.val ? "border-[#4D89FF] bg-[#F0F5FF]/50" : "border-gray-200 hover:border-gray-300"
                    )}>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        selectedShift === s.val ? "border-[#4D89FF]" : "border-gray-300"
                      )}>
                        {selectedShift === s.val && <div className="w-2.5 h-2.5 bg-[#4D89FF] rounded-full" />}
                      </div>
                      <span className="text-[14px] font-medium text-[#2D3142]">
                        {s.id === "full" ? "Kunlik" : `${s.id}-smena`} 
                        <span className="text-[#9EB1D4] ml-2 font-normal">{s.label}</span>
                      </span>
                      <input 
                        type="radio" 
                        className="hidden" 
                        name="shift" 
                        onChange={() => setSelectedShift(s.val)} 
                        checked={selectedShift === s.val} 
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#2D3142] mb-3">Hafta kunlari</label>
                <div className="grid grid-cols-2 gap-3">
                  {daysOfWeek.map(day => (
                    <label key={day} className="flex items-center gap-3 p-3 rounded-[12px] border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                      <div className={cn(
                        "w-5 h-5 rounded-[6px] border flex items-center justify-center shrink-0 transition-colors",
                        selectedDays.includes(day) ? "bg-[#4D89FF] border-[#4D89FF]" : "border-gray-300 bg-white"
                      )}>
                        {selectedDays.includes(day) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[14px] font-medium text-[#2D3142]">{day}</span>
                      <input type="checkbox" className="hidden" onChange={() => toggleDay(day)} checked={selectedDays.includes(day)} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Yuklama parametrlari */}
          <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#2D3142] mb-1">Yuklama parametrlari</h2>
            <p className="text-[14px] text-[#9EB1D4] mb-6">Mutaxassisning ish hajmi chegaralari</p>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#2D3142] mb-2">Bemor soni</label>
                <input 
                  {...register("max_patients", { valueAsNumber: true })}
                  type="number" 
                  className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none transition-colors text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D3142] mb-2">Guruh soni</label>
                <input 
                  {...register("max_groups", { valueAsNumber: true })}
                  type="number" 
                  className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none transition-colors text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D3142] mb-2">Soat limiti</label>
                <input 
                  {...register("weekly_hour_limit", { valueAsNumber: true })}
                  type="number" 
                  className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none transition-colors text-[14px]"
                />
              </div>
            </div>
          </div>

          {/* Sertifikatsiya holati */}
          <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-center">
            <h2 className="text-[18px] font-bold text-[#2D3142] mb-1">Sertifikatsiya holati</h2>
            <p className="text-[14px] text-[#9EB1D4] mb-6">Majburiy kurslar holati</p>

            <div className="flex items-center justify-between p-4 rounded-[16px] border border-gray-100">
              <div>
                <h4 className="text-[15px] font-bold text-[#2D3142] mb-1">Kurslar tugallangan</h4>
              </div>
              <button 
                type="button"
                onClick={() => setValue("is_certified", !isCertified)}
                className={cn(
                  "w-[46px] h-[26px] rounded-full relative transition-colors duration-300",
                  isCertified ? "bg-[#3DB87E]" : "bg-[#E2E8F0]"
                )}
              >
                <div className={cn(
                  "w-[22px] h-[22px] bg-white rounded-full absolute top-[2px] shadow-sm transition-transform duration-300",
                  isCertified ? "translate-x-[22px]" : "translate-x-[2px]"
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showLeaveModal}
        onClose={handleCancelLeave}
        onConfirm={handleConfirmLeave}
        title="Sahifadan chiqish"
        description="Sizda saqlanmagan ma'lumotlar bor. Haqiqatan ham chiqib ketmoqchimisiz? Kiritilgan ma'lumotlar saqlanmaydi."
        confirmText="Chiqish"
        cancelText="Qolish"
        variant="danger"
      />
    </form>
  );
}
