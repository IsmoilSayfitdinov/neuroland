import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DiagnosticsAPI } from "@/api/diagnostics.api";
import type { DiagnosticResultRequest } from "@/types/diagnostics.types";

export const useDiagnostics = () => {
  const queryClient = useQueryClient();

  // Questions (Grouped Exercises)
  const useQuestions = () => {
    return useQuery({
      queryKey: ["diagnostics", "questions"],
      queryFn: DiagnosticsAPI.getQuestions,
    });
  };

  // Results List
  const useResultsList = () => {
    return useQuery({
      queryKey: ["diagnostics", "results"],
      queryFn: () => DiagnosticsAPI.getResults(),
    });
  };

  // Result Detail
  const useResultDetail = (id: number) => {
    return useQuery({
      queryKey: ["diagnostics", "result", id],
      queryFn: () => DiagnosticsAPI.getResultById(id),
      enabled: !!id,
    });
  };

  // Create Result
  const useCreateResult = () => {
      return useMutation({
          mutationFn: (data: DiagnosticResultRequest) => DiagnosticsAPI.createResult(data),
          onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["diagnostics", "results"] });
          }
      });
  };

  // Delete Result
  const useDeleteResult = () => {
      return useMutation({
          mutationFn: (id: number) => DiagnosticsAPI.deleteResult(id),
          onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["diagnostics", "results"] });
          }
      });
  };

  return {
    useQuestions,
    useResultsList,
    useResultDetail,
    useCreateResult,
    useDeleteResult,
  };
};
