import { Check, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useBlocker } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { sectionSchema, type SectionSchema, ageGroupSchema, type AgeGroupSchema } from "@/schemas/skills";
import { useSkills } from "@/hooks/admin/useSkills";
import { useState, useEffect } from "react";
import { CustomSelect } from "@/components/ui/custom-select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { SKILL_ICONS as icons, SKILL_COLORS as colors } from "@/constants/skills.constants";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";

interface DepartmentFormProps {
  initialData?: Partial<SectionSchema>;
  onSubmit: (data: SectionSchema) => void;
  isLoading: boolean;
  onCancel: () => void;
  title: string;
}

export function DepartmentForm({ initialData, onSubmit, isLoading, onCancel, title }: DepartmentFormProps) {
  const { 
    useAgeGroups, 
    useCreateAgeGroup 
  } = useSkills();

  const { data: ageGroups, isLoading: isLoadingAgeGroups } = useAgeGroups();
  const { mutate: createAgeGroup, isPending: isCreatingAgeGroup } = useCreateAgeGroup();
  
  const [isAgeGroupModalOpen, setIsAgeGroupModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<SectionSchema>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      icon: 'Activity',
      color: colors[0],
      ...initialData
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData
      });
    }
  }, [initialData, reset]);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);

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

  const handleFormSubmit = async (data: SectionSchema) => {
    setIsSubmittingInternal(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setIsSubmittingInternal(false);
    }
  };

  const selectedIcon = watch("icon");
  const selectedColor = watch("color");

  const ageGroupForm = useForm<AgeGroupSchema>({
    resolver: zodResolver(ageGroupSchema),
  });

  const onAddAgeGroup = (data: AgeGroupSchema) => {
    createAgeGroup(data, {
      onSuccess: (newGroup: any) => {
        setIsAgeGroupModalOpen(false);
        if (newGroup?.id) {
          setValue("age_group_id", Number(newGroup.id), { shouldValidate: true });
        }
        ageGroupForm.reset();
      },
    });
  };

  return (
    <div className="bg-white p-6 lg:p-10 rounded-[28px] border border-gray-100 shadow-sm">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
        
        {/* Left Side: Form */}
        <div className="flex-1 w-full space-y-6">
          <h2 className="text-[18px] font-bold text-[#2D3142] mb-6">{title}</h2>
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Bo'lim nomi</label>
            <input 
              {...register("name")}
              type="text"
              placeholder="Masalan: Yirik motorika" 
              className={`w-full h-[52px] bg-[#F8F9FB] border-none rounded-[14px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/20 transition-all placeholder:text-[#9EB1D4] ${errors.name ? 'ring-2 ring-red-500/20' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-[11px] ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Bo'lim foizi</label>
            <input 
              {...register("percentage", { valueAsNumber: true })}
              type="number"
              placeholder="Bo'lim foizini kiriting" 
              className={`w-full h-[52px] bg-[#F8F9FB] border-none rounded-[14px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/20 transition-all placeholder:text-[#9EB1D4] ${errors.percentage ? 'ring-2 ring-red-500/20' : ''}`}
            />
            {errors.percentage && <p className="text-red-500 text-[11px] ml-1">{errors.percentage.message}</p>}
          </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-[#2D3142]">Bola yoshi</label>
                <button 
                  type="button"
                  onClick={() => setIsAgeGroupModalOpen(true)}
                  className="text-[12px] font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Yangi qo'shish
                </button>
              </div>
              <Controller
                name="age_group_id"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={ageGroups?.map((group) => ({ label: group.name, value: group.id })) || []}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={isLoadingAgeGroups ? "Yuklanmoqda..." : "Bola yoshini tanlang"}
                    error={errors.age_group_id?.message}
                  />
                )}
              />
            </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Bo'lim tavsifi</label>
            <textarea 
              {...register("description")}
              placeholder="Ushbu bo'lim qanday rivojlanish ko'nikmalarini o'z ichiga oladi..." 
              className={`w-full min-h-[120px] bg-[#F8F9FB] border-none rounded-[14px] p-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/20 transition-all placeholder:text-[#9EB1D4] resize-y ${errors.description ? 'ring-2 ring-red-500/20' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-[11px] ml-1">{errors.description.message}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#4D89FF] hover:bg-blue-600 transition-colors text-white h-[52px] rounded-[14px] text-[15px] font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 bg-[#F8F9FB] hover:bg-gray-100 transition-colors text-[#2D3142] h-[52px] rounded-[14px] text-[15px] font-medium"
            >
              Bekor qilish
            </button>
          </div>
        </div>

        {/* Right Side: Icon & Color Pickers */}
        <div className="flex-1 w-full max-w-[480px]">
          
          <div className="mb-10">
            <h3 className="text-[13px] font-bold text-[#2D3142] mb-4">Ikonka tanlash</h3>
            <div className="flex flex-wrap gap-3">
              {icons.map((item) => {
                const isSelected = selectedIcon === item.id;
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setValue("icon", item.id)}
                    className={`w-[80px] h-[80px] rounded-[16px] flex flex-col items-center justify-center gap-2 transition-all ${
                      isSelected 
                        ? 'bg-[#F0F5FF] border-[1.5px] border-[#4D89FF] text-[#4D89FF]' 
                        : 'bg-[#F8F9FB] border-[1.5px] border-transparent text-[#9EB1D4] hover:bg-gray-100'
                    }`}
                  >
                    <IconComp className="w-6 h-6" />
                    <span className={`text-[11px] font-medium ${isSelected ? 'text-[#4D89FF]' : 'text-[#9EB1D4]'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.icon && <p className="text-red-500 text-[11px] mt-2">{errors.icon.message}</p>}
          </div>

          <div>
            <h3 className="text-[13px] font-bold text-[#2D3142] mb-4">Rang tanlash</h3>
            <div className="flex flex-wrap gap-4">
              {colors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue("color", color)}
                    style={{ backgroundColor: color }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                      isSelected ? 'ring-4 ring-white shadow-[0_0_0_2px_#E2E8F0]' : ''
                    }`}
                  >
                    {isSelected && <Check className="w-5 h-5 text-white" />}
                  </button>
                );
              })}
            </div>
            {errors.color && <p className="text-red-500 text-[11px] mt-2">{errors.color.message}</p>}
          </div>
        </div>
      </form>

      {/* Age Group Modal */}
      <Dialog open={isAgeGroupModalOpen} onOpenChange={setIsAgeGroupModalOpen}>
        <DialogContent className="rounded-[24px]">
          <DialogHeader>
            <DialogTitle>Yangi yosh toifasi qo'shish</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#2D3142]">Yosh toifasi nomi</label>
              <input 
                {...ageGroupForm.register("name")}
                type="text"
                placeholder="Masalan: 3-4 yosh" 
                className={`w-full h-[52px] bg-[#F8F9FB] border-none rounded-[14px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/20 transition-all placeholder:text-[#9EB1D4] ${ageGroupForm.formState.errors.name ? 'ring-2 ring-red-500/20' : ''}`}
              />
              {ageGroupForm.formState.errors.name && <p className="text-red-500 text-[11px] ml-1">{ageGroupForm.formState.errors.name.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsAgeGroupModalOpen(false)}
              className="px-6 py-2.5 rounded-[12px] text-[14px] font-medium text-[#2D3142] hover:bg-gray-100 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={ageGroupForm.handleSubmit(onAddAgeGroup)}
              disabled={isCreatingAgeGroup}
              className="bg-[#4D89FF] hover:bg-blue-600 transition-colors text-white px-6 py-2.5 rounded-[12px] text-[14px] font-medium disabled:opacity-70"
            >
              {isCreatingAgeGroup ? "Qo'shilmoqda..." : "Qo'shish"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
