import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TopicsAPI } from "@/api/topics.api";
import type { TopicListRequest } from "@/types/topic.types";
import { toast } from "sonner";

export const useTopics = () => {
  const queryClient = useQueryClient();

  const useTopicsList = (groupId?: number) =>
    useQuery({
      queryKey: ["topics", groupId],
      queryFn: () => TopicsAPI.listTopics(groupId ? { group_id: groupId } : undefined),
    });

  const useActiveTopic = (groupId?: number) =>
    useQuery({
      queryKey: ["topics", "active", groupId],
      queryFn: () => TopicsAPI.getActiveTopics(groupId),
      enabled: !!groupId,
    });

  const useCreateTopic = () =>
    useMutation({
      mutationFn: (data: TopicListRequest) => TopicsAPI.createTopic(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["topics"] });
        toast.success("Mavzu muvaffaqiyatli yaratildi");
      },
      onError: () => toast.error("Mavzuni yaratishda xatolik"),
    });

  const useDeleteTopic = () =>
    useMutation({
      mutationFn: (id: number) => TopicsAPI.deleteTopic(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["topics"] });
        toast.success("Mavzu o'chirildi");
      },
      onError: () => toast.error("Mavzuni o'chirishda xatolik"),
    });

  return { useTopicsList, useActiveTopic, useCreateTopic, useDeleteTopic };
};
