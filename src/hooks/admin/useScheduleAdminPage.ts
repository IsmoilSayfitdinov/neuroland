import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGroups } from "@/hooks/admin/useGroups";
import { useTopics } from "@/hooks/admin/useTopics";
import { useSkills } from "@/hooks/admin/useSkills";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { SessionsAPI } from "@/api/sessions.api";
import { TopicsAPI } from "@/api/topics.api";
import type { TopicListRequest } from "@/types/topic.types";
import { toast } from "sonner";

const WEEKDAY_KEY: Record<number, string> = {
  1: "dushanba",
  2: "seshanba",
  3: "chorshanba",
  4: "payshanba",
  5: "juma",
};

export const useScheduleAdminPage = () => {
  const queryClient = useQueryClient();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);

  const { useGroupsList } = useGroups();
  const { data: groups, isLoading: isLoadingGroups } = useGroupsList();

  const { useActiveTopic } = useTopics();
  const { data: activeTopic, isLoading: isLoadingTopic } = useActiveTopic(selectedGroupId ?? undefined);

  const { useSections } = useSkills();
  const { data: sections } = useSections();

  const { useSpecialistsList } = useSpecialists();
  const { data: specialists } = useSpecialistsList();

  const { data: scheduleSlots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["schedule-slots", selectedGroupId],
    queryFn: () => SessionsAPI.listSlots(selectedGroupId ? { group: selectedGroupId } : undefined),
  });

  const createTopic = useMutation({
    mutationFn: (data: TopicListRequest) => TopicsAPI.createTopic(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["topics"] }),
        queryClient.refetchQueries({ queryKey: ["admin-topics"] }),
      ]);
      toast.success("Mavzu muvaffaqiyatli yaratildi");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Mavzuni yaratishda xatolik"),
  });

  const deleteSlot = useMutation({
    mutationFn: (id: number) => SessionsAPI.deleteSlot(id),
    onMutate: (id) => setDeletingSlotId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-slots"] });
      toast.success("Jadval uyasi o'chirildi");
    },
    onError: () => toast.error("O'chirishda xatolik"),
    onSettled: () => setDeletingSlotId(null),
  });

  const groupOptions = useMemo(() => {
    if (!groups) return [];
    return groups.map((g) => ({ label: g.name, value: g.id.toString() }));
  }, [groups]);

  const sectionOptions = useMemo(() => {
    if (!sections) return [];
    return sections.map((s) => ({ label: s.name, value: s.id.toString() }));
  }, [sections]);

  const specialistOptions = useMemo(() => {
    if (!specialists) return [];
    return specialists.map((s) => ({ label: `${s.fio} (${s.specialist_type_title})`, value: s.id.toString() }));
  }, [specialists]);

  // Transform schedule slots into WeeklySchedule Row format — now with slotId
  const weeklyRows = useMemo(() => {
    if (!scheduleSlots) return [];

    const timeMap = new Map<string, Record<string, { title: string; teacher: string; slotId: number }>>();

    scheduleSlots.forEach((slot) => {
      const time = slot.start_time.slice(0, 5);
      const dayKey = WEEKDAY_KEY[slot.weekday];
      if (!dayKey) return;

      if (!timeMap.has(time)) timeMap.set(time, {});
      timeMap.get(time)![dayKey] = {
        title: slot.group_name || slot.session_type,
        teacher: slot.specialist_name,
        slotId: slot.id,
      };
    });

    return Array.from(timeMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, days]) => ({ time, days }));
  }, [scheduleSlots]);

  const isLoading = isLoadingGroups || isLoadingSlots;

  const currentGroupName = useMemo(() => {
    if (!selectedGroupId || !groups) return groups?.[0]?.name || "";
    return groups.find((g) => g.id === selectedGroupId)?.name || "";
  }, [selectedGroupId, groups]);

  return {
    isLoading,
    isLoadingTopic,
    groups,
    groupOptions,
    sectionOptions,
    specialistOptions,
    selectedGroupId,
    setSelectedGroupId,
    currentGroupName,
    activeTopic,
    weeklyRows,
    isModalOpen,
    setIsModalOpen,
    isSlotModalOpen,
    setIsSlotModalOpen,
    createTopic,
    deleteSlot: (id: number) => deleteSlot.mutate(id),
    deletingSlotId,
  };
};
