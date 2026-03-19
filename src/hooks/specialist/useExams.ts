import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExamsAPI } from "@/api/exams.api";
import type { ExamResultRequest, ExamType } from "@/types/exam.types";

export const useExams = () => {
  const queryClient = useQueryClient();

  const useResultsList = (params?: { child_id?: number; exam_type?: ExamType }) => {
    return useQuery({
      queryKey: ["exams", "results", params],
      queryFn: () => ExamsAPI.listResults(params),
    });
  };

  const useResultDetail = (id: number) => {
    return useQuery({
      queryKey: ["exams", "result", id],
      queryFn: () => ExamsAPI.getResultById(id),
      enabled: !!id,
    });
  };

  const useCreateResult = () => {
    return useMutation({
      mutationFn: (data: ExamResultRequest) => ExamsAPI.createResult(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["exams", "results"] });
      },
    });
  };

  const useGenerateComparison = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: { child: number; exam_type: ExamType } }) =>
        ExamsAPI.generateComparison(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["exams", "result", variables.id] });
      },
    });
  };

  const useSchedules = () => {
    return useQuery({
      queryKey: ["exams", "schedules"],
      queryFn: () => ExamsAPI.listSchedules(),
    });
  };

  const useScheduleByChild = (childId: number) => {
    return useQuery({
      queryKey: ["exams", "schedule", childId],
      queryFn: () => ExamsAPI.getScheduleById(childId),
      enabled: !!childId,
    });
  };

  return {
    useResultsList,
    useResultDetail,
    useCreateResult,
    useGenerateComparison,
    useSchedules,
    useScheduleByChild,
  };
};
