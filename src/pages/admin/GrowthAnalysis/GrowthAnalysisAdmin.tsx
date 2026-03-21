import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { BarChart2, Loader2 } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import { useGrowthAnalysisAdminPage } from "@/hooks/admin/useGrowthAnalysisAdminPage";

export default function GrowthAnalysisAdmin() {
  const {
    selectedChildId,
    setSelectedChildId,
    isLoadingChildren,
    isLoadingGrowth,
    childOptions,
    radarData,
    barData,
    monitoring,
    hasData,
  } = useGrowthAnalysisAdminPage();

  if (isLoadingChildren) {
    return (
      <div className="mx-auto pb-10 space-y-6">
        <PageHeader title="O'sish tahlili" />
        <Skeleton className="h-12 w-[300px] rounded-[12px]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[480px] w-full rounded-[24px]" />
          <Skeleton className="h-[480px] w-full rounded-[24px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      <PageHeader title="O'sish tahlili" />

      <div className="max-w-[320px]">
        <CustomSelect
          options={childOptions}
          value={selectedChildId.toString()}
          onChange={(val) => setSelectedChildId(Number(val))}
          placeholder="Bolani tanlang..."
        />
      </div>

      {!selectedChildId && (
        <EmptyState icon={BarChart2} title="Bolani tanlang" description="O'sish tahlilini ko'rish uchun yuqoridagi ro'yxatdan bolani tanlang." />
      )}

      {selectedChildId > 0 && isLoadingGrowth && (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {selectedChildId > 0 && !isLoadingGrowth && (
        <>
          {monitoring.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {monitoring.map((m: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <p className="text-[13px] font-medium text-[#6B7A99] mb-3">{m.label || m.name || `Ko'rsatkich ${i + 1}`}</p>
                  <p className="text-[32px] font-bold text-[#3DB87E]">{m.value ?? m.score ?? 0}%</p>
                </div>
              ))}
            </div>
          )}

          {!hasData ? (
            <EmptyState icon={BarChart2} title="Diagnostika natijalari yo'q" description="Bu bola uchun hozircha diagnostika natijasi mavjud emas." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {radarData.length > 0 && (
                <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm h-[480px] flex flex-col">
                  <h3 className="text-[16px] font-bold text-[#2D3142] mb-6">Rivojlanish radar diagrammasi</h3>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#E2E8F0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "#9EB1D4", fontSize: 11, fontWeight: 500 }} />
                        <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
                        <Radar name="Ball" dataKey="value" stroke="#4D89FF" fill="#4D89FF" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {barData.length > 0 && (
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
                          {barData.map((_: any, index: number) => <Cell key={`cell-${index}`} fill="#3DB87E" />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {radarData.length > 0 && (
            <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
              <h3 className="text-[18px] font-bold text-[#2D3142] mb-8">Bo'limlar bo'yicha ball</h3>
              <div className="space-y-6">
                {radarData.map((item: any) => {
                  const pct = item.value;
                  const color = pct >= 70 ? "bg-[#3DB87E]" : pct >= 50 ? "bg-[#F59E0B]" : "bg-[#EF4444]";
                  return (
                    <div key={item.subject} className="flex flex-col">
                      <span className="text-[14px] font-bold text-[#2D3142] mb-2">{item.subject}</span>
                      <div className="flex w-full h-8 overflow-hidden rounded-[8px] bg-gray-100">
                        <div style={{ width: `${pct}%` }} className={`${color} flex items-center justify-center transition-all`}>
                          <span className="text-[11px] font-bold text-white">{pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
