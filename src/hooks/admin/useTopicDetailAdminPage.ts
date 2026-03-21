import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopicsAPI } from "@/api/topics.api";
import { SkillsAPI } from "@/api/skills.api";
import { toast } from "sonner";

export const useTopicDetailAdminPage = () => {
  const { topicId } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: topic, isLoading } = useQuery({
    queryKey: ["admin-topic", topicId],
    queryFn: () => TopicsAPI.getTopicById(Number(topicId)),
  });

  const { data: sections } = useQuery({
    queryKey: ["sections"],
    queryFn: () => SkillsAPI.listSections(),
  });

  const categoryName =
    topic?.category && sections
      ? sections.find((s) => s.id === topic.category)?.name
      : null;

  const deleteTopic = useMutation({
    mutationFn: () => TopicsAPI.deleteTopic(Number(topicId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
      toast.success("Mavzu o'chirildi");
      navigate({ to: "/admin/topics" });
    },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  const detachGroup = useMutation({
    mutationFn: (groupId: number) => TopicsAPI.detachGroup(Number(topicId), groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-topic"] });
      toast.success("Guruh uzildi");
    },
    onError: () => toast.error("Xatolik"),
  });

  const addExercise = useMutation({
    mutationFn: (data: any) => TopicsAPI.addExercise(Number(topicId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-topic"] });
      toast.success("Mashq qo'shildi!");
      setShowAddModal(false);
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const removeExercise = useMutation({
    mutationFn: (exerciseId: number) => TopicsAPI.removeExercise(Number(topicId), exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-topic"] });
      toast.success("Mashq olib tashlandi");
    },
    onError: () => toast.error("Xatolik"),
  });

  const goBack = () => navigate({ to: "/admin/topics" });

  return {
    topic,
    isLoading,
    categoryName,
    showAddModal,
    setShowAddModal,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteTopic,
    detachGroup,
    addExercise,
    removeExercise,
    goBack,
  };
};
