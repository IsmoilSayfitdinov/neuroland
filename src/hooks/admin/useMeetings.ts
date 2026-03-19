import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MeetingsAPI } from "@/api/meetings.api";
import type { MothersEventRequest } from "@/types/meetings.types";
import { toast } from "sonner";

export const useMeetings = () => {
  const queryClient = useQueryClient();

  const useEventsList = () =>
    useQuery({
      queryKey: ["mothers-events"],
      queryFn: () => MeetingsAPI.listMothersEvents(),
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
    });

  return { useEventsList, useCreateEvent, useDeleteEvent, useMarkComplete };
};
