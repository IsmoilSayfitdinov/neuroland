import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationsAPI } from "@/api/notifications.api";
import { toast } from "sonner";

const TYPE_STYLE: Record<string, { color: string; accent: string }> = {
  task_rejected: { color: "bg-red-50", accent: "bg-red-500" },
  task_assigned: { color: "bg-blue-50", accent: "bg-blue-500" },
  payment_due: { color: "bg-amber-50", accent: "bg-amber-500" },
  exam_coming: { color: "bg-purple-50", accent: "bg-purple-500" },
  session_reminder: { color: "bg-cyan-50", accent: "bg-cyan-500" },
  meeting_scheduled: { color: "bg-green-50", accent: "bg-green-500" },
};

const defaultStyle = { color: "bg-slate-50", accent: "bg-slate-400" };

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} daqiqa oldin`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} soat oldin`;
  return `${Math.floor(hrs / 24)} kun oldin`;
}

export default function AttentionNeeded() {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => NotificationsAPI.listNotifications(),
  });

  const { mutate: markRead } = useMutation({
    mutationFn: (id: number) => NotificationsAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { mutate: markAllRead } = useMutation({
    mutationFn: () => NotificationsAPI.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Barcha bildirishnomalar o'qilgan deb belgilandi");
    },
  });

  // Show only unread or latest 5
  const unread = notifications?.filter((n) => !n.is_read) ?? [];
  const display = unread.length > 0 ? unread.slice(0, 5) : (notifications?.slice(0, 3) ?? []);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-slate-800">E'tibor talab qiladi</CardTitle>
        {unread.length > 0 && (
          <button
            onClick={() => markAllRead()}
            className="text-[11px] text-blue-600 font-bold hover:underline"
          >
            Barchasini o'qish
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : display.length === 0 ? (
          <div className="text-center py-12 text-[13px] text-slate-400">
            Bildirishnomalar mavjud emas
          </div>
        ) : (
          display.map((notif) => {
            const style = TYPE_STYLE[notif.type] ?? defaultStyle;
            return (
              <div key={notif.id} className={`${style.color} rounded-2xl p-4 flex items-center justify-between border border-transparent`}>
                <div className="flex gap-4">
                  <div className={`w-1 h-12 ${style.accent} rounded-full`} />
                  <div>
                    <div className="text-sm font-bold text-slate-800">{notif.title}</div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed max-w-[200px]">{notif.body}</div>
                    <div className="text-[10px] text-slate-400 mt-2">{timeAgo(notif.created_at)}</div>
                  </div>
                </div>
                {!notif.is_read && (
                  <Button
                    variant="ghost"
                    onClick={() => markRead(notif.id)}
                    className="bg-white hover:bg-white/80 rounded-xl text-xs font-bold text-slate-800 shadow-sm px-4 h-9"
                  >
                    Ko'rib chiqish
                  </Button>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
