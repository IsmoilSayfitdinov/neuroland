import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { BarChart2, Loader2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import { useGrowthAnalysisAdminPage } from "@/hooks/admin/useGrowthAnalysisAdminPage";
import { cn } from "@/lib/utils";

const growthInfo = (
  <>
    <p>Bu bo'limda bolalarning rivojlanish dinamikasini tahlil qilish mumkin.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Bolani tanlash va uning o'sish ko'rsatkichlarini ko'rish</li>
      <li>Radar diagramma orqali sohalardagi rivojlanish darajasi</li>
      <li>Ustunli diagramma orqali oylik dinamika</li>
      <li>Monitoring ma'lumotlarini kuzatish</li>
    </ul>
  </>
);

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
    scores,
    radarDetails,
    hasData,
  } = useGrowthAnalysisAdminPage();

  if (isLoadingChildren) {
    return (
      <div className="mx-auto pb-10 space-y-6">
        <PageHeader title="O'sish tahlili" infoTitle="O'sish tahlili" infoContent={growthInfo} />
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
      <PageHeader title="O'sish tahlili" infoTitle="O'sish tahlili" infoContent={growthInfo} />

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
          {/* Scores */}
          {scores && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-[13px] font-medium text-[#6B7A99] mb-3">Birinchi diagnostika</p>
                <p className="text-[32px] font-bold text-[#4D89FF]">{scores.first_diagnostic}%</p>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-[13px] font-medium text-[#6B7A99] mb-3">Choraklik imtihon</p>
                <p className="text-[32px] font-bold text-[#3DB87E]">{scores.quarterly_exam}%</p>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-[13px] font-medium text-[#6B7A99] mb-3">Oylik imtihon</p>
                <p className="text-[32px] font-bold text-[#F59E0B]">{scores.monthly_exam}%</p>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-[13px] font-medium text-[#6B7A99] mb-3">Past kategoriyalar</p>
                <p className="text-[32px] font-bold text-[#EF4444]">{scores.low_categories_count}</p>
              </div>
            </div>
          )}

          {/* Test Monitoring */}
          {monitoring.length > 0 && (
            <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
              <h3 className="text-[16px] font-bold text-[#2D3142] mb-6">Test monitoring</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {monitoring.map((m: any, i: number) => (
                  <div key={i} className="bg-[#F8F9FB] rounded-[16px] p-5 space-y-3">
                    <p className="text-[13px] font-bold text-[#2D3142]">{m.label}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#6B7A99]">Muvaffaqiyatli</span>
                        <span className="text-[12px] font-bold text-[#3DB87E]">{m.success}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#6B7A99]">Qisman</span>
                        <span className="text-[12px] font-bold text-[#F59E0B]">{m.partial}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#6B7A99]">Muvaffaqiyatsiz</span>
                        <span className="text-[12px] font-bold text-[#EF4444]">{m.fail}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                  <h3 className="text-[16px] font-bold text-[#2D3142] mb-6">Bo'limlar bo'yicha o'sish</h3>
                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={barData} margin={{ top: 20, right: 20, bottom: 0, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0F4F8" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9EB1D4", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="title" tick={{ fill: "#6B7A99", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={120} />
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

          {/* Batafsil taqqoslash */}
          {radarDetails.length > 0 && (
            <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
              <h3 className="text-[18px] font-bold text-[#2D3142] mb-8">Bo'limlar bo'yicha taqqoslash</h3>
              <div className="space-y-5">
                {radarDetails.map((item: any) => {
                  const current = item.current ?? 0;
                  const previous = item.previous ?? 0;
                  const change = item.change ?? 0;
                  const color = current >= 70 ? "bg-[#3DB87E]" : current >= 50 ? "bg-[#F59E0B]" : "bg-[#EF4444]";
                  return (
                    <div key={item.section_name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-bold text-[#2D3142]">{item.section_name}</span>
                        <div className="flex items-center gap-3 text-[13px]">
                          <span className="text-[#9EB1D4]">Oldingi: {previous}%</span>
                          <ArrowRight className="w-3 h-3 text-[#9EB1D4]" />
                          <span className="font-bold text-[#2D3142]">Hozirgi: {current}%</span>
                          <span className={cn(
                            "flex items-center gap-1 font-bold",
                            change > 0 ? "text-[#3DB87E]" : change < 0 ? "text-[#EF4444]" : "text-[#9EB1D4]"
                          )}>
                            {change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : change < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                            {change > 0 ? "+" : ""}{change}%
                          </span>
                        </div>
                      </div>
                      <div className="flex w-full h-8 overflow-hidden rounded-[8px] bg-gray-100">
                        <div style={{ width: `${Math.max(current, 2)}%` }} className={`${color} flex items-center justify-center transition-all`}>
                          {current > 5 && <span className="text-[11px] font-bold text-white">{current}%</span>}
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
