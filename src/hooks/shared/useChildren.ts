import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChildrenAPI } from "@/api/children.api";
import { toast } from "sonner";
import type { ChildUserCreateRequest, PatchedChildUserUpdateRequest } from "@/types/children.types";

const CHILDREN_KEY = "children";
const CHILD_KEY = "child";

function extractErrorMessage(error: unknown, fallback: string): string {
  const err = error as any;
  return err?.response?.data?.detail?.[0]?.msg || err?.message || fallback;
}

export const useChildren = () => {
  const queryClient = useQueryClient();

  const useChildrenList = (skip = 0, limit = 50) =>
    useQuery({
      queryKey: [CHILDREN_KEY, skip, limit],
      queryFn: () => ChildrenAPI.getList(skip, limit),
    });

  const useChildDetail = (id: number, includeAnamnesis = false) =>
    useQuery({
      queryKey: [CHILD_KEY, id, includeAnamnesis],
      queryFn: () => ChildrenAPI.getById(id, includeAnamnesis),
      enabled: !!id,
    });

  const useCreateChild = () =>
    useMutation({
      mutationFn: (data: ChildUserCreateRequest) => ChildrenAPI.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [CHILDREN_KEY] });
        toast.success("Yangi bola qo'shildi");
      },
      onError: (error) => toast.error(extractErrorMessage(error, "Bola qo'shishda xatolik")),
    });

  const useUpdateChild = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: PatchedChildUserUpdateRequest }) =>
        ChildrenAPI.update(id, data),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: [CHILD_KEY, id] });
        queryClient.invalidateQueries({ queryKey: [CHILDREN_KEY] });
      },
      onError: (error) => toast.error(extractErrorMessage(error, "Ma'lumotlarni yangilashda xatolik")),
    });

  const useDeleteChild = () =>
    useMutation({
      mutationFn: (id: number) => ChildrenAPI.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [CHILDREN_KEY] });
        toast.success("Bola o'chirildi");
      },
      onError: (error) => toast.error(extractErrorMessage(error, "O'chirishda xatolik")),
    });

  return { useChildrenList, useChildDetail, useCreateChild, useUpdateChild, useDeleteChild };
};
