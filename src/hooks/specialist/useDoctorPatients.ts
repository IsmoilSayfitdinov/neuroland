import { useAnalytics } from "@/hooks/admin/useAnalytics";

export const useDoctorPatients = () => {
  const {
    useDoctorPatients: usePatientsQuery,
    useDoctorPatientDiagnostics: useDiagnosticsQuery,
  } = useAnalytics();

  const usePatientsList = () => usePatientsQuery();
  const usePatientDiagnostics = (childId: number) => useDiagnosticsQuery(childId);

  return { usePatientsList, usePatientDiagnostics };
};
