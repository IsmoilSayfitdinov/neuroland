import { useMyChild } from "@/hooks/parent/useMyChild";
import ChildDetail from "@/pages/shared/ChildDetail";

export default function ParentChildInfo() {
  const { data: child, isLoading, isError } = useMyChild(true);

  return (
    <ChildDetail
      child={child}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
