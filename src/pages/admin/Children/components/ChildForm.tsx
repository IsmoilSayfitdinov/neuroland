import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { childSchema, type ChildSchema } from "@/schemas/children";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Upload, X } from "lucide-react";
import { useNavigate, useBlocker } from "@tanstack/react-router";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { CustomSelect } from "@/components/ui/custom-select";
import { IMaskInput } from "react-imask";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChildFormProps {
  initialData?: any;
  onSubmit: (data: ChildSchema, dirtyFields: Partial<Record<keyof ChildSchema, any>>) => void;
  isPending: boolean;
  isEditMode?: boolean;
}

export function ChildForm({ initialData, onSubmit, isPending, isEditMode }: ChildFormProps) {
  const navigate = useNavigate();
  const { useSpecialistsList, useSpecialistTypes } = useSpecialists();
  const { data: specialists } = useSpecialistsList();
  const { data: specialistTypes } = useSpecialistTypes();

  // typeId → specialistId
  const [assignments, setAssignments] = useState<Record<number, number | null>>({});

  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, dirtyFields, errors }
  } = useForm<ChildSchema>({
    resolver: zodResolver(childSchema) as any,
    defaultValues: initialData || {
      fio: "",
      phone_number: "",
      birth_date: "",
      alias: "",
      diagnosis: "",
      father_name: "",
      mother_name: "",
      phone_number_2: "",
      address: "",
      recommended_by: "",
      child_number_in_family: 1,
      photo: undefined,
      has_constipation: false,
      has_diarrhea: false,
      has_inner_speech: false,
      likes_bathing: false,
      wears_pampers: false,
      specialist_assignments: {},
    },
    mode: "onChange"
  });

  // Pre-fill assignments from initialData once specialistTypes are loaded (edit mode)
  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current || !specialistTypes?.length || !initialData?.specialist_assignments) return;
    const init: Record<number, number | null> = {};
    // initialData.specialist_assignments = { "logoped": 5, "neyropsixolog": 3 }
    const assignments_data = initialData.specialist_assignments as Record<string, number>;
    specialistTypes.forEach((t) => {
      // Try matching by title (lowercase)
      const byTitle = assignments_data[t.title.toLowerCase()];
      // Also try matching by title as-is (case sensitive)
      const byTitleExact = assignments_data[t.title];
      const val = byTitle ?? byTitleExact;
      if (val != null) init[t.id] = val;
    });
    if (Object.keys(init).length > 0) {
      setAssignments(init);
    }
    prefilled.current = true;
  }, [specialistTypes, initialData]);

  // Sync assignments (typeId→specId) → form field as { typeTitle: specId }
  // Backend kutadi: { "logoped": 5, "neyropsixolog": 3 } — lowercase key
  useEffect(() => {
    if (!specialistTypes) return;
    const dict: Record<string, number | null> = {};
    specialistTypes.forEach((t) => {
      const val = assignments[t.id];
      if (val !== undefined) dict[t.title.toLowerCase()] = val;
    });
    setValue("specialist_assignments", dict, { shouldDirty: true });
  }, [assignments, specialistTypes, setValue]);

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
        e.returnValue = "";
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

  const onFormSubmit = async (data: any) => {
    setIsSubmittingInternal(true);
    try {
      await onSubmit(data as ChildSchema, dirtyFields);
    } catch (err) {
      // error
    } finally {
      setIsSubmittingInternal(false);
    }
  };

  const handleAssign = (typeId: number, specialistId: number) => {
    setAssignments((prev) => ({
      ...prev,
      [typeId]: prev[typeId] === specialistId ? null : specialistId,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: "/admin/child" })}
          className="w-10 h-10 bg-white border border-gray-100 rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
        </button>
        <h1 className="text-[20px] font-bold text-[#202532]">Bolalar</h1>
      </div>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit(onFormSubmit, (formErrors) => {
          console.error("Form validation errors:", formErrors);
          const firstError = Object.values(formErrors)[0];
          if (firstError?.message) {
            toast.error(String(firstError.message));
          }
        })}
        className="bg-white p-8 lg:p-10 rounded-[32px] border border-gray-50 shadow-sm min-h-[400px]"
      >
        <div className="space-y-12">
          {/* Section 1: Basic Info */}
          <div className="space-y-8">
            <h2 className="text-[17px] font-bold text-[#202532]">Bola haqida asosiy ma'lumotlar</h2>

            {/* Photo upload */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#202532]">Bolaning rasmi</label>
              <Controller
                name="photo"
                control={control}
                render={({ field }) => {
                  const preview = field.value instanceof File
                    ? URL.createObjectURL(field.value)
                    : typeof field.value === "string" && field.value
                    ? field.value
                    : null;
                  return (
                    <div className="flex items-center gap-4">
                      {preview ? (
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-100">
                          <img src={preview} alt="Bola rasmi" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => field.onChange(null)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-3 h-20 px-6 bg-[#F8F9FB] rounded-2xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                          <Upload className="w-5 h-5 text-[#9EB1D4]" />
                          <span className="text-[13px] text-[#9EB1D4] font-medium">Rasm yuklash</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) field.onChange(file);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#202532]">Bolaning F.I.O <span className="text-red-400">*</span></label>
                <input
                  {...register("fio")}
                  placeholder="Abdullayev Jasur"
                  className={cn("w-full h-[52px] bg-[#F8F9FB] border-none rounded-[10px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] font-medium", errors.fio && "ring-2 ring-red-300")}
                />
                {errors.fio && <p className="text-[12px] text-red-500">{errors.fio.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#202532]">Taxallusi (laqab)</label>
                <input
                  {...register("alias")}
                  placeholder="Masalan: Jasurjon"
                  className="w-full h-[52px] bg-[#F8F9FB] border-none rounded-[10px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#202532]">Tug'ilgan sana <span className="text-red-400">*</span></label>
                <Controller
                  name="birth_date"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                      className={cn("bg-[#F8F9FB] border-none rounded-[10px]", errors.birth_date && "ring-2 ring-red-300")}
                    />
                  )}
                />
                {errors.birth_date && <p className="text-[12px] text-red-500">{errors.birth_date.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#202532]">Otasi ismi</label>
                <input
                  {...register("father_name")}
                  placeholder="Ism va familiya"
                  className="w-full h-[52px] bg-[#F8F9FB] border-none rounded-[10px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#202532]">Onasi ismi</label>
                <input
                  {...register("mother_name")}
                  placeholder="Ism va familiya"
                  className="w-full h-[52px] bg-[#F8F9FB] border-none rounded-[10px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#202532]">Telefon raqami 1 <span className="text-red-400">*</span></label>
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="+{998} 00 000 00 00"
                      value={field.value}
                      onAccept={(value) => field.onChange(value)}
                      placeholder="+998 90 123 45 67"
                      className={cn("w-full h-[52px] bg-[#F8F9FB] border-none rounded-[10px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] font-medium", errors.phone_number && "ring-2 ring-red-300")}
                    />
                  )}
                />
                {errors.phone_number && <p className="text-[12px] text-red-500">{errors.phone_number.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#202532]">Telefon raqami 2</label>
                <Controller
                  name="phone_number_2"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="+{998} 00 000 00 00"
                      value={field.value || ""}
                      onAccept={(value) => field.onChange(value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full h-[52px] bg-[#F8F9FB] border-none rounded-[10px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] font-medium"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#202532]">Parol <span className="text-red-400">*</span></label>
                <input
                  {...register("password")}
                  placeholder="Kamida 4 ta belgi"
                  className={cn("w-full h-[52px] bg-[#F8F9FB] border-none rounded-[10px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] font-medium", errors.password && "ring-2 ring-red-300")}
                />
                {errors.password && <p className="text-[12px] text-red-500">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#202532]">Yashash manzili</label>
                <input
                  {...register("address")}
                  placeholder="Toshkent sh., Chilonzor 5-mavze"
                  className="w-full h-[52px] bg-[#F8F9FB] border-none rounded-[10px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#202532]">Oilada nechanchi farzand</label>
                <input
                  type="number"
                  {...register("child_number_in_family")}
                  placeholder="1"
                  min={1}
                  max={20}
                  className="w-full h-[52px] bg-[#F8F9FB] border-none rounded-[10px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] font-medium"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[13px] font-bold text-[#202532]">Kim tavsiya qilgan</label>
                <input
                  {...register("recommended_by")}
                  placeholder="Masalan: Dr. Karimov tavsiyasi"
                  className="w-full h-[52px] bg-[#F8F9FB] border-none rounded-[10px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Specialist Assignment */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-[17px] font-bold text-[#202532]">Mutaxassislarni biriktirish</h2>
              <p className="text-[13px] text-[#9EB1D4] font-medium">Har bir yo'nalish uchun mutaxassis tanlang</p>
            </div>

            {!specialistTypes?.length ? (
              <p className="text-[13px] text-[#9EB1D4]">Mutaxassis turlari yuklanmoqda...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {specialistTypes.map((type) => {
                  const typeSpecialists = specialists?.filter(
                    (s) => s.specialist_type_id === type.id
                  ) || [];
                  const selectedId = assignments[type.id] ?? null;

                  return (
                    <div key={type.id} className="space-y-2">
                      <label className="text-[13px] font-bold text-[#202532]">{type.title}</label>
                      {typeSpecialists.length === 0 ? (
                        <div className="h-[52px] bg-[#F8F9FB] rounded-[10px] px-5 flex items-center">
                          <span className="text-[13px] text-[#9EB1D4]">Mutaxassislar yo'q</span>
                        </div>
                      ) : (
                        <CustomSelect
                          options={typeSpecialists.map((s) => ({ label: s.fio, value: s.id }))}
                          value={selectedId ?? ""}
                          onChange={(val) => handleAssign(type.id, Number(val))}
                          placeholder="Tanlang..."
                          bgBtnColor="bg-[#F8F9FB]"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Selected summary */}
            {Object.values(assignments).some(Boolean) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {specialistTypes?.map((type) => {
                  const specId = assignments[type.id];
                  if (!specId) return null;
                  const spec = specialists?.find((s) => s.id === specId);
                  if (!spec) return null;
                  return (
                    <span
                      key={type.id}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold",
                        "bg-[#EEF4FF] text-[#4D89FF]"
                      )}
                    >
                      <span className="text-[#9EB1D4]">{type.title}:</span>
                      {spec.fio}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      
        <div className="mt-4 flex items-center justify-end gap-3">
          <Button
            type="button"
            onClick={() => navigate({ to: "/admin/child" })}
            className="h-[48px] px-10 rounded-[12px] bg-white border border-gray-100 text-[#2D3142] font-bold hover:bg-gray-50 transition-all text-[14px]"
          >
            Bekor qilish
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            className="h-[48px] px-12 rounded-[12px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all shadow-lg shadow-[#2563EB]/20 disabled:opacity-70 text-[14px]"
          >
            {isPending ? (isEditMode ? "Saqlanmoqda..." : "Qo'shilmoqda...") : (isEditMode ? "Saqlash" : "Qo'shish")}
          </Button>
        </div>
      </form>

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
    </div>
  );
}
