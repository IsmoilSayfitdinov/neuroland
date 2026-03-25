import { useState, useRef, useEffect } from "react";
import { useHomeTasks } from "@/hooks/parent/useHomeTasks";
import {
  BookOpen, CheckCircle2, Eye, AlertCircle, Circle,
  Clock, Upload, Loader2, X, PlayCircle, Search, Filter,
} from "lucide-react";
import { SessionsAPI } from "@/api/sessions.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Filter = "all" | "pending" | "submitted" | "approved" | "rejected";

const FILTERS: { key: Filter; label: string; color: string }[] = [
  { key: "all",       label: "Barchasi",     color: "" },
  { key: "pending",   label: "Bajarilmagan", color: "text-amber-600" },
  { key: "submitted", label: "Tekshiruvda",  color: "text-blue-600" },
  { key: "approved",  label: "Tasdiqlangan", color: "text-emerald-600" },
  { key: "rejected",  label: "Rad etilgan",  color: "text-red-500" },
];

const STATUS_CFG = {
  approved: {
    label: "Tasdiqlangan",
    badge: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-100",
    bg: "bg-emerald-50/40",
    icon: <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />,
    dot: "bg-emerald-500",
  },
  submitted: {
    label: "Tekshiruvda",
    badge: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
    bg: "bg-blue-50/30",
    icon: <Eye className="w-4.5 h-4.5 text-blue-400" />,
    dot: "bg-blue-500",
  },
  rejected: {
    label: "Rad etilgan",
    badge: "bg-red-50 text-red-500",
    border: "border-red-100",
    bg: "bg-red-50/30",
    icon: <AlertCircle className="w-4.5 h-4.5 text-red-400" />,
    dot: "bg-red-500",
  },
  pending: {
    label: "Kutilmoqda",
    badge: "bg-amber-50 text-amber-600",
    border: "border-gray-100",
    bg: "bg-white",
    icon: <Circle className="w-4.5 h-4.5 text-gray-300" />,
    dot: "bg-amber-400",
  },
} as const;

function HomeTaskCard({ task }: { task: any }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(task.status === "pending" || task.status === "rejected");

  useEffect(() => {
    if (task.status === "rejected") setExpanded(true);
  }, [task.status]);

  const cfg = STATUS_CFG[task.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.pending;

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsSubmitting(true);
    try {
      await SessionsAPI.submitHomeTask(task.id, selectedFile);
      toast.success("Vazifa muvaffaqiyatli yuborildi!");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["parent", "home-tasks"] });
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Yuborishda xatolik");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("rounded-[20px] border-2 shadow-sm overflow-hidden transition-all", cfg.border, cfg.bg)}>
      {/* Card header */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 mt-0.5", cfg.dot)} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-bold text-[#1E293B] truncate">
              {task.specialist_name || "Mutaxassis"}
            </span>
            <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0", cfg.badge)}>
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[11px] text-[#9EB1D4]">
              <Clock className="w-3 h-3" />
              Muddat: {task.due_date}
            </span>
            <span className="text-[11px] text-[#9EB1D4]">
              {task.items?.length ?? 0} ta topshiriq
            </span>
          </div>
        </div>

        <div className={cn(
          "w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0 transition-transform duration-200",
          expanded ? "rotate-180" : ""
        )}>
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-inherit px-5 pb-5 pt-4 space-y-4">
          {/* Items list */}
          <div className="space-y-2">
            {(task.items || []).map((item: any, idx: number) => (
              <div key={item.id} className="flex items-center gap-3 bg-white rounded-[14px] px-4 py-3 border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-[#9EB1D4]">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1E293B] truncate">{item.title}</p>
                  {item.xp_reward && (
                    <span className="text-[10px] text-amber-500 font-bold">+{item.xp_reward} XP</span>
                  )}
                </div>
                {item.video_url && (
                  <a
                    href={item.video_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 bg-blue-50 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition-colors shrink-0"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    Video
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Upload section */}
          {(task.status === "pending" || task.status === "rejected") && (
            <div className="bg-white rounded-[14px] border border-dashed border-gray-200 p-4">
              <p className="text-[12px] font-bold text-[#9EB1D4] mb-3">Isbot yuklash (video yoki rasm)</p>

              {selectedFile ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1 bg-blue-50 rounded-xl px-3 py-2">
                    <Upload className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="text-[12px] text-blue-600 font-medium truncate">{selectedFile.name}</span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="ml-auto text-blue-300 hover:text-blue-500 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-xl transition-colors disabled:opacity-60 shrink-0"
                  >
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Yuborish"}
                  </button>
                </div>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setSelectedFile(f);
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-[13px] font-bold text-[#6B7A99] transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Fayl tanlash
                  </button>
                </>
              )}
            </div>
          )}

          {/* Approved note */}
          {task.status === "approved" && (
            <div className="flex items-center gap-2 bg-emerald-50 rounded-[14px] px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <p className="text-[12px] font-bold text-emerald-600">Mutaxassis tomonidan tasdiqlangan</p>
            </div>
          )}

          {/* Submitted note */}
          {task.status === "submitted" && (
            <div className="flex items-center gap-2 bg-blue-50 rounded-[14px] px-4 py-3">
              <Eye className="w-4 h-4 text-blue-400 shrink-0" />
              <p className="text-[12px] font-bold text-blue-600">Mutaxassis tekshirib ko'rmoqda...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  const { data: homeTasks, isLoading } = useHomeTasks();
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const counts = {
    all:       homeTasks?.length ?? 0,
    pending:   homeTasks?.filter((t) => t.status === "pending").length ?? 0,
    submitted: homeTasks?.filter((t) => t.status === "submitted").length ?? 0,
    approved:  homeTasks?.filter((t) => t.status === "approved").length ?? 0,
    rejected:  homeTasks?.filter((t) => t.status === "rejected").length ?? 0,
  };

  const filtered = (homeTasks ?? [])
    .filter((t) => activeFilter === "all" || t.status === activeFilter)
    .filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.specialist_name?.toLowerCase().includes(q) ||
        t.items?.some((i: any) => i.title?.toLowerCase().includes(q))
      );
    })
    // Sort: rejected & pending first
    .sort((a, b) => {
      const order: Record<string, number> = { rejected: 0, pending: 1, submitted: 2, approved: 3 };
      return (order[a.status] ?? 9) - (order[b.status] ?? 9);
    });

  const completedPct = counts.all > 0
    ? Math.round((counts.approved / counts.all) * 100)
    : 0;

  return (
    <div className="mx-auto pb-10 space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#1E293B]">Uy ishlari</h1>
          <p className="text-[13px] text-[#9EB1D4] mt-0.5">
            Mutaxassis tomonidan berilgan vazifalar
          </p>
        </div>
        {counts.pending > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-2 rounded-2xl">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[13px] font-bold text-amber-600">{counts.pending} ta kutilmoqda</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Jami",          value: counts.all,       color: "text-[#2D3142]", bg: "bg-gray-50"    },
          { label: "Bajarilmagan",  value: counts.pending + counts.rejected,   color: "text-amber-600",   bg: "bg-amber-50"   },
          { label: "Tekshiruvda",   value: counts.submitted, color: "text-blue-600",  bg: "bg-blue-50"    },
          { label: "Tasdiqlangan",  value: counts.approved,  color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-[16px] px-4 py-3 border border-gray-100", s.bg)}>
            <p className={cn("text-[22px] font-bold", s.color)}>{s.value}</p>
            <p className="text-[11px] text-[#9EB1D4] font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {counts.all > 0 && (
        <div className="bg-white rounded-[16px] border border-gray-100 px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-bold text-[#1E293B]">Umumiy progress</span>
            <span className="text-[13px] font-bold text-[#3B82F6]">{completedPct}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${completedPct}%` }}
            />
          </div>
          <p className="text-[11px] text-[#9EB1D4] mt-2">
            {counts.approved} ta bajarildi · {counts.pending + counts.rejected} ta qoldi
          </p>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9EB1D4]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Vazifa yoki mutaxassis qidirish..."
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-[13px] text-[#1E293B] placeholder:text-[#C8D5E8] outline-none focus:border-blue-300 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter icon label */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#9EB1D4] font-medium">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              "flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-[12px] font-bold transition-all",
              activeFilter === f.key
                ? "bg-[#2563EB] text-white shadow-sm shadow-blue-200"
                : "bg-white border border-gray-200 text-[#6B7A99] hover:border-gray-300"
            )}
          >
            {f.label}
            {counts[f.key] > 0 && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                activeFilter === f.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-[#9EB1D4]"
              )}>
                {counts[f.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tasks list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[80px] bg-gray-100 rounded-[20px] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
          <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[15px] font-bold text-[#2D3142] mb-1">
            {search ? "Qidiruv bo'yicha topilmadi" : "Vazifalar mavjud emas"}
          </p>
          <p className="text-[13px] text-[#9EB1D4]">
            {search ? "Boshqa kalit so'z bilan qidiring" : "Mutaxassis sizga vazifa berganda bu yerda ko'rinadi"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <HomeTaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
