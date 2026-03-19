import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useChildren } from "@/hooks/admin/useChildren";
import { useGroups } from "@/hooks/admin/useGroups";
import type { ChildOut } from "@/types/children.types";

export const useChildrenPage = () => {
  const navigate = useNavigate();
  const { useChildrenList, useDeleteChild } = useChildren();
  const { data: children, isLoading } = useChildrenList();
  const deleteChild = useDeleteChild();

  const { useGroupsList } = useGroups();
  const { data: groups } = useGroupsList();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null; name: string }>({
    isOpen: false,
    id: null,
    name: "",
  });

  const groupsOptions = useMemo(() => {
    if (!groups) return [];
    return groups.map((g) => ({ label: g.name, value: g.id.toString() }));
  }, [groups]);

  const filteredChildren = useMemo(() => {
    if (!children) return [];
    return children.filter((child: ChildOut) => {
      const matchesSearch =
        child.fio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (child.alias && child.alias.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGroup = !selectedGroup || child.group_id?.toString() === selectedGroup;
      const matchesStatus = !selectedStatus || child.status === selectedStatus;

      const age = Math.floor(
        (new Date().getTime() - new Date(child.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      );
      let matchesAge = true;
      if (selectedAge === "0-3") matchesAge = age <= 3;
      else if (selectedAge === "3-5") matchesAge = age > 3 && age <= 5;
      else if (selectedAge === "5-7") matchesAge = age > 5 && age <= 7;
      else if (selectedAge === "7+") matchesAge = age > 7;

      return matchesSearch && matchesGroup && matchesStatus && matchesAge;
    });
  }, [children, searchQuery, selectedGroup, selectedStatus, selectedAge]);

  const handleDelete = () => {
    if (deleteModal.id) {
      deleteChild.mutate(deleteModal.id, {
        onSuccess: () => setDeleteModal({ isOpen: false, id: null, name: "" }),
      });
    }
  };

  const openDeleteModal = (id: number, name: string) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: null, name: "" });
  };

  return {
    isLoading,
    groups,
    groupsOptions,
    filteredChildren,
    searchQuery,
    setSearchQuery,
    selectedGroup,
    setSelectedGroup,
    selectedAge,
    setSelectedAge,
    selectedStatus,
    setSelectedStatus,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
    isDeleting: deleteChild.isPending,
    navigate,
  };
};
