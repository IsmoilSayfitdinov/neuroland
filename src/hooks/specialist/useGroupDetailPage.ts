import { useParams } from "@tanstack/react-router";
import { useGroups } from "@/hooks/admin/useGroups";

export const useGroupDetailPage = () => {
  const { groupId } = useParams({ strict: false });
  const id = Number(groupId);
  const { useGroupDetail } = useGroups();
  const { data: group, isLoading } = useGroupDetail(id);

  return { group, isLoading, groupId: id };
};
