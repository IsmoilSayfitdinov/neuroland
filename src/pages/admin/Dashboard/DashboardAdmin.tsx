import {
  Users, UserPlus, GraduationCap, TrendingUp, Brain,
  AlertTriangle, HeartHandshake, Plus, Sparkles, Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { CustomSelect } from "@/components/ui/custom-select";
import { StatCard } from "./components/StatCard";
import { MonthCard } from "./components/MonthCard";
import { MonthlyPlanView } from "./components/MonthlyPlanView";
import { useDashboardAdminPage } from "@/hooks/admin/useDashboardAdminPage";

const TABS = ["Yillik reja", "Oylik reja"] as const;

export default function DashboardAdmin() {
  const {
    isLoading,
    isLoadingPlans,
    isLoadingDetail,
    activeChildren,
    newThisMonth,
    avgPercent,
    mentalAge,
    parentActivity,
    dashboard,
    groupOptions,
    selectedGroupId,
    setSelectedGroupId,
    activeTab,
    setActiveTab,
    activePlanListItem,
    yearlyPlan,
    monthCardsFromAPI,
    currentMonthGoal,
    currentMonthNum,
    createPlan,
    generateAi,
    MONTH_NAMES,
  } = useDashboardAdminPage();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-10 w-10 rounded-[12px]" />
              </div>
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-3 w-[140px]" />
            </div>
          ))}
        </div>
        <Skeleton className="h-[200px] w-full rounded-[24px]" />
      </div>
    );
  }

  const stats = [
    {
      title: "Faol bolalar",
      value: String(activeChildren?.count ?? 0),
      icon: Users,
      trend: { value: `${(activeChildren?.growth_percent ?? 0) >= 0 ? "+" : ""}${activeChildren?.growth_percent ?? 0}%`, isPositive: (activeChildren?.growth_percent ?? 0) >= 0, text: "o'tgan oyga nisbatan" },
      iconBgColor: "bg-[#EEF4FF]",
      iconColor: "text-[#4D89FF]",
    },
    {
      title: "Yangi (shu oy)",
      value: String(newThisMonth?.count ?? 0),
      icon: UserPlus,
      trend: { value: `O'tgan oy: ${newThisMonth?.prev_month_count ?? 0}`, isPositive: (newThisMonth?.count ?? 0) >= (newThisMonth?.prev_month_count ?? 0), text: "" },
      iconBgColor: "bg-[#EEF4FF]",
      iconColor: "text-[#4D89FF]",
    },
    {
      title: "Bitiruvchilar (yil)",
      value: String(dashboard?.completed_this_year ?? 0),
      icon: GraduationCap,
      trend: { value: "Shu yil", isPositive: true, text: "" },
      iconBgColor: "bg-[#EEF4FF]",
      iconColor: "text-[#4D89FF]",
    },
    {
      title: "O'rtacha o'sish %",
      value: `${avgPercent}%`,
      icon: TrendingUp,
      trend: { value: avgPercent > 0 ? "Diagnostika asosida" : "Ma'lumot yo'q", isPositive: avgPercent > 50, text: "" },
      iconBgColor: "bg-[#EEF4FF]",
      iconColor: "text-[#4D89FF]",
    },
    {
      title: "Aqliy yosh o'sishi",
      value: mentalAge ? `${mentalAge} oy` : "—",
      icon: Brain,
      trend: { value: "O'rtacha oshish", isPositive: true, text: "" },
      iconBgColor: "bg-[#EEF4FF]",
      iconColor: "text-[#4D89FF]",
    },
    {
      title: "Qarzdorlar",
      value: String(dashboard?.debtors_count ?? 0),
      icon: AlertTriangle,
      trend: { value: "Tolov kutilmoqda", isWarning: true, isPositive: false, text: "" },
      iconBgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "Ota-onalar faolligi",
      value: `${parentActivity}%`,
      icon: HeartHandshake,
      trend: { value: parentActivity > 0 ? "Seanslar asosida" : "Ma'lumot yo'q", isPositive: parentActivity > 50, text: "" },
      iconBgColor: "bg-[#EEF4FF]",
      iconColor: "text-[#4D89FF]",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-bold text-[#2D3142]">Bosh sahifa</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      {/* Plan Section */}
      <div className="flex flex-col gap-4 mt-8 mb-6 relative">
        <h2 className="text-xl font-bold text-[#2D3142]">Guruh bo'yicha reja nazorati</h2>
        <div className="w-full flex bg-white p-6 rounded-[16px] justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="min-w-[200px]">
              <CustomSelect options={groupOptions} value={selectedGroupId} onChange={(val) => setSelectedGroupId(val.toString())} placeholder="Guruh tanlang..." />
            </div>
          </div>
          <div className="bg-[#F5F8FF] p-1 rounded-xl flex items-center">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 lg:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? "bg-white text-[#2D3142] shadow-sm" : "text-[#9EB1D4] hover:text-[#2D3142]"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === "Yillik reja" && (
        <>
          {!selectedGroupId && (
            <div className="py-16 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
              <p className="text-[#9EB1D4] font-medium">Guruhni tanlang</p>
            </div>
          )}

          {selectedGroupId && (isLoadingPlans || isLoadingDetail) && (
            <div className="py-16 flex items-center justify-center bg-white rounded-[24px] border border-gray-100">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          )}

          {selectedGroupId && !isLoadingPlans && !isLoadingDetail && !activePlanListItem && (
            <div className="py-16 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
              <p className="text-[#9EB1D4] font-medium mb-4">Bu guruh uchun yillik reja mavjud emas</p>
              <button onClick={() => createPlan.mutate({ group: Number(selectedGroupId), start_date: `${new Date().getFullYear()}-01-01` })}
                disabled={createPlan.isPending}
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-[12px] text-[14px] font-bold transition-colors">
                <Plus className="w-4 h-4" />{createPlan.isPending ? "Yaratilmoqda..." : "Yillik reja yaratish"}
              </button>
            </div>
          )}

          {selectedGroupId && activePlanListItem && !isLoadingDetail && yearlyPlan && (
            <>
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[14px] font-medium text-[#6B7A99]">
                    Guruh: <span className="font-bold text-[#2D3142]">{yearlyPlan.group_name}</span>
                    {"  "}· Boshlanish: <span className="font-bold text-[#2D3142]">{yearlyPlan.start_date}</span>
                  </p>
                  {yearlyPlan.ai_summary && (
                    <p className="text-[12px] text-[#9EB1D4] mt-1 max-w-[600px] line-clamp-2">{yearlyPlan.ai_summary}</p>
                  )}
                </div>
                <button onClick={() => generateAi.mutate({ id: yearlyPlan.id, group: yearlyPlan.group, start_date: yearlyPlan.start_date })}
                  disabled={generateAi.isPending}
                  className="flex items-center gap-2 h-10 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[12px] font-bold rounded-xl transition-colors disabled:opacity-60">
                  {generateAi.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {generateAi.isPending ? "Generatsiya..." : "AI reja generatsiya"}
                </button>
              </div>

              {monthCardsFromAPI.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
                  {monthCardsFromAPI.map((data, i) => <MonthCard key={i} data={data} />)}
                </div>
              ) : (
                <div className="py-16 text-center bg-white rounded-[24px] border border-dashed border-gray-200 mt-4 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-bold text-[#2D3142] text-[15px]">Oylik maqsadlar hali yaratilmagan</p>
                    <p className="text-[13px] text-[#9EB1D4] mt-1">AI orqali 12 oylik reja generatsiya qiling</p>
                  </div>
                  <button onClick={() => generateAi.mutate({ id: yearlyPlan.id, group: yearlyPlan.group, start_date: yearlyPlan.start_date })}
                    disabled={generateAi.isPending}
                    className="flex items-center gap-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors">
                    <Sparkles className="w-4 h-4" />AI reja yaratish
                  </button>
                </div>
              )}

              {yearlyPlan.child_recommendations?.length > 0 && (
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 mt-6">
                  <h3 className="text-[16px] font-bold text-[#2D3142] mb-4">Individual tavsiyalar ({yearlyPlan.child_recommendations.length} ta bola)</h3>
                  <div className="space-y-3">
                    {yearlyPlan.child_recommendations.map((rec) => (
                      <div key={rec.id} className="bg-[#F8F9FB] rounded-[16px] p-4">
                        <p className="text-[13px] font-bold text-[#2D3142] mb-1">{rec.child_name}</p>
                        <p className="text-[12px] text-[#6B7A99] leading-relaxed">{rec.ai_notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === "Oylik reja" && (
        <MonthlyPlanView monthlyGoal={currentMonthGoal ?? null} monthName={MONTH_NAMES[currentMonthNum]} planId={yearlyPlan?.id ?? null} />
      )}
    </div>
  );
}
