import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsAPI } from "@/api/notifications.api";
import { toast } from "sonner";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const useNotificationsList = () =>
    useQuery({
      queryKey: ["notifications"],
      queryFn: () => NotificationsAPI.listNotifications(),
      refetchInterval: 30_000,
    });

  const useUnreadCount = () =>
    useQuery({
      queryKey: ["notifications", "unread-count"],
      queryFn: () => NotificationsAPI.getUnreadCount(),
      refetchInterval: 30_000,
    });

  const useMarkAsRead = () =>
    useMutation({
      mutationFn: (id: number) => NotificationsAPI.markAsRead(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      },
    });

  const useMarkAllAsRead = () =>
    useMutation({
      mutationFn: () => NotificationsAPI.markAllAsRead(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast.success("Barchasi o'qilgan deb belgilandi");
      },
    });

  return {
    useNotificationsList,
    useUnreadCount,
    useMarkAsRead,
    useMarkAllAsRead,
  };
};
