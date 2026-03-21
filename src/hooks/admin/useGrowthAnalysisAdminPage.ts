import { useState, useMemo } from "react";
import { useAnalytics } from "./useAnalytics";
import { useChildren } from "./useChildren";

export const useGrowthAnalysisAdminPage = () => {
  const [selectedChildId, setSelectedChildId] = useState(0);

  const { useChildrenList } = useChildren();
  const { data: children, isLoading: isLoadingChildren } = useChildrenList();

  const { useAdminChildGrowth } = useAnalytics();
  const { data: growth, isLoading: isLoadingGrowth } = useAdminChildGrowth(selectedChildId);

  const childOptions = useMemo(() => {
    if (!children) return [];
    return children.map((c) => ({
      label: c.fio || `${(c as any).first_name || ""} ${(c as any).last_name || ""}`.trim(),
      value: c.id.toString(),
    }));
  }, [children]);

  const radarData = useMemo(() => {
    if (!growth?.radar_metrics) return [];
    return (growth.radar_metrics as any[]).map((m: any) => ({
      subject: m.section_name || m.subject || m.name || "",
      value: Math.round(m.score ?? m.value ?? 0),
    }));
  }, [growth]);

  const barData = useMemo(() => {
    if (!growth?.diagnostics) return [];
    return (growth.diagnostics as any[]).slice(0, 6).map((d: any, i: number) => ({
      title: d.date || d.title || `Natija ${i + 1}`,
      value: Math.round(d.score ?? d.average ?? 0),
    }));
  }, [growth]);

  const monitoring = useMemo(() => {
    if (!growth?.monitoring) return [];
    return (growth.monitoring as any[]).slice(0, 4);
  }, [growth]);

  return {
    selectedChildId,
    setSelectedChildId,
    isLoadingChildren,
    isLoadingGrowth,
    childOptions,
    radarData,
    barData,
    monitoring,
    hasData: radarData.length > 0 || barData.length > 0,
  };
};
