import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useGroups } from "@/hooks/admin/useGroups";
import { useAnalytics } from "@/hooks/admin/useAnalytics";
import { UsersAPI } from "@/api/users.api";
import { SpecialistsAPI } from "@/api/specialists.api";
import { SessionsAPI } from "@/api/sessions.api";

export const useGroupDetailPage = () => {
  const { groupId } = useParams({ strict: false });
  const id = Number(groupId);

  const { useGroupDetail } = useGroups();
  const { useDoctorGroupDetail } = useAnalytics();
  const { data: group, isLoading: groupLoading } = useGroupDetail(id);
  const { data: groupAnalytics, isLoading: analyticsLoading } = useDoctorGroupDetail(id);

  // Joriy foydalanuvchi
  const { data: me } = useQuery({
    queryKey: ["users", "me"],
    queryFn: () => UsersAPI.getMe(),
    staleTime: 5 * 60 * 1000,
  });

  // Mutaxassislar ro'yxati
  const { data: specialists } = useQuery({
    queryKey: ["specialists", "list"],
    queryFn: () => SpecialistsAPI.getSpecialistsList(),
    staleTime: 5 * 60 * 1000,
  });

  const currentSpecialist = useMemo(() => {
    if (!me || !specialists) return null;
    return specialists.find((s) => s.user_id === me.id) ?? null;
  }, [me, specialists]);

  // Guruhning barcha slotlarini olish — har doim ishlaydi
  const { data: allGroupSlots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ["schedule-slots", "group", id],
    queryFn: () => SessionsAPI.listSlots({ group: id }),
    enabled: !!id,
  });

  // Client-side: faqat joriy mutaxassisnikini filter qilish
  const mySlots = useMemo(() => {
    if (!currentSpecialist) return allGroupSlots;
    return allGroupSlots.filter((s) => s.specialist === currentSpecialist.id);
  }, [allGroupSlots, currentSpecialist]);

  const isLoading = groupLoading || analyticsLoading || slotsLoading;

  return {
    group,
    groupAnalytics,
    mySlots,
    currentSpecialist,
    isLoading,
    groupId: id,
  };
};
