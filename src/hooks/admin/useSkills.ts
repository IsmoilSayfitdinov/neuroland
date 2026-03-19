import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SkillsAPI } from "@/api/skills.api";
import type { 
  AgeGroupCreateRequest, 
  SectionCreateRequest, 
  PatchedSectionUpdateRequest, 
  ExerciseCreateRequest, 
  PatchedExerciseUpdateRequest,
} from "@/types/skills.types";
import { toast } from "sonner";

export const useSkills = () => {
  const queryClient = useQueryClient(); 

  // --- Age Groups ---
  const useAgeGroups = () => useQuery({
    queryKey: ["age-groups"],
    queryFn: () => SkillsAPI.listAgeGroups(),
  });

  const useCreateAgeGroup = () => useMutation({
    mutationFn: (data: AgeGroupCreateRequest) => SkillsAPI.createAgeGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["age-groups"] });
      toast.success("Yosh toifasi muvaffaqiyatli yaratildi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail?.[0]?.msg || "Xatolik yuz berdi");
    }
  });

  const useDeleteAgeGroup = () => useMutation({
    mutationFn: (id: number) => SkillsAPI.deleteAgeGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["age-groups"] });
      toast.success("Yosh toifasi o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Yosh toifasini o'chirishda xatolik");
    },
  });

  // NOTE: Backend doesn't support update for AgeGroups yet

  // --- Sections ---
  const useSections = () => useQuery({
    queryKey: ["sections"],
    queryFn: () => SkillsAPI.listSections(),
  });

  const useCreateSection = () => useMutation({
    mutationFn: (data: SectionCreateRequest) => SkillsAPI.createSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["age-groups"] });
      toast.success("Bo'lim muvaffaqiyatli yaratildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Bo'lim yaratishda xatolik");
    },
  });

  const useUpdateSection = () => useMutation({
    mutationFn: ({ id, data }: { id: number, data: PatchedSectionUpdateRequest }) =>
      SkillsAPI.updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("Bo'lim yangilandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Bo'limni yangilashda xatolik");
    },
  });

  const useDeleteSection = () => useMutation({
    mutationFn: (id: number) => SkillsAPI.deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("Bo'lim o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Bo'limni o'chirishda xatolik");
    },
  });

  // --- Exercises ---
  const useExercises = (sectionId: number) => useQuery({
    queryKey: ["exercises", sectionId],
    queryFn: () => SkillsAPI.listExercisesBySection(sectionId),
    enabled: !!sectionId,
  });

  const useCreateExercise = () => useMutation({
    mutationFn: (data: ExerciseCreateRequest) => SkillsAPI.createExercise(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.section_id] });
      toast.success("Mashq muvaffaqiyatli yaratildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Mashq yaratishda xatolik");
    },
  });

  const useUpdateExercise = () => useMutation({
    mutationFn: ({ id, data }: { id: number, data: PatchedExerciseUpdateRequest }) =>
      SkillsAPI.updateExercise(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success("Mashq yangilandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Mashqni yangilashda xatolik");
    },
  });

  const useDeleteExercise = () => useMutation({
    mutationFn: (id: number) => SkillsAPI.deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success("Mashq o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Mashqni o'chirishda xatolik");
    },
  });

  return {
    // Age Groups
    useAgeGroups,
    useCreateAgeGroup,
    useDeleteAgeGroup,
    // Sections
    useSections,
    useCreateSection,
    useUpdateSection,
    useDeleteSection,
    // Exercises
    useExercises,
    useCreateExercise,
    useUpdateExercise,
    useDeleteExercise,
  };
};

