import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationsAPI } from "@/api/notifications.api";
import { useNotificationWebSocket } from "./useNotificationWebSocket";
import type { Notification } from "@/types/notifications.types";

export const useNotifications = () => {
  const { markRead, markAllRead } = useNotificationWebSocket();

  const queryClient = useQueryClient();

  const useNotificationsList = () =>
    useQuery({
      queryKey: ["notifications"],
      queryFn: () => NotificationsAPI.listNotifications(),
      staleTime: 30_000,
    });

  const useUnreadCount = () =>
    useQuery({
      queryKey: ["notifications", "unread-count"],
      queryFn: () => NotificationsAPI.getUnreadCount(),
      staleTime: 30_000,
    });

  const useMarkAsRead = () =>
    useMutation({
      mutationFn: (id: number) => NotificationsAPI.markAsRead(id),
      onSuccess: (_, id) => {
        markRead(id);
        queryClient.setQueryData<Notification[]>(["notifications"], (old = []) =>
          old.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        queryClient.setQueryData<{ unread_count: number }>(
          ["notifications", "unread-count"],
          (old) => ({ unread_count: Math.max(0, (old?.unread_count ?? 0) - 1) })
        );
      },
    });

  const useMarkAllAsRead = () =>
    useMutation({
      mutationFn: () => NotificationsAPI.markAllAsRead(),
      onSuccess: () => {
        markAllRead();
        queryClient.setQueryData<Notification[]>(["notifications"], (old = []) =>
          old.map((n) => ({ ...n, is_read: true }))
        );
        queryClient.setQueryData<{ unread_count: number }>(
          ["notifications", "unread-count"],
          () => ({ unread_count: 0 })
        );
      },
    });

  return { useNotificationsList, useUnreadCount, useMarkAsRead, useMarkAllAsRead };
};
