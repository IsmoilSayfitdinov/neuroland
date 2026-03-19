import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TopicsAPI } from "@/api/topics.api";
import { toast } from "sonner";

export function useTopicExercises() {
  return useQuery({
    queryKey: ["parent", "topic-exercises"],
    queryFn: () => TopicsAPI.listExercises(),
  });
}

export function useTopicExerciseById(id: number) {
  return useQuery({
    queryKey: ["parent", "topic-exercises", id],
    queryFn: () => TopicsAPI.getExerciseById(id),
    enabled: !!id,
  });
}

export function useStartExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => TopicsAPI.startExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent", "topic-exercises"] });
    },
    onError: () => {
      toast.error("Videoni boshlashda xatolik yuz berdi");
    },
  });
}

export function useEndExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => TopicsAPI.endExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent", "topic-exercises"] });
      toast.success("Video mashq yakunlandi!");
    },
    onError: () => {
      toast.error("Videoni yakunlashda xatolik yuz berdi");
    },
  });
}
