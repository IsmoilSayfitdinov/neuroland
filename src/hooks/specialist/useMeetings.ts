import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MeetingsAPI } from "@/api/meetings.api";
import type { MonthlyMeetingRequest } from "@/types/meetings.types";
import { toast } from "sonner";

export const useMeetings = () => {
  const queryClient = useQueryClient();

  const useMeetingsList = () =>
    useQuery({
      queryKey: ["meetings"],
      queryFn: () => MeetingsAPI.listMonthlyMeetings(),
    });

  const useChildMeetings = (childId: number) =>
    useQuery({
      queryKey: ["meetings", "child", childId],
      queryFn: async () => {
        const all = await MeetingsAPI.listMonthlyMeetings();
        return all.filter((m) => m.child === childId);
      },
      enabled: !!childId,
    });

  const useCreateMeeting = () =>
    useMutation({
      mutationFn: (data: MonthlyMeetingRequest) => MeetingsAPI.createMonthlyMeeting(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
        toast.success("Uchrashuv muvaffaqiyatli yaratildi");
      },
      onError: () => toast.error("Uchrashuv yaratishda xatolik"),
    });

  const useCompleteMeeting = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: MonthlyMeetingRequest }) =>
        MeetingsAPI.updateMonthlyMeeting(id, { ...data, is_completed: true }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
        toast.success("Uchrashuv yakunlandi");
      },
    });

  return { useMeetingsList, useChildMeetings, useCreateMeeting, useCompleteMeeting };
};
