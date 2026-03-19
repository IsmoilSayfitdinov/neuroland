import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GroupsAPI } from "@/api/groups.api";
import type { 
  GroupCreateRequest, 
  GroupUpdateRequest 
} from "@/types/groups.types";
import { toast } from "sonner";

export const useGroups = () => {
  const queryClient = useQueryClient();

  const useGroupsList = () => useQuery({
    queryKey: ["groups"],
    queryFn: () => GroupsAPI.listGroups(),
  });

  const useGroupDetail = (id: number) => useQuery({
    queryKey: ["groups", id],
    queryFn: () => GroupsAPI.getGroupById(id),
    enabled: !!id,
  });

  const useCreateGroup = () => useMutation({
    mutationFn: (data: GroupCreateRequest) => GroupsAPI.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["child"] });
      toast.success("Guruh muvaffaqiyatli yaratildi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail?.[0]?.msg || "Xatolik yuz berdi");
    }
  });

  const useUpdateGroup = () => useMutation({
    mutationFn: ({ id, data }: { id: number, data: GroupUpdateRequest }) =>
      GroupsAPI.updateGroup(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["child"] });
      toast.success("Guruh yangilandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Guruhni yangilashda xatolik");
    },
  });

  const useDeleteGroup = () => useMutation({
    mutationFn: (id: number) => GroupsAPI.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Guruh o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail?.[0]?.msg || "Guruhni o'chirishda xatolik");
    },
  });

  const useUnassignedPatients = () => useQuery({
    queryKey: ["unassigned-patients"],
    queryFn: () => GroupsAPI.listUnassignedPatients(),
  });

  return {
    useGroupsList,
    useGroupDetail,
    useCreateGroup,
    useUpdateGroup,
    useDeleteGroup,
    useUnassignedPatients,
  };
};
