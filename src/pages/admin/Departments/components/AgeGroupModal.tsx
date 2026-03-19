import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ageGroupSchema, type AgeGroupSchema } from "@/schemas/skills";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { useEffect } from "react";
import type { AgeGroupOut } from "@/types/skills.types";

interface AgeGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AgeGroupSchema) => void;
  initialData?: AgeGroupOut | null;
  isLoading: boolean;
}


export function AgeGroupModal({ isOpen, onClose, onSubmit, initialData, isLoading }: AgeGroupModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AgeGroupSchema>({
    resolver: zodResolver(ageGroupSchema),
    defaultValues: {
      name: "",
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
      });
    } else {
      reset({
        name: "",
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[24px] sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Yosh toifasini tahrirlash" : "Yangi yosh toifasi qo'shish"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Yosh toifasi nomi</label>
            <input 
              {...register("name")}
              type="text"
              placeholder="Masalan: 3-4 yosh" 
              className={`w-full h-[52px] bg-[#F8F9FB] border-none rounded-[14px] px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/20 transition-all placeholder:text-[#9EB1D4] ${errors.name ? 'ring-2 ring-red-500/20' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-[11px] ml-1">{errors.name.message}</p>}
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
