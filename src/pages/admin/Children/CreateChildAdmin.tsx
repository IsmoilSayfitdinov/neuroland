import { useChildren } from "@/hooks/admin/useChildren";
import { ChildForm } from "./components/ChildForm";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ChildSchema } from "@/schemas/children";

export default function CreateChildAdmin() {
  const navigate = useNavigate();
  const { useCreateChild } = useChildren();
  const { mutateAsync: createChild, isPending } = useCreateChild();

  const handleFormSubmit = async (data: ChildSchema, _dirtyFields: any) => {
    try {
      await createChild({
        fio: data.fio,
        phone_number: data.phone_number?.replace(/\s/g, "") || "",
        password: data.password || "",
        photo: data.photo instanceof File ? data.photo : undefined,
        alias: data.alias || null,
        birth_date: data.birth_date,
        father_name: data.father_name || null,
        mother_name: data.mother_name || null,
        phone_number_2: data.phone_number_2?.replace(/\s/g, "") || null,
        address: data.address || null,
        child_number_in_family: data.child_number_in_family ?? null,
        recommended_by: data.recommended_by || null,
        specialist_assignments: data.specialist_assignments ?? null,
      });

      toast.success("Bola muvaffaqiyatli qo'shildi!");
      navigate({ to: "/admin/child" });

    } catch (error: any) {
      const errorMessage =
        typeof error?.response?.data === "object"
          ? JSON.stringify(error?.response?.data)
          : error?.response?.data?.detail?.[0]?.msg ||
            error?.response?.data?.message ||
            "Xatolik yuz berdi";
      toast.error(errorMessage);
    }
  };

  return (
    <ChildForm
      onSubmit={handleFormSubmit}
      isPending={isPending}
    />
  );
}
