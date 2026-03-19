import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SpecialistsAPI } from "@/api/specialists.api";
import { toast } from "sonner";
import type { 
  SpecialistTypeCreateRequest, 
  PatchedSpecialistTypeUpdateRequest,
  SpecialistUserCreateRequest,
  PatchedSpecialistUserUpdateRequest
} from "@/types/specialists.types";

export const useSpecialists = () => {
  const queryClient = useQueryClient();

  // --- Specialist Types ---
  const useSpecialistTypes = () => useQuery({
    queryKey: ["specialist-types"],
    queryFn: () => SpecialistsAPI.listSpecialistTypes(),
  });

  const useCreateSpecialistType = () => useMutation({
    mutationFn: (data: SpecialistTypeCreateRequest) => SpecialistsAPI.createSpecialistType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialist-types"] });
      toast.success("Mutaxassis turi qo'shildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Mutaxassis turi qo'shishda xatolik");
    },
  });

  const useUpdateSpecialistType = () => useMutation({
    mutationFn: ({ id, data }: { id: number, data: PatchedSpecialistTypeUpdateRequest }) =>
      SpecialistsAPI.updateSpecialistType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialist-types"] });
      toast.success("Mutaxassis turi yangilandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Mutaxassis turini yangilashda xatolik");
    },
  });

  const useDeleteSpecialistType = () => useMutation({
    mutationFn: (id: number) => SpecialistsAPI.deleteSpecialistType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialist-types"] });
      toast.success("Mutaxassis turi o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Mutaxassis turini o'chirishda xatolik");
    },
  });

  // --- Specialists ---
  const useSpecialistsList = () => useQuery({
    queryKey: ["specialists"],
    queryFn: () => SpecialistsAPI.getSpecialistsList(),
  });

  const useSpecialistDetail = (id: number) => useQuery({
    queryKey: ["specialists", id],
    queryFn: () => SpecialistsAPI.getSpecialistDetail(id),
    enabled: !!id,
  });

  const useCreateSpecialist = () => useMutation({
    mutationFn: (data: SpecialistUserCreateRequest) => SpecialistsAPI.createSpecialist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialists"] });
      toast.success("Mutaxassis qo'shildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Mutaxassis qo'shishda xatolik");
    },
  });

  const useUpdateSpecialist = () => useMutation({
    mutationFn: ({ id, data }: { id: number, data: PatchedSpecialistUserUpdateRequest }) =>
      SpecialistsAPI.updateSpecialist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialists"] });
      toast.success("Mutaxassis ma'lumotlari yangilandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Mutaxassisni yangilashda xatolik");
    },
  });

  const useDeleteSpecialist = () => useMutation({
    mutationFn: (id: number) => SpecialistsAPI.deleteSpecialist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialists"] });
      toast.success("Mutaxassis o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Mutaxassisni o'chirishda xatolik");
    },
  });

  return {
    // Types
    useSpecialistTypes,
    useCreateSpecialistType,
    useUpdateSpecialistType,
    useDeleteSpecialistType,
    // Specialists
    useSpecialistsList,
    useSpecialistDetail,
    useCreateSpecialist,
    useUpdateSpecialist,
    useDeleteSpecialist,
  };
};

