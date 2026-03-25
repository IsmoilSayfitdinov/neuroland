import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MeetingsAPI } from "@/api/meetings.api";
import type { MonthlyMeetingRequest, PatchedMonthlyMeetingRequest } from "@/types/meetings.types";
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

  const useMeetingDetail = (id: number) =>
    useQuery({
      queryKey: ["meetings", id],
      queryFn: () => MeetingsAPI.getMonthlyMeeting(id),
      enabled: !!id,
    });

  const useCreateMeeting = () =>
    useMutation({
      mutationFn: (data: MonthlyMeetingRequest) => MeetingsAPI.createMonthlyMeeting(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
        toast.success("Uchrashuv muvaffaqiyatli yaratildi");
      },
      onError: (err: any) => toast.error(err?.response?.data?.detail || "Uchrashuv yaratishda xatolik"),
    });

  const useUpdateMeeting = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: PatchedMonthlyMeetingRequest }) =>
        MeetingsAPI.patchMonthlyMeeting(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
        toast.success("Uchrashuv yangilandi");
      },
      onError: (err: any) => toast.error(err?.response?.data?.detail || "Yangilashda xatolik"),
    });

  const useCompleteMeeting = () =>
    useMutation({
      mutationFn: ({ id }: { id: number }) =>
        MeetingsAPI.patchMonthlyMeeting(id, { is_completed: true }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
        toast.success("Uchrashuv yakunlandi");
      },
      onError: (err: any) => toast.error(err?.response?.data?.detail || "Yakunlashda xatolik"),
    });

  const useDeleteMeeting = () =>
    useMutation({
      mutationFn: (id: number) => MeetingsAPI.deleteMonthlyMeeting(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
        toast.success("Uchrashuv o'chirildi");
      },
      onError: (err: any) => toast.error(err?.response?.data?.detail || "O'chirishda xatolik"),
    });

  const useAddGoalReviews = () =>
    useMutation({
      mutationFn: ({ meetingId, reviews }: { meetingId: number; reviews: { monthly_goal_item: number; comment: string }[] }) =>
        MeetingsAPI.addGoalReviews(meetingId, reviews),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["meetings"] });
        toast.success("Maqsad sharhlari saqlandi");
      },
      onError: (err: any) => toast.error(err?.response?.data?.detail || "Xatolik yuz berdi"),
    });

  return {
    useMeetingsList,
    useChildMeetings,
    useMeetingDetail,
    useCreateMeeting,
    useUpdateMeeting,
    useCompleteMeeting,
    useDeleteMeeting,
    useAddGoalReviews,
  };
};
