import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";
import type { SessionRequest, PatchedSessionRequest } from "@/types/session.types";
import { toast } from "sonner";

export const useSessions = () => {
  const queryClient = useQueryClient();

  const useSessionsList = (page?: number) =>
    useQuery({
      queryKey: ["sessions", page],
      queryFn: () => SessionsAPI.list(page),
    });

  const useSessionDetail = (id: number) =>
    useQuery({
      queryKey: ["sessions", id],
      queryFn: () => SessionsAPI.getById(id),
      enabled: !!id,
    });

  const useCreateSession = () =>
    useMutation({
      mutationFn: (data: SessionRequest) => SessionsAPI.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
        toast.success("Mashg'ulot yaratildi");
      },
      onError: () => toast.error("Mashg'ulot yaratishda xatolik"),
    });

  const useUpdateSession = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: SessionRequest }) =>
        SessionsAPI.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
        toast.success("Mashg'ulot yangilandi");
      },
      onError: () => toast.error("Mashg'ulot yangilashda xatolik"),
    });

  const usePatchSession = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: PatchedSessionRequest }) =>
        SessionsAPI.patch(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
      },
    });

  const useDeleteSession = () =>
    useMutation({
      mutationFn: (id: number) => SessionsAPI.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
        toast.success("Mashg'ulot o'chirildi");
      },
      onError: () => toast.error("Mashg'ulot o'chirishda xatolik"),
    });

  return {
    useSessionsList,
    useSessionDetail,
    useCreateSession,
    useUpdateSession,
    usePatchSession,
    useDeleteSession,
  };
};
