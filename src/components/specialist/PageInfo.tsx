import { useState, type ReactNode } from "react";
import { Info } from "lucide-react";
import { InfoModal } from "@/components/admin/ui/InfoModal";

interface PageInfoProps {
  title: string;
  children: ReactNode;
}

export function PageInfoButton({ title, children }: PageInfoProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors shrink-0"
      >
        <Info className="w-4 h-4 text-blue-500" />
      </button>
      <InfoModal isOpen={open} onClose={() => setOpen(false)} title={title}>
        {children}
      </InfoModal>
    </>
  );
}
