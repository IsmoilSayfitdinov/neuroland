import { useNavigate, useParams } from "@tanstack/react-router";
import { useChildren } from "@/hooks/admin/useChildren";
import ChildDetail from "@/pages/shared/ChildDetail";

export default function ChildDetailAdmin() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const { useChildDetail } = useChildren();
  const { data: child, isLoading, isError } = useChildDetail(Number(id), true);

  return (
    <ChildDetail
      child={child}
      isLoading={isLoading}
      isError={isError}
      onGoBack={() => navigate({ to: "/admin/child" })}
    />
  );
}
