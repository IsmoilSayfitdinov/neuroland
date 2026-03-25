import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DiagnosticsAPI } from "@/api/diagnostics.api";
import type { DiagnosticResultRequest } from "@/types/diagnostics.types";

export const useDiagnostics = () => {
  const queryClient = useQueryClient();

  // Questions (Grouped Exercises)
  const useQuestions = () => {
    return useQuery({
      queryKey: ["diagnostics", "questions"],
      queryFn: () => DiagnosticsAPI.getQuestions(),
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

  // Update Result (PUT)
  const useUpdateResult = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: DiagnosticResultRequest }) =>
        DiagnosticsAPI.updateResult(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["diagnostics"] });
        queryClient.invalidateQueries({ queryKey: ["diagnostics-results"] });
      },
    });
  };

  // Patch Result (PATCH)
  const usePatchResult = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<DiagnosticResultRequest> }) =>
        DiagnosticsAPI.patchResult(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["diagnostics"] });
        queryClient.invalidateQueries({ queryKey: ["diagnostics-results"] });
      },
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

  // Results by child
  const useResultsByChild = (childId: number) => {
    return useQuery({
      queryKey: ["diagnostics", "results", childId],
      queryFn: () => DiagnosticsAPI.getResults({ child_id: childId }),
      enabled: !!childId,
    });
  };

  // Generate AI analysis
  const useGenerateAI = () => {
    return useMutation({
      mutationFn: (childId: number) => DiagnosticsAPI.generateAI(childId),
      onSuccess: (_, childId) => {
        queryClient.invalidateQueries({ queryKey: ["diagnostics", "results", childId] });
        queryClient.invalidateQueries({ queryKey: ["diagnostics", "results"] });
        queryClient.invalidateQueries({ queryKey: ["doctor-patient-diagnostics", childId] });
      },
    });
  };

  return {
    useQuestions,
    useResultsList,
    useResultDetail,
    useCreateResult,
    useUpdateResult,
    usePatchResult,
    useDeleteResult,
    useResultsByChild,
    useGenerateAI,
  };
};
