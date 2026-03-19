import { useRef, useState, useEffect } from "react";
import { Bell, CheckCheck, Clock } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notifications.types";

interface NotificationBellProps {
  basePath: "admin" | "specialist" | "parent";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Hozir";
  if (m < 60) return `${m} daqiqa oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  return `${Math.floor(h / 24)} kun oldin`;
}

export function NotificationBell({ basePath }: NotificationBellProps) {
  const navigate = useNavigate();
  const { useUnreadCount, useNotificationsList, useMarkAsRead, useMarkAllAsRead } =
    useNotifications();

  const { data: countData } = useUnreadCount();
  const { data: notifications } = useNotificationsList();
  const markAsRead = useMarkAsRead();
  const markAll = useMarkAllAsRead();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = countData?.unread_count ?? 0;
  const recent = notifications?.slice(0, 5) ?? [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (n: Notification) => {
    if (!n.is_read) markAsRead.mutate(n.id);
    setOpen(false);
    navigate({ to: `/${basePath}/notifications` });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 text-[#2D3142] hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold border-2 border-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#2D3142]">Bildirishnomalar</span>
              {unread > 0 && (
                <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[11px] font-bold rounded-full">
                  {unread} yangi
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={() => markAll.mutate()}
                className="flex items-center gap-1 text-[12px] font-semibold text-blue-500 hover:text-blue-700 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Barchasini o'qi
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto">
            {recent.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-[13px] text-[#9EB1D4]">Bildirishnomalar yo'q</p>
              </div>
            ) : (
              recent.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={cn(
                    "w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0",
                    !n.is_read && "bg-[#F8FBFF]"
                  )}
                >
                  {!n.is_read && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                  {n.is_read && <span className="mt-1.5 w-2 h-2 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#2D3142] truncate">{n.title}</p>
                    <p className="text-[12px] text-[#9EB1D4] mt-0.5 line-clamp-2">{n.body}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-[11px] text-[#B0C0D8]">
                      <Clock className="w-3 h-3" />
                      {timeAgo(n.created_at)}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-50 px-5 py-3">
            <button
              onClick={() => { setOpen(false); navigate({ to: `/${basePath}/notifications` }); }}
              className="w-full text-center text-[13px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Barchasini ko'rish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
