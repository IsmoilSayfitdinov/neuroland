import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "O'chirish", 
  cancelText = "Bekor qilish",
  isLoading = false,
  variant = "danger"
}: ConfirmModalProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: "bg-red-50",
          iconColor: "text-red-600",
          confirmBtn: "bg-red-600 hover:bg-red-700 text-white"
        };
      case "warning":
        return {
          iconBg: "bg-amber-50",
          iconColor: "text-amber-600",
          confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white"
        };
      default:
        return {
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
          confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[24px] sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="p-6 pt-8 text-center">
          <div className={`w-14 h-14 ${styles.iconBg} ${styles.iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          
          <DialogHeader className="p-0">
            <DialogTitle className="text-[20px] font-bold text-[#2D3142] text-center mb-2 leading-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-[14px] text-[#6B7A99] text-center leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="bg-[#F8F9FB] p-4 flex flex-row items-center gap-3 sm:justify-center">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[48px] rounded-[14px] text-[14px] font-bold text-[#6B7A99] hover:bg-gray-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`flex-1 h-[48px] rounded-[14px] text-[14px] font-bold transition-all disabled:opacity-70 ${styles.confirmBtn}`}
          >
            {isLoading ? "Bajarilmoqda..." : confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
