import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import type { Notification } from "@/types/notifications.types";

const WS_BASE = (import.meta.env.VITE_API_BASE_URL as string)
  ?.replace(/^https/, "wss")
  ?.replace(/^http/, "ws");

export function useNotificationWebSocket() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aliveRef = useRef(true);

  const connect = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token || !aliveRef.current) return;

    const ws = new WebSocket(`${WS_BASE}/ws/notifications/?token=${token}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);

        switch (data.type) {
          case "new_notification": {
            const incoming: Notification = data.notification;
            queryClient.setQueryData<Notification[]>(["notifications"], (old = []) => [
              incoming,
              ...old.filter((n) => n.id !== incoming.id),
            ]);
            queryClient.setQueryData<{ unread_count: number }>(
              ["notifications", "unread-count"],
              (old) => ({ unread_count: (old?.unread_count ?? 0) + 1 })
            );
            break;
          }
          case "unread_count": {
            queryClient.setQueryData<{ unread_count: number }>(
              ["notifications", "unread-count"],
              () => ({ unread_count: data.count })
            );
            break;
          }
        }
      } catch {
        // ignore malformed frames
      }
    };

    ws.onclose = (event) => {
      if (!aliveRef.current) return;
      if (event.code === 4001) {
        // Token expired — refresh and reconnect
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          api
            .post("/v1/auth/refresh/", { refresh_token: refreshToken })
            .then((res) => {
              localStorage.setItem("token", res.data.access_token);
              if (res.data.refresh_token) {
                localStorage.setItem("refresh_token", res.data.refresh_token);
              }
              connect();
            })
            .catch(() => {
              retryRef.current = setTimeout(connect, 5000);
            });
          return;
        }
      }
      retryRef.current = setTimeout(connect, 5000);
    };

    ws.onerror = () => {
      ws.close();
    };
   
  }, [queryClient]);

  useEffect(() => {
    aliveRef.current = true;
    connect();
    return () => {
      aliveRef.current = false;
      if (retryRef.current) clearTimeout(retryRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const markRead = useCallback((id: number) => {
    wsRef.current?.readyState === WebSocket.OPEN &&
      wsRef.current.send(JSON.stringify({ action: "mark_read", id }));
  }, []);

  const markAllRead = useCallback(() => {
    wsRef.current?.readyState === WebSocket.OPEN &&
      wsRef.current.send(JSON.stringify({ action: "mark_all_read" }));
  }, []);

  return { markRead, markAllRead };
}
