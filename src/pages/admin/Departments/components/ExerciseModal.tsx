import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseSchema, type ExerciseSchema } from "@/schemas/skills";
import { CustomSelect } from "@/components/ui/custom-select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { useEffect } from "react";
import type { ExerciseOut } from "@/types/skills.types";

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExerciseSchema) => void;
  initialData?: ExerciseOut | null;
  isLoading: boolean;
  sectionId: number;
}

export function ExerciseModal({ isOpen, onClose, onSubmit, initialData, isLoading, sectionId }: ExerciseModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ExerciseSchema>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      section_id: sectionId,
      status: 'active',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        video_url: initialData.video_url || "",
        status: (initialData.status === 'Faol' || initialData.status === 'active') ? 'active' : 'draft',
        section_id: sectionId,
      });
    } else {
      reset({
        name: "",
        video_url: "",
        status: 'active',
        section_id: sectionId,
      });
    }
  }, [initialData, reset, sectionId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[24px] sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Mashqni tahrirlash" : "Yangi mashq qo'shish"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Mashq nomi</label>
            <input 
              {...register("name")}
              type="text"
              placeholder="Masalan: Koptokni uloqtirish" 
              className={`w-full h-[52px] bg-[#F8F9FB] border-none rounded-[14px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/20 transition-all placeholder:text-[#9EB1D4] ${errors.name ? 'ring-2 ring-red-500/20' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-[11px] ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Video URL (ixtiyoriy)</label>
            <input 
              {...register("video_url")}
              type="text"
              placeholder="https://youtube.com/..." 
              className={`w-full h-[52px] bg-[#F8F9FB] border-none rounded-[14px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/20 transition-all placeholder:text-[#9EB1D4] ${errors.video_url ? 'ring-2 ring-red-500/20' : ''}`}
            />
            {errors.video_url && <p className="text-red-500 text-[11px] ml-1">{errors.video_url.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={[
                    { label: "Faol", value: "active" },
                    { label: "Draft", value: "draft" }
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <DialogFooter className="pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-[12px] text-[14px] font-medium text-[#2D3142] hover:bg-gray-100 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#4D89FF] hover:bg-blue-600 transition-colors text-white px-6 py-2.5 rounded-[12px] text-[14px] font-medium disabled:opacity-70"
            >
              {isLoading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
