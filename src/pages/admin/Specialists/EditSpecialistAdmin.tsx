import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { SpecialistForm } from "./components/SpecialistForm";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { PatchedSpecialistUserUpdateRequest } from "@/types/specialists.types";

export default function EditSpecialistAdmin() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const { useSpecialistDetail, useUpdateSpecialist } = useSpecialists();
  
  const { data: specialist, isLoading } = useSpecialistDetail(Number(id));
  const { mutate: updateSpecialist, isPending } = useUpdateSpecialist();

  const handleFormSubmit = (data: PatchedSpecialistUserUpdateRequest) => {
    updateSpecialist({
      id: Number(id),
      data,
    }, {
      onSuccess: () => navigate({ to: `/admin/specialists/${id}` }),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <SpecialistForm 
      title="Mutaxassisni tahrirlash"
      initialData={specialist}
      onSubmit={handleFormSubmit}
      isPending={isPending}
    />
  );
}
