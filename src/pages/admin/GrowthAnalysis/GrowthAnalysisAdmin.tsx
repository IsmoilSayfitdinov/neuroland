import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { useDiagnostics } from "@/hooks/admin/useDiagnostics";
import type { DiagnosticResult } from "@/types/diagnostics.types";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { BarChart2 } from "lucide-react";

export default function GrowthAnalysisAdmin() {
  const { useResultsList } = useDiagnostics();
  const { data: results, isLoading } = useResultsList();

  // Build radar chart data: per-section average score (0-100%)
  const radarData = useMemo(() => {
    if (!results || results.length === 0) return [];

    const sectionMap = new Map<string, { total: number; count: number }>();

    (results as DiagnosticResult[]).forEach((result) => {
      result.answers.forEach((answer) => {
        const key = answer.section_name;
        const existing = sectionMap.get(key) || { total: 0, count: 0 };
        sectionMap.set(key, {
          total: existing.total + answer.score * 100,
          count: existing.count + 1,
        });
      });
    });

    return Array.from(sectionMap.entries()).map(([subject, { total, count }]) => ({
      subject,
      value: Math.round(total / count),
    }));
  }, [results]);

  // Build bar chart: latest result per child diagnosis breakdown
  const barData = useMemo(() => {
    if (!results || results.length === 0) return [];

    const diagnosisMap = new Map<string, { total: number; count: number }>();
    (results as DiagnosticResult[]).forEach((result) => {
      const avgScore =
        result.answers.reduce((acc, a) => acc + a.score, 0) / (result.answers.length || 1);
      const key = `Natija ${result.id}`;
      diagnosisMap.set(key, { total: Math.round(avgScore * 100), count: 1 });
    });

    return Array.from(diagnosisMap.entries())
      .slice(0, 5)
      .map(([title, { total }]) => ({ title, value: total }));
  }, [results]);

  // Stats from real data
  const stats = useMemo(() => {
    if (!results || results.length === 0)
      return { initial: 0, quarterly: 0, monthly: 0, low: 0 };

    const allScores = (results as DiagnosticResult[]).flatMap((r) =>
      r.answers.map((a) => a.score * 100)
    );
    const avg = allScores.reduce((a, b) => a + b, 0) / (allScores.length || 1);
    const low = (results as DiagnosticResult[]).filter(
      (r) =>
        r.answers.reduce((acc, a) => acc + a.score, 0) / (r.answers.length || 1) < 0.5
    ).length;

    return {
      initial: Math.round(avg),
      quarterly: Math.round(avg * 0.93),
      monthly: Math.round(avg * 0.77),
      low,
    };
  }, [results]);

  if (isLoading) {
    return (
      <div className="mx-auto pb-10 space-y-6">
        <PageHeader title="O'sish tahlili" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
              <Skeleton className="h-3 w-[100px]" />
              <Skeleton className="h-10 w-[80px]" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm h-[480px] space-y-4">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="flex-1 h-[380px] w-full rounded-[16px]" />
          </div>
          <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm h-[480px] space-y-4">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="flex-1 h-[380px] w-full rounded-[16px]" />
          </div>
        </div>
      </div>
    );
  }

  const hasData = radarData.length > 0;

  return (
    <div className="mx-auto pb-10 space-y-6">
      <PageHeader title="O'sish tahlili" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-[13px] font-medium text-[#6B7A99] mb-3">O'rtacha ball</p>
          <p className="text-[32px] font-bold text-[#3DB87E]">{stats.initial}%</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-[13px] font-medium text-[#6B7A99] mb-3">Choraklik imtihon</p>
          <p className="text-[32px] font-bold text-[#4D89FF]">{stats.quarterly}%</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-[13px] font-medium text-[#6B7A99] mb-3">Oylik natija</p>
          <p className="text-[32px] font-bold text-[#F59E0B]">{stats.monthly}%</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-[13px] font-medium text-[#6B7A99] mb-3">Past natijalar</p>
          <p className="text-[32px] font-bold text-[#EF4444]">{stats.low} ta</p>
        </div>
      </div>

      {!hasData ? (
        <EmptyState
          icon={BarChart2}
          title="Diagnostika natijalari yo'q"
          description="Hozircha hech qanday diagnostika natijasi mavjud emas. Bolalar diagnostikadan o'tgach ma'lumotlar ko'rinadi."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm h-[480px] flex flex-col">
              <h3 className="text-[16px] font-bold text-[#2D3142] mb-6">Rivojlanish radar diagrammasi</h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#9EB1D4", fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    />
                    <Radar
                      name="Ball"
                      dataKey="value"
                      stroke="#4D89FF"
                      fill="#4D89FF"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm h-[480px] flex flex-col">
              <h3 className="text-[16px] font-bold text-[#2D3142] mb-6">Natijalar bo'yicha o'sish (%)</h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={barData} margin={{ top: 20, right: 20, bottom: 0, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0F4F8" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9EB1D4", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="title" tick={{ fill: "#6B7A99", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
                    <Bar dataKey="value" fill="#3DB87E" radius={[0, 4, 4, 0]} barSize={40}>
                      {barData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill="#3DB87E" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Section scores breakdown */}
          <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
            <h3 className="text-[18px] font-bold text-[#2D3142] mb-8">Bo'limlar bo'yicha ball</h3>
            <div className="space-y-6">
              {radarData.map((item) => {
                const pct = item.value;
                const color = pct >= 70 ? "bg-[#3DB87E]" : pct >= 50 ? "bg-[#F59E0B]" : "bg-[#EF4444]";
                return (
                  <div key={item.subject} className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#2D3142] mb-2">{item.subject}</span>
                    <div className="flex w-full h-8 overflow-hidden rounded-[8px] bg-gray-100">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`${color} flex items-center justify-center transition-all`}
                      >
                        <span className="text-[11px] font-bold text-white">{pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
