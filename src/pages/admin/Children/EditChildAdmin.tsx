import { useChildren } from "@/hooks/admin/useChildren";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { ChildForm } from "./components/ChildForm";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ChildSchema } from "@/schemas/children";

export default function EditChildAdmin() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const { useChildDetail, useUpdateChild } = useChildren();
  
  const { data: child, isLoading } = useChildDetail(Number(id), true);
  const { mutateAsync: updateChild, isPending: isUpdating } = useUpdateChild();
  const { useSpecialistsList } = useSpecialists();
  const { data: specialists } = useSpecialistsList();
  
  const handleFormSubmit = async (data: ChildSchema, dirtyFields: Partial<Record<keyof ChildSchema, any>>) => {
    try {
      const sleepHabits = [data.sleep_time, data.sleep_with_who]
        .filter(Boolean)
        .join(" | ");

      // Construction of PATCH data
      const patchData: any = {};
      
      // Top level profile fields
      if (dirtyFields.fio) patchData.fio = data.fio;
      if (dirtyFields.phone_number) patchData.phone_number = data.phone_number?.replace(/\s/g, "");
      if (dirtyFields.birth_date) patchData.birth_date = data.birth_date;
      if (dirtyFields.alias) patchData.alias = data.alias;
      if (dirtyFields.father_name) patchData.father_name = data.father_name;
      if (dirtyFields.mother_name) patchData.mother_name = data.mother_name;
      if (dirtyFields.phone_number_2) patchData.phone_number_2 = data.phone_number_2?.replace(/\s/g, "");
      if (dirtyFields.address) patchData.address = data.address;
      if (dirtyFields.recommended_by) patchData.recommended_by = data.recommended_by;
      if (dirtyFields.child_number_in_family) patchData.child_number_in_family = data.child_number_in_family;
      if (dirtyFields.photo) patchData.photo = data.photo;
      if (dirtyFields.diagnosis) patchData.diagnosis = data.diagnosis;
      if (dirtyFields.group_id) patchData.group_id = data.group_id ? Number(data.group_id) : undefined;
      
      // Specialist assignments — top-level: { "logoped": 5, "neyropsixolog": 3 }
      // Filter out null values — API expects integer only
      const specAssignments = data.specialist_assignments ?? {};
      const cleanedAssignments: Record<string, number> = {};
      Object.entries(specAssignments).forEach(([role, specId]) => {
        if (specId != null) cleanedAssignments[role] = specId;
      });
      if (Object.keys(cleanedAssignments).length > 0) {
        patchData.specialist_assignments = cleanedAssignments;
      }

      // Consultation fields
      const hasConsultationData = !!(
        data.kelib_tushgan_sana ||
        data.diagnosis ||
        data.complex_name ||
        data.duration ||
        data.recommendations ||
        data.group_admission_date ||
        data.consultant_id
      );

      if (hasConsultationData) {
        patchData.consultation = {
          arrival_date: data.kelib_tushgan_sana || null,
          preliminary_diagnosis: data.diagnosis || null,
          final_diagnosis: data.diagnosis || null,
          neuro_complex_name: data.complex_name || null,
          working_period: data.duration || null,
          recommendations: data.recommendations || null,
          group_acceptance_date: data.group_admission_date || null,
          accompanied_by: data.mother_name || data.father_name || null,
        };
      }

      // Anamnesis fields - always send full object if it has any meaningful data
      const hasAnamnesisData = [
        "pregnancy_1_trimester", "pregnancy_2_trimester", "pregnancy_3_trimester",
        "birth_process", "birth_weight", "first_40_days", "up_to_1_year",
        "breastfeeding_duration", "pacifier_usage_period", "walking_age",
        "gadget_usage_age", "kindergarten_age", "eating_habits",
        "has_constipation", "has_diarrhea", "wears_pampers", "likes_bathing",
        "has_inner_speech", "first_word_age", "vaccination", "current_vocabulary_count",
        "sleep_time", "sleep_with_who"
      ].some(key => (data as any)[key] !== undefined && (data as any)[key] !== "" && (data as any)[key] !== false);

      if (hasAnamnesisData) {
        patchData.anamnesis = {
          pregnancy_1_trimester: data.pregnancy_1_trimester,
          pregnancy_2_trimester: data.pregnancy_2_trimester,
          pregnancy_3_trimester: data.pregnancy_3_trimester,
          birth_process: data.birth_process,
          birth_weight: data.birth_weight,
          first_40_days: data.first_40_days,
          up_to_1_year: data.up_to_1_year,
          breastfeeding_duration: data.breastfeeding_duration,
          pacifier_usage_period: data.pacifier_usage_period,
          walking_age: data.walking_age,
          gadget_usage_age: data.gadget_usage_age,
          kindergarten_age: data.kindergarten_age,
          sleep_habits: sleepHabits,
          eating_habits: data.eating_habits,
          has_constipation: Boolean(data.has_constipation),
          has_diarrhea: Boolean(data.has_diarrhea),
          wears_pampers: Boolean(data.wears_pampers),
          likes_bathing: Boolean(data.likes_bathing),
          has_inner_speech: Boolean(data.has_inner_speech),
          first_word_age: data.first_word_age,
          current_vocabulary_count: String(data.current_vocabulary_count),
          vaccination: data.vaccination,
        };
      }

      // 1. Update the child profile via PATCH with all data
      if (Object.keys(patchData).length > 0) {
        await updateChild({
          id: Number(id),
          data: patchData,
        });
      }

      toast.success("Bemor ma'lumotlari yangilandi!");
      navigate({ to: "/admin/child" });
    } catch (error: any) {
      console.error("Update error:", error);
      const errorMessage = 
        error?.response?.data?.detail?.[0]?.msg || 
        error?.response?.data?.message || 
        "Xatolik yuz berdi";
      toast.error(errorMessage);
    }
  };

  if (isLoading || !child || !specialists) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4D89FF]"></div>
      </div>
    );
  }

  // Parse sleep_habits back into sleep_time and sleep_with_who for the form
  const sleepHabitsParts = (child?.anamnesis?.sleep_habits || "").split(" | ");

  // Build specialist_assignments: { role(lowercase): specialistId } from child.specialist_assignments response
  const specialistAssignments: Record<string, number> = {};
  (child?.specialist_assignments ?? []).forEach((sa) => {
    if (sa.role && sa.specialist_id != null) {
      specialistAssignments[sa.role.toLowerCase()] = sa.specialist_id;
    }
  });

  // Transform backend data to flat form structure
  const initialFormValues = child ? {
    fio: child.fio,
    phone_number: child.phone_number,
    birth_date: child.birth_date,
    alias: child.alias || "",
    diagnosis: child.diagnosis || "",
    kelib_tushgan_sana: child.consultation?.arrival_date || "",
    father_name: child.father_name || "",
    mother_name: child.mother_name || "",
    phone_number_2: child.phone_number_2 || "",
    address: child.address || "",
    recommended_by: child.recommended_by || "",
    child_number_in_family: child.child_number_in_family || 1,
    photo: child.photo || "",
    specialist_assignments: specialistAssignments,
    group_id: child.group_id?.toString() || "",
    group_admission_date: child.consultation?.group_acceptance_date || "",
    
    // Anamnesis fields
    pregnancy_1_trimester: child.anamnesis?.pregnancy_1_trimester || "",
    pregnancy_2_trimester: child.anamnesis?.pregnancy_2_trimester || "",
    pregnancy_3_trimester: child.anamnesis?.pregnancy_3_trimester || "",
    birth_process: child.anamnesis?.birth_process || "",
    birth_weight: child.anamnesis?.birth_weight || "",
    first_40_days: child.anamnesis?.first_40_days || "",
    up_to_1_year: child.anamnesis?.up_to_1_year || "",
    breastfeeding_duration: child.anamnesis?.breastfeeding_duration || "",
    pacifier_usage_period: child.anamnesis?.pacifier_usage_period || "",
    walking_age: child.anamnesis?.walking_age || "",
    gadget_usage_age: child.anamnesis?.gadget_usage_age || "",
    kindergarten_age: child.anamnesis?.kindergarten_age || "",
    // Parse combined sleep_habits back to individual fields
    sleep_time: sleepHabitsParts[0] || "",
    sleep_with_who: sleepHabitsParts[1] || "",
    eating_habits: child.anamnesis?.eating_habits || "",
    has_constipation: child.anamnesis?.has_constipation || false,
    has_diarrhea: child.anamnesis?.has_diarrhea || false,
    wears_pampers: child.anamnesis?.wears_pampers || false,
    likes_bathing: child.anamnesis?.likes_bathing || false,
    has_inner_speech: child.anamnesis?.has_inner_speech || false,
    first_word_age: child.anamnesis?.first_word_age || "",
    current_vocabulary_count: child.anamnesis?.current_vocabulary_count || "",
    vaccination: child.anamnesis?.vaccination || "",
    // Consultation mapping fields
    complex_name: child.consultation?.neuro_complex_name || "",
    duration: child.consultation?.working_period || "",
    recommendations: child.consultation?.recommendations || "",
  } : undefined;

  return (
    <ChildForm
      initialData={initialFormValues}
      onSubmit={handleFormSubmit}
      isPending={isUpdating}
      isEditMode
    />
  );
}
