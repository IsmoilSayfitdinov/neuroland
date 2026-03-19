import { useForm } from "react-hook-form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { useEffect } from "react";
import type { SpecialistTypeOut, SpecialistTypeCreateRequest } from "@/types/specialists.types";

interface SpecialistTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SpecialistTypeCreateRequest) => void;
  initialData?: SpecialistTypeOut | null;
  isLoading: boolean;
}

export function SpecialistTypeModal({ isOpen, onClose, onSubmit, initialData, isLoading }: SpecialistTypeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpecialistTypeCreateRequest>({
    defaultValues: {
      title: "",
      task: "",
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        task: initialData.task,
      });
    } else {
      reset({
        title: "",
        task: "",
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[24px] sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Mutaxassis turini tahrirlash" : "Yangi mutaxassis turi"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Tur nomi</label>
            <input 
              {...register("title", { required: "Nomini kiriting" })}
              type="text"
              placeholder="Masalan: Logoped" 
              className={`w-full h-[52px] bg-[#F8F9FB] border-none rounded-[14px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/20 transition-all placeholder:text-[#9EB1D4] ${errors.title ? 'ring-2 ring-red-500/20' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-[11px] ml-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Vazifasi (tavsifi)</label>
            <textarea 
              {...register("task", { required: "Vazifasini kiriting" })}
              placeholder="Mutaxassis vazifasi haqida qisqacha..." 
              className={`w-full h-[120px] bg-[#F8F9FB] border-none rounded-[14px] p-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/20 transition-all placeholder:text-[#9EB1D4] resize-none ${errors.task ? 'ring-2 ring-red-500/20' : ''}`}
            />
            {errors.task && <p className="text-red-500 text-[11px] ml-1">{errors.task.message}</p>}
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
