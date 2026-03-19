import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useSpecialists } from "@/hooks/admin/useSpecialists";

export const useSpecialistDetailAdminPage = () => {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const { useSpecialistDetail, useDeleteSpecialist } = useSpecialists();
  const { data: spec, isLoading } = useSpecialistDetail(Number(id));
  const { mutate: deleteSpecialist, isPending: isDeleting } = useDeleteSpecialist();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    deleteSpecialist(Number(id), {
      onSuccess: () => navigate({ to: "/admin/specialists" }),
    });
  };

  const goBack = () => navigate({ to: "/admin/specialists" });

  return {
    spec,
    isLoading,
    isDeleting,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDelete,
    goBack,
  };
};
