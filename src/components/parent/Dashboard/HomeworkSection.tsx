import { Link } from "@tanstack/react-router";
import {
  BookOpen, CheckCircle2, Clock, Eye, AlertCircle, Circle, ArrowRight,
} from "lucide-react";
import { useHomeTasks } from "@/hooks/parent/useHomeTasks";

const STATUS_CONFIG = {
  approved: {
    label: "Tasdiqlangan",
    badge: "bg-emerald-50 text-emerald-600",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    row: "border-emerald-50",
  },
  submitted: {
    label: "Tekshiruvda",
    badge: "bg-blue-50 text-blue-600",
    icon: <Eye className="w-4 h-4 text-blue-400 shrink-0" />,
    row: "border-blue-50",
  },
  rejected: {
    label: "Rad etilgan",
    badge: "bg-red-50 text-red-500",
    icon: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
    row: "border-red-50",
  },
  pending: {
    label: "Kutilmoqda",
    badge: "bg-gray-100 text-[#9EB1D4]",
    icon: <Circle className="w-4 h-4 text-gray-300 shrink-0" />,
    row: "border-gray-50",
  },
} as const;

const STATUS_ORDER = { rejected: 0, pending: 1, submitted: 2, approved: 3 };

export default function HomeworkSection() {
  const { data: homeTasks, isLoading } = useHomeTasks();

  // Sort: rejected & pending first, then submitted, then approved. Max 5.
  const sorted = [...(homeTasks ?? [])].sort(
    (a, b) => STATUS_ORDER[a.status as keyof typeof STATUS_ORDER] - STATUS_ORDER[b.status as keyof typeof STATUS_ORDER]
  );
  const visible = sorted.slice(0, 5);
  const pendingCount = homeTasks?.filter((t) => t.status === "pending" || t.status === "rejected").length ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-amber-50 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h2 className="font-bold text-[#222939] text-[16px] leading-tight">Uy ishlari</h2>
            {pendingCount > 0 && (
              <p className="text-[11px] text-amber-500 font-semibold">{pendingCount} ta bajarilmagan</p>
            )}
          </div>
        </div>
        <Link
          to="/parent/tasks"
          className="flex items-center gap-1 text-[12px] font-bold text-[#4D89FF] bg-[#EEF4FF] px-3 py-1.5 rounded-xl hover:bg-[#dce9ff] transition-colors"
        >
          Hammasi
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[60px] bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-gray-100">
          <BookOpen className="w-7 h-7 text-gray-200 mx-auto mb-2" />
          <p className="text-[13px] text-[#9EB1D4] font-medium">Uy ishlari mavjud emas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((task) => {
            const cfg = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
            const itemCount = task.items?.length ?? 0;
            const title = task.items?.[0]?.title ?? task.specialist_name ?? "Uy ishi";

            return (
              <Link
                key={task.id}
                to="/parent/tasks"
                className={`flex items-center gap-3 px-4 py-3 bg-white rounded-[16px] border shadow-sm hover:shadow-md transition-all ${cfg.row}`}
              >
                {cfg.icon}

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#1E293B] truncate leading-tight">{title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {task.specialist_name && (
                      <span className="text-[11px] text-[#9EB1D4] truncate">{task.specialist_name}</span>
                    )}
                    {itemCount > 1 && (
                      <span className="text-[10px] font-bold bg-gray-100 text-[#9EB1D4] px-1.5 py-0.5 rounded-md shrink-0">
                        +{itemCount - 1} ta
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[#C8D5E8]">
                    <Clock className="w-3 h-3" />
                    {task.due_date}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Show more indicator */}
          {(homeTasks?.length ?? 0) > 5 && (
            <Link
              to="/parent/tasks"
              className="flex items-center justify-center gap-2 py-2.5 text-[12px] font-bold text-[#9EB1D4] hover:text-[#4D89FF] transition-colors"
            >
              Yana {(homeTasks?.length ?? 0) - 5} ta ko'rish
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
