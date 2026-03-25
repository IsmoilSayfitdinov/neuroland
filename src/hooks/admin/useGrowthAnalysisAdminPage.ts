import { useState, useMemo } from "react";
import { useAnalytics } from "./useAnalytics";
import { useChildren } from "./useChildren";

export const useGrowthAnalysisAdminPage = () => {
  const [selectedChildId, setSelectedChildId] = useState(0);

  const { useChildrenList } = useChildren();
  const { data: children, isLoading: isLoadingChildren } = useChildrenList();

  const { useAdminChildGrowth } = useAnalytics();
  const { data: growth, isLoading: isLoadingGrowth } = useAdminChildGrowth(selectedChildId) as { data: any; isLoading: boolean };

  const childOptions = useMemo(() => {
    if (!children) return [];
    return children.map((c) => ({
      label: c.fio || `${(c as any).first_name || ""} ${(c as any).last_name || ""}`.trim(),
      value: c.id.toString(),
    }));
  }, [children]);

  // radar.current -> radar diagramma uchun
  const radarData = useMemo(() => {
    const items = growth?.radar?.current ?? growth?.radar_metrics;
    if (!items || !Array.isArray(items)) return [];
    return items.map((m: any) => ({
      subject: m.section_name || m.subject || m.name || "",
      value: Math.round(m.percentage ?? m.score ?? m.value ?? 0),
    }));
  }, [growth]);

  // section_growth -> ustunli diagramma uchun
  const barData = useMemo(() => {
    const items = growth?.section_growth ?? growth?.diagnostics;
    if (!items || !Array.isArray(items)) return [];
    return items.slice(0, 6).map((d: any, i: number) => ({
      title: d.section_name || d.date || d.title || `Natija ${i + 1}`,
      value: Math.round(d.current ?? d.score ?? d.average ?? 0),
      change: d.change ?? 0,
    }));
  }, [growth]);

  // test_monitoring -> monitoring kartalar
  const monitoring = useMemo(() => {
    const items = growth?.test_monitoring ?? growth?.monitoring;
    if (!items || !Array.isArray(items)) return [];
    return items.slice(0, 4).map((m: any) => ({
      label: m.section_name || m.label || m.name || "",
      success: m.success_percent ?? 0,
      partial: m.partial_percent ?? 0,
      fail: m.fail_percent ?? 0,
    }));
  }, [growth]);

  // scores -> umumiy ko'rsatkichlar
  const scores = useMemo(() => {
    return growth?.scores ?? null;
  }, [growth]);

  // radar.details -> batafsil taqqoslash
  const radarDetails = useMemo(() => {
    const items = growth?.radar?.details;
    if (!items || !Array.isArray(items)) return [];
    return items;
  }, [growth]);

  const hasData = radarData.length > 0 || barData.length > 0 || monitoring.length > 0;

  return {
    selectedChildId,
    setSelectedChildId,
    isLoadingChildren,
    isLoadingGrowth,
    childOptions,
    radarData,
    barData,
    monitoring,
    scores,
    radarDetails,
    hasData,
  };
};
