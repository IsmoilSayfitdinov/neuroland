import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MeetingsAPI } from "@/api/meetings.api";
import type { MothersEventRequest, PatchedMothersEventRequest } from "@/types/meetings.types";
import { toast } from "sonner";

export const useMeetings = () => {
  const queryClient = useQueryClient();

  const useEventsList = () =>
    useQuery({
      queryKey: ["mothers-events"],
      queryFn: () => MeetingsAPI.listMothersEvents(),
    });

  const useEventDetail = (id: number) =>
    useQuery({
      queryKey: ["mothers-events", id],
      queryFn: () => MeetingsAPI.getMothersEvent(id),
      enabled: !!id,
    });

  const useCreateEvent = () =>
    useMutation({
      mutationFn: (data: MothersEventRequest) => MeetingsAPI.createMothersEvent(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["mothers-events"] });
        toast.success("Tadbir muvaffaqiyatli qo'shildi");
      },
      onError: () => toast.error("Tadbir qo'shishda xatolik"),
    });

  const useUpdateEvent = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: MothersEventRequest }) =>
        MeetingsAPI.updateMothersEvent(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["mothers-events"] });
        toast.success("Tadbir yangilandi");
      },
      onError: () => toast.error("Yangilashda xatolik"),
    });

  const usePatchEvent = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: PatchedMothersEventRequest }) =>
        MeetingsAPI.patchMothersEvent(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["mothers-events"] });
        toast.success("Tadbir yangilandi");
      },
      onError: () => toast.error("Yangilashda xatolik"),
    });

  const useDeleteEvent = () =>
    useMutation({
      mutationFn: (id: number) => MeetingsAPI.deleteMothersEvent(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["mothers-events"] });
        toast.success("Tadbir o'chirildi");
      },
      onError: () => toast.error("Tadbir o'chirishda xatolik"),
    });

  const useMarkComplete = () =>
    useMutation({
      mutationFn: (id: number) => MeetingsAPI.markMothersEventComplete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["mothers-events"] });
        toast.success("Tadbir tugallandi");
      },
      onError: () => toast.error("Xatolik yuz berdi"),
    });

  return {
    useEventsList,
    useEventDetail,
    useCreateEvent,
    useUpdateEvent,
    usePatchEvent,
    useDeleteEvent,
    useMarkComplete,
  };
};
