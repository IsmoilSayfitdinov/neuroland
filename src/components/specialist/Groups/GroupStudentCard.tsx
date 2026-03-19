import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DiagnosticsAPI } from "@/api/diagnostics.api";
import type { ChildOut } from "@/types/children.types";

interface Props {
  child: ChildOut;
  onAttendanceChange?: (childId: number, status: "present" | "absent" | "late") => void;
}

const ATTENDANCE_OPTIONS = [
  { label: "Keldi", value: "present" as const },
  { label: "Kelmadi", value: "absent" as const },
  { label: "Kechikdi", value: "late" as const },
];

export default function GroupStudentCard({ child, onAttendanceChange }: Props) {
  const { fio: name, diagnosis, subscription } = child;
  const isPaid = !!subscription && parseFloat(subscription.balance) >= 0;
  const statusLabel = diagnosis || "Barqaror";
  const [attendance, setAttendance] = useState<string | null>(null);

  // Fetch real progress from diagnostics
  const { data: diagnosticResults } = useQuery({
    queryKey: ["diagnostics", "results", child.id],
    queryFn: () => DiagnosticsAPI.getResults({ child_id: child.id }),
  });

  const progress = (() => {
    if (!diagnosticResults?.length) return 0;
    const latest = diagnosticResults[diagnosticResults.length - 1];
    if (!latest.answers?.length) return 0;
    const avg = latest.answers.reduce((s, a) => s + a.score, 0) / latest.answers.length;
    return Math.round(avg * 100);
  })();

  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleAttendance = (label: string, value: "present" | "absent" | "late") => {
    setAttendance(label);
    onAttendanceChange?.(child.id, value);
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Top: avatar + name + progress */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#2D3142] text-[13px] truncate">{name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-[#9EB1D4] font-bold shrink-0">{progress}%</span>
            <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2ECC71] rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#2ECC71]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] shrink-0" />
          {statusLabel}
        </span>
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full border",
            isPaid ? "text-[#2ECC71] bg-[#F4FDF9] border-emerald-100" : "text-red-400 bg-red-50 border-red-100"
          )}
        >
          {isPaid ? "To'langan" : "To'lanmagan"}
        </span>
      </div>

      {/* Attendance buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        {ATTENDANCE_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleAttendance(label, value)}
            className={cn(
              "h-8 rounded-xl text-[10px] font-bold border transition-all",
              attendance === label
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-gray-50 text-[#9EB1D4] border-transparent hover:bg-gray-100"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
