import { useState, type ReactNode } from "react";
import { Info } from "lucide-react";
import { InfoModal } from "./InfoModal";

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
  infoTitle?: string;
  infoContent?: ReactNode;
}

export function PageHeader({ title, action, infoTitle, infoContent }: PageHeaderProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[28px] font-bold text-[#2D3142]">{title}</h1>
          {infoContent && (
            <button
              type="button"
              onClick={() => setShowInfo(true)}
              className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
            >
              <Info className="w-4 h-4 text-blue-500" />
            </button>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {infoContent && (
        <InfoModal
          isOpen={showInfo}
          onClose={() => setShowInfo(false)}
          title={infoTitle || title}
        >
          {infoContent}
        </InfoModal>
      )}
    </>
  );
}
