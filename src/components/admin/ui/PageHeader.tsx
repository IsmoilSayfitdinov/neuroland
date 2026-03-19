import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  action?: ReactNode; // A button or a link
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-[28px] font-bold text-[#2D3142]">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
}
