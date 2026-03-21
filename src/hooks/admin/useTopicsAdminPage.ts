import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopicsAPI } from "@/api/topics.api";
import type { TopicListRequest } from "@/types/topic.types";
import { toast } from "sonner";

export function formatDateRange(start: string, end: string) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${fmt(start)} — ${fmt(end)}`;
}

export const useTopicsAdminPage = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: topics, isLoading } = useQuery({
    queryKey: ["admin-topics"],
    queryFn: () => TopicsAPI.listTopics(),
    refetchOnMount: "always",
  });

  const deleteTopic = useMutation({
    mutationFn: (id: number) => TopicsAPI.deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
      toast.success("Mavzu o'chirildi!");
    },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  const rotateTopics = useMutation({
    mutationFn: () => TopicsAPI.rotateTopics(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
      toast.success("Mavzular rotatsiya qilindi!");
    },
    onError: () => toast.error("Rotatsiyada xatolik"),
  });

  const createTopic = useMutation({
    mutationFn: (data: TopicListRequest) => TopicsAPI.createTopic(data),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["admin-topics"] });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      toast.success("Mavzu yaratildi!");
      setShowCreateModal(false);
    },
    onError: () => toast.error("Mavzu yaratishda xatolik"),
  });

  const assignGroup = useMutation({
    mutationFn: ({ topicId, data }: { topicId: number; data: any }) =>
      TopicsAPI.assignGroup(topicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
      toast.success("Guruh biriktirildi!");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  return {
    topics,
    isLoading,
    showCreateModal,
    setShowCreateModal,
    deleteTopic,
    rotateTopics,
    createTopic,
    assignGroup,
  };
};
