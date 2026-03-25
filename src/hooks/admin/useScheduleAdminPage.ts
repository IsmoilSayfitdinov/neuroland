import { useState, useMemo, useEffect } from "react";
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
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { useGroupsList } = useGroups();
  const { data: groups, isLoading: isLoadingGroups } = useGroupsList();

  // Auto-select first group
  useEffect(() => {
    if (!selectedGroupId && groups && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  const { useActiveTopic } = useTopics();
  const { data: activeTopic, isLoading: isLoadingTopic } = useActiveTopic(selectedGroupId ?? undefined);

  const { useSections } = useSkills();
  const { data: sections } = useSections();

  const { useSpecialistsList } = useSpecialists();
  const { data: specialists } = useSpecialistsList();

  const { data: scheduleSlots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["schedule-slots", selectedGroupId],
    queryFn: () => SessionsAPI.listSlots({ group: selectedGroupId! }),
    enabled: !!selectedGroupId,
  });

  // Daily sessions — server filter + frontend fallback filter
  const { data: daySessions = [], isLoading: isLoadingSessions, refetch: refetchSessions } = useQuery({
    queryKey: ["admin-sessions", selectedDate],
    queryFn: async () => {
      const sessions = await SessionsAPI.list({ date: selectedDate });
      return sessions.filter((s) => s.date === selectedDate);
    },
    enabled: !!selectedDate,
  });

  const createSession = useMutation({
    mutationFn: (data: { date: string; start_time: string; group?: number | null; specialist?: number | null }) =>
      SessionsAPI.create({ date: data.date, start_time: data.start_time, group: data.group, specialist: data.specialist }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sessions"] });
      toast.success("Seans yaratildi");
      setIsSessionModalOpen(false);
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail || "Xatolik yuz berdi"),
  });

  const deleteSession = useMutation({
    mutationFn: (id: number) => SessionsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sessions"] });
      toast.success("Seans o'chirildi");
    },
    onError: () => toast.error("O'chirishda xatolik"),
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
    if (!scheduleSlots || !selectedGroupId) return [];

    const timeMap = new Map<string, Record<string, any>>();

    scheduleSlots.filter((slot) => slot.group === selectedGroupId).forEach((slot) => {
      const time = slot.start_time.slice(0, 5);
      const dayKey = WEEKDAY_KEY[slot.weekday];
      if (!dayKey) return;

      if (!timeMap.has(time)) timeMap.set(time, {});
      timeMap.get(time)![dayKey] = {
        title: slot.group_name || slot.session_type,
        teacher: slot.specialist_name,
        slotId: slot.id,
        specialist: slot.specialist,
        weekday: slot.weekday,
        session_type: slot.session_type,
        duration_min: slot.duration_min,
      };
    });

    return Array.from(timeMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, days]) => ({ time, days }));
  }, [scheduleSlots]);

  const isLoading = isLoadingGroups || (!!selectedGroupId && isLoadingSlots);

  const currentGroupName = useMemo(() => {
    if (!selectedGroupId || !groups) return groups?.[0]?.name || "";
    return groups.find((g) => g.id === selectedGroupId)?.name || "";
  }, [selectedGroupId, groups]);

  return {
    isLoading,
    isLoadingTopic,
    isLoadingSessions,
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
    // Sessions
    daySessions,
    selectedDate,
    setSelectedDate,
    isSessionModalOpen,
    setIsSessionModalOpen,
    createSession,
    deleteSession: (id: number) => deleteSession.mutate(id),
    isDeletingSession: deleteSession.isPending,
    refetchSessions,
  };
};
