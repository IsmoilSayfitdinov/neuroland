import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TreatmentComplexesAPI } from "@/api/treatment-complexes.api";
import type { TreatmentComplexRequest, PatchedTreatmentComplexRequest } from "@/types/treatment-complex.types";
import { toast } from "sonner";

export const useTreatmentComplexes = () => {
  const queryClient = useQueryClient();

  const useList = () => useQuery({
    queryKey: ["treatment-complexes"],
    queryFn: () => TreatmentComplexesAPI.list(),
  });

  const useCreate = () => useMutation({
    mutationFn: (data: TreatmentComplexRequest) => TreatmentComplexesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment-complexes"] });
      toast.success("Kompleks yaratildi");
    },
    onError: () => toast.error("Kompleks yaratishda xatolik"),
  });

  const useUpdate = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedTreatmentComplexRequest }) =>
      TreatmentComplexesAPI.patch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment-complexes"] });
      toast.success("Kompleks yangilandi");
    },
    onError: () => toast.error("Kompleks yangilashda xatolik"),
  });

  const useDelete = () => useMutation({
    mutationFn: (id: number) => TreatmentComplexesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment-complexes"] });
      toast.success("Kompleks o'chirildi");
    },
    onError: () => toast.error("Kompleks o'chirishda xatolik"),
  });

  return { useList, useCreate, useUpdate, useDelete };
};
