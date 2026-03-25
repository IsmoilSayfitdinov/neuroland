import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function InfoModal({ isOpen, onClose, title, children }: InfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[24px] sm:max-w-[520px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="p-6 pt-8">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-6 h-6" />
          </div>

          <DialogHeader className="p-0">
            <DialogTitle className="text-[20px] font-bold text-[#2D3142] text-center mb-3 leading-tight">
              {title}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-[14px] text-[#6B7A99] leading-relaxed space-y-3">
                {children}
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="bg-[#F8F9FB] p-4 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="h-[44px] px-8 rounded-[14px] text-[14px] font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors"
          >
            Tushunarli
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
