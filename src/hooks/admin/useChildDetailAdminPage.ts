import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useChildren } from "@/hooks/admin/useChildren";

export type ChildDetailTab = "basic" | "anamnesis" | "diagnostika" | "natijalar" | "uchrashuvlar" | "tolov";

export const useChildDetailAdminPage = () => {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const { useChildDetail } = useChildren();
  const { data: child, isLoading } = useChildDetail(Number(id), true);
  const [activeTab, setActiveTab] = useState<ChildDetailTab>("basic");

  const goBack = () => navigate({ to: "/admin/child" });

  return { child, isLoading, activeTab, setActiveTab, goBack };
};
