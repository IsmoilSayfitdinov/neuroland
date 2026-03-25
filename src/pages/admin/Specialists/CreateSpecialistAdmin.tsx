import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { SpecialistForm } from "./components/SpecialistForm";
import { useNavigate } from "@tanstack/react-router";
import type { SpecialistUserCreateRequest } from "@/types/specialists.types";
import { toast } from "sonner"; // Assuming toast is imported from sonner or similar library

export default function CreateSpecialistAdmin() {
  const navigate = useNavigate();
  const { useCreateSpecialist } = useSpecialists();
  const { mutate: createSpecialist, isPending } = useCreateSpecialist();

  const handleFormSubmit = (data: SpecialistUserCreateRequest) => {
    createSpecialist({
      ...data,
      password: data.password || "Specialist123!",
    }, {
      onSuccess: () => navigate({ to: "/admin/specialists" }),
      onError: (error: any) => {
        const errorMessage =
          typeof error?.response?.data === 'object' ? JSON.stringify(error?.response?.data) :
          error?.response?.data?.detail?.[0]?.msg ||
          error?.response?.data?.message ||
          "Xatolik yuz berdi";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <SpecialistForm
      title="Mutaxassis qo'shish"
      onSubmit={handleFormSubmit}
      isPending={isPending}
    />
  );
}
