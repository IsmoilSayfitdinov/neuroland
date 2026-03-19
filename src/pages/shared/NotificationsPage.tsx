import { useState } from "react";
import {
  Bell, CheckCheck, Clock,
  ClipboardList, CheckCircle2, XCircle, CreditCard,
  Calendar, Award, BookOpen, Users, AlignLeft, RefreshCw,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import type { Notification, NotificationTypeEnum } from "@/types/notifications.types";

/* ─── icon & color per type ─── */
const TYPE_CONFIG: Record<NotificationTypeEnum, { icon: any; color: string; bg: string }> = {
  task_assigned:     { icon: ClipboardList,  color: "text-blue-600",   bg: "bg-blue-50"   },
  task_approved:     { icon: CheckCircle2,   color: "text-green-600",  bg: "bg-green-50"  },
  task_rejected:     { icon: XCircle,        color: "text-red-500",    bg: "bg-red-50"    },
  payment_due:       { icon: CreditCard,     color: "text-amber-600",  bg: "bg-amber-50"  },
  meeting_scheduled: { icon: Calendar,       color: "text-purple-600", bg: "bg-purple-50" },
  badge_earned:      { icon: Award,          color: "text-yellow-600", bg: "bg-yellow-50" },
  session_reminder:  { icon: Clock,          color: "text-blue-500",   bg: "bg-blue-50"   },
  exam_coming:       { icon: BookOpen,       color: "text-indigo-600", bg: "bg-indigo-50" },
  monthly_training:  { icon: Users,          color: "text-teal-600",   bg: "bg-teal-50"   },
  topic_changed:     { icon: AlignLeft,      color: "text-slate-600",  bg: "bg-slate-50"  },
};

const DEFAULT_CONFIG = { icon: Bell, color: "text-gray-500", bg: "bg-gray-50" };

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Hozir";
  if (m < 60) return `${m} daqiqa oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} kun oldin`;
  return new Date(dateStr).toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" });
}

function NotifItem({ n, onRead }: { n: Notification; onRead: (id: number) => void }) {
  const cfg = TYPE_CONFIG[n.type] ?? DEFAULT_CONFIG;
  const Icon = cfg.icon;

  return (
    <div
      onClick={() => !n.is_read && onRead(n.id)}
      className={cn(
        "flex items-start gap-4 px-6 py-5 border-b border-gray-50 last:border-0 transition-colors cursor-pointer",
        n.is_read ? "hover:bg-gray-50/50" : "bg-[#F8FBFF] hover:bg-[#EEF4FF]/60"
      )}
    >
      {/* Icon */}
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
        <Icon className={cn("w-5 h-5", cfg.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className={cn("text-[14px]", n.is_read ? "font-medium text-[#5A6484]" : "font-bold text-[#2D3142]")}>
            {n.title}
          </p>
          {!n.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
        </div>
        <p className="text-[13px] text-[#9EB1D4] mt-1 leading-relaxed">{n.body}</p>
        <div className="flex items-center gap-1 mt-2 text-[11px] text-[#B0C0D8]">
          <Clock className="w-3 h-3" />
          {timeAgo(n.created_at)}
        </div>
      </div>
    </div>
  );
}

type Tab = "all" | "unread";

export default function NotificationsPage() {
  const { useNotificationsList, useMarkAsRead, useMarkAllAsRead, useUnreadCount } =
    useNotifications();

  const { data: notifications, isLoading, refetch } = useNotificationsList();
  const { data: countData } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAll = useMarkAllAsRead();

  const [tab, setTab] = useState<Tab>("all");

  const unread = countData?.unread_count ?? 0;
  const filtered =
    tab === "unread"
      ? (notifications ?? []).filter((n) => !n.is_read)
      : (notifications ?? []);

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#2D3142]">Bildirishnomalar</h1>
          {unread > 0 && (
            <span className="px-2.5 py-0.5 bg-red-50 text-red-500 text-[12px] font-bold rounded-full">
              {unread} yangi
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="w-9 h-9 flex items-center justify-center rounded-[10px] border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-[#9EB1D4]" />
          </button>
          {unread > 0 && (
            <button
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
              className="flex items-center gap-2 h-9 px-4 border border-gray-200 rounded-[10px] text-[13px] font-bold text-[#2D3142] hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <CheckCheck className="w-4 h-4 text-[#9EB1D4]" />
              Barchasini o'qi
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 p-1 rounded-xl w-fit">
        {([
          { key: "all", label: "Barchasi" },
          { key: "unread", label: `O'qilmagan${unread > 0 ? ` (${unread})` : ""}` },
        ] as { key: Tab; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-bold transition-all",
              tab === t.key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-[#9EB1D4] hover:text-slate-600"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Bell className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-[14px] text-[#9EB1D4] font-medium">
              {tab === "unread" ? "O'qilmagan bildirishnomalar yo'q" : "Bildirishnomalar yo'q"}
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((n) => (
              <NotifItem
                key={n.id}
                n={n}
                onRead={(id) => markAsRead.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
