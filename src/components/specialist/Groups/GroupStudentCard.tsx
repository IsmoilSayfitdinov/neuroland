import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { DiagnosticsAPI } from "@/api/diagnostics.api";
import type { ChildOut } from "@/types/children.types";
import { Activity, User } from "lucide-react";

interface Props {
  child: ChildOut;
}

export default function GroupStudentCard({ child }: Props) {
  const { fio: name, diagnosis, subscription } = child;
  const isPaid = !!subscription && parseFloat(subscription.balance) >= 0;
  const statusLabel = diagnosis || "Belgilanmagan";

  const { data: diagnosticResults } = useQuery({
    queryKey: ["diagnostics", "results", child.id],
    queryFn: () => DiagnosticsAPI.getResults({ child_id: child.id }),
  });

  const progress = (() => {
    if (!diagnosticResults?.length) return 0;
    const allAnswers = diagnosticResults.flatMap((r) => r.answers ?? []);
    if (!allAnswers.length) return 0;
    const avg = allAnswers.reduce((s, a) => s + Number(a.score), 0) / allAnswers.length;
    return Math.round(avg * 100);
  })();

  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        {child.photo ? (
          <img src={import.meta.env.VITE_API_MEDIA_URL + child.photo} alt={name} className="w-11 h-11 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="w-11 h-11 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#2D3142] text-[13px] truncate">{name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-[#9EB1D4] font-bold shrink-0">{progress}%</span>
            <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2ECC71] rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full",
          diagnosis ? "text-blue-600 bg-blue-50" : "text-[#9EB1D4] bg-gray-50"
        )}>
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

      <div className="flex gap-2">
        <Link
          to="/specialist/diagnostics/$childId"
          params={{ childId: child.id.toString() }}
          className="flex-1 h-9 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-bold transition-colors"
        >
          <Activity className="w-3.5 h-3.5" />
          Diagnostika
        </Link>
        <Link
          to="/specialist/patients/$patientId"
          params={{ patientId: child.id.toString() }}
          className="flex-1 h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-bold transition-colors"
        >
          <User className="w-3.5 h-3.5" />
          Ko'rish
        </Link>
      </div>
    </div>
  );
}
