import { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  GraduationCap,
  TrendingUp,
  Brain,
  AlertTriangle,
  HeartHandshake,
  Plus,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { CustomSelect } from "@/components/ui/custom-select";
import { StatCard } from "./components/StatCard";
import { MonthCard } from "./components/MonthCard";
import { MonthlyPlanView } from "./components/MonthlyPlanView";
import { useChildren } from "@/hooks/admin/useChildren";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { useGroups } from "@/hooks/admin/useGroups";
import { useBilling } from "@/hooks/admin/useBilling";
import { usePlans } from "@/hooks/admin/usePlans";
import { useDiagnostics } from "@/hooks/admin/useDiagnostics";
import { useSessions } from "@/hooks/admin/useSessions";
import type { MonthData, MonthStatus, Category } from "./constantsData";
import { statusColors, categoryColors, statusProgressColors } from "./constantsData";

const TABS = ["Yillik reja", "Oylik reja"] as const;
type TabType = (typeof TABS)[number];

const MONTH_NAMES = [
  "", "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

function calcProgress(items: { current_score: number; target_score: number }[]): number {
  if (!items.length) return 0;
  const sum = items.reduce(
    (acc, it) => acc + (it.target_score > 0 ? (it.current_score / it.target_score) * 100 : 0),
    0
  );
  return Math.round(sum / items.length);
}

function progressToStatus(p: number): MonthStatus {
  if (p >= 65) return "Yaxshi";
  if (p >= 35) return "O'rta";
  return "Past";
}

export default function DashboardAdmin() {
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("Yillik reja");

  const { useChildrenList } = useChildren();
  const { useSpecialistsList } = useSpecialists();
  const { useGroupsList } = useGroups();
  const { useSubscriptionsList } = useBilling();
  const { useYearlyPlansList, useYearlyPlanDetail, useCreateYearlyPlan, useGenerateAiPlan } = usePlans();
  const { useResultsList } = useDiagnostics();
  const { useSessionsList } = useSessions();

  const { data: children, isLoading: isLoadingChildren } = useChildrenList();
  const { data: specialists, isLoading: isLoadingSpecialists } = useSpecialistsList();
  const { data: groups, isLoading: isLoadingGroups } = useGroupsList();
  const { data: subscriptions, isLoading: isLoadingSubs } = useSubscriptionsList();
  const { data: yearlyPlans, isLoading: isLoadingPlans } = useYearlyPlansList();
  const { data: diagnosticResults } = useResultsList();
  const { data: sessions } = useSessionsList();
  const createPlan = useCreateYearlyPlan();
  const generateAi = useGenerateAiPlan();

  const isLoading = isLoadingChildren || isLoadingSpecialists || isLoadingGroups || isLoadingSubs;

  // Calculate average growth % from diagnostic results
  const avgGrowthPercent = useMemo(() => {
    if (!diagnosticResults || diagnosticResults.length === 0) return 0;
    const totalScore = diagnosticResults.reduce((acc, result) => {
      const resultAvg = result.answers.length > 0
        ? result.answers.reduce((sum, a) => sum + a.score, 0) / result.answers.length
        : 0;
      return acc + resultAvg;
    }, 0);
    return Math.round((totalScore / diagnosticResults.length) * 100);
  }, [diagnosticResults]);

  // Calculate average mental age growth from diagnostics (score improvement)
  const mentalAgeGrowth = useMemo(() => {
    if (!diagnosticResults || diagnosticResults.length < 2) return "—";
    // Group by child, compare first vs last result
    const byChild = new Map<number, { first: number; last: number }>();
    diagnosticResults.forEach((r) => {
      const avg = r.answers.length > 0
        ? r.answers.reduce((s, a) => s + a.score, 0) / r.answers.length
        : 0;
      const existing = byChild.get(r.child);
      if (!existing) {
        byChild.set(r.child, { first: avg, last: avg });
      } else {
        existing.last = avg;
      }
    });
    let totalGrowth = 0;
    let count = 0;
    byChild.forEach(({ first, last }) => {
      if (first !== last) {
        totalGrowth += (last - first) * 12; // convert to months approximation
        count++;
      }
    });
    if (count === 0) return "0 oy";
    return `${(totalGrowth / count).toFixed(1)} oy`;
  }, [diagnosticResults]);

  // Calculate parent activity from sessions (attended sessions / total)
  const parentActivity = useMemo(() => {
    if (!sessions || sessions.length === 0) return 0;
    const completed = sessions.filter((s) => s.ended_at).length;
    return Math.round((completed / sessions.length) * 100);
  }, [sessions]);

  const groupOptions = useMemo(() => {
    if (!groups) return [];
    return groups.map((g) => ({ label: g.name, value: g.id.toString() }));
  }, [groups]);

  // Find yearly plan for selected group
  const activePlanListItem = useMemo(() => {
    if (!yearlyPlans || !selectedGroupId) return null;
    return yearlyPlans.find((p) => p.group.toString() === selectedGroupId) || null;
  }, [yearlyPlans, selectedGroupId]);

  // Fetch full plan detail with monthly goals
  const { data: yearlyPlan, isLoading: isLoadingDetail } = useYearlyPlanDetail(activePlanListItem?.id ?? 0);

  const currentMonthNum = new Date().getMonth() + 1;

  // Build 12-month cards from real API data
  const monthCardsFromAPI: MonthData[] = useMemo(() => {
    if (!yearlyPlan?.monthly_goals) return [];
    return yearlyPlan.monthly_goals.map((goal) => {
      const progress = calcProgress(goal.items);
      const primarySection = goal.items[0]?.section_name ?? "Diqqat";
      return {
        month: MONTH_NAMES[goal.month_number] ?? `Oy ${goal.month_number}`,
        status: progressToStatus(progress),
        category: primarySection as Category,
        progress,
        tasks: goal.items.slice(0, 3).map((i) => i.exercise_name),
        isActive: goal.month_number === currentMonthNum,
      };
    });
  }, [yearlyPlan, currentMonthNum]);

  // Current month goal for Oylik reja tab
  const currentMonthGoal = yearlyPlan?.monthly_goals?.find(
    (g) => g.month_number === currentMonthNum
  );

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
      value: String(children?.length || 0),
      icon: Users,
      trend: { value: "+12%", isPositive: true, text: "o'tgan oyga nisbatan" },
      iconBgColor: "bg-[#EEF4FF]",
      iconColor: "text-[#4D89FF]",
    },
    {
      title: "Mutaxassislar",
      value: String(specialists?.length || 0),
      icon: UserPlus,
      trend: { value: "Jami", isPositive: true, text: "" },
      iconBgColor: "bg-[#EEF4FF]",
      iconColor: "text-[#4D89FF]",
    },
    {
      title: "Guruhlar",
      value: String(groups?.length || 0),
      icon: GraduationCap,
      trend: { value: "Faol", isPositive: true, text: "" },
      iconBgColor: "bg-[#EEF4FF]",
      iconColor: "text-[#4D89FF]",
    },
    {
      title: "O'rtacha o'sish %",
      value: `${avgGrowthPercent}%`,
      icon: TrendingUp,
      trend: { value: avgGrowthPercent > 0 ? "Diagnostika asosida" : "Ma'lumot yo'q", isPositive: avgGrowthPercent > 50, text: "" },
      iconBgColor: "bg-[#EEF4FF]",
      iconColor: "text-[#4D89FF]",
    },
    {
      title: "Aqliy yosh o'sishi",
      value: mentalAgeGrowth,
      icon: Brain,
      trend: { value: "O'rtacha oshish", isPositive: true, text: "" },
      iconBgColor: "bg-[#EEF4FF]",
      iconColor: "text-[#4D89FF]",
    },
    {
      title: "Qarzdorlar",
      value: String(
        (Array.isArray(subscriptions) ? subscriptions : []).filter((s) => !s.is_active).length || 0
      ),
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Plan Section */}
      <div className="flex flex-col gap-4 mt-8 mb-6 relative">
        <h2 className="text-xl font-bold text-[#2D3142]">Guruh bo'yicha reja nazorati</h2>

        <div className="w-full flex bg-white p-6 rounded-[16px] justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="min-w-[200px]">
              <CustomSelect
                options={groupOptions}
                value={selectedGroupId}
                onChange={(val) => setSelectedGroupId(val.toString())}
                placeholder="Guruh tanlang..."
              />
            </div>
          </div>

          <div className="bg-[#F5F8FF] p-1 rounded-xl flex items-center">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 lg:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-white text-[#2D3142] shadow-sm"
                    : "text-[#9EB1D4] hover:text-[#2D3142]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Content */}
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
              <button
                onClick={() =>
                  createPlan.mutate({
                    group: Number(selectedGroupId),
                    start_date: `${new Date().getFullYear()}-01-01`,
                  })
                }
                disabled={createPlan.isPending}
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-[12px] text-[14px] font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                {createPlan.isPending ? "Yaratilmoqda..." : "Yillik reja yaratish"}
              </button>
            </div>
          )}

          {selectedGroupId && activePlanListItem && !isLoadingDetail && yearlyPlan && (
            <>
              {/* Plan info bar */}
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[14px] font-medium text-[#6B7A99]">
                    Guruh: <span className="font-bold text-[#2D3142]">{yearlyPlan.group_name}</span>
                    {"  "}· Boshlanish: <span className="font-bold text-[#2D3142]">{yearlyPlan.start_date}</span>
                  </p>
                  {yearlyPlan.ai_summary && (
                    <p className="text-[12px] text-[#9EB1D4] mt-1 max-w-[600px] line-clamp-2">
                      {yearlyPlan.ai_summary}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => generateAi.mutate({ id: yearlyPlan.id, group: yearlyPlan.group, start_date: yearlyPlan.start_date })}
                  disabled={generateAi.isPending}
                  className="flex items-center gap-2 h-10 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[12px] font-bold rounded-xl transition-colors disabled:opacity-60"
                >
                  {generateAi.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  {generateAi.isPending ? "Generatsiya..." : "AI reja generatsiya"}
                </button>
              </div>

              {/* 12-month cards from API */}
              {monthCardsFromAPI.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
                  {monthCardsFromAPI.map((data, i) => (
                    <MonthCard key={i} data={data} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-white rounded-[24px] border border-dashed border-gray-200 mt-4 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-bold text-[#2D3142] text-[15px]">Oylik maqsadlar hali yaratilmagan</p>
                    <p className="text-[13px] text-[#9EB1D4] mt-1">
                      AI orqali 12 oylik reja generatsiya qiling
                    </p>
                  </div>
                  <button
                    onClick={() => generateAi.mutate({ id: yearlyPlan.id, group: yearlyPlan.group, start_date: yearlyPlan.start_date })}
                    disabled={generateAi.isPending}
                    className="flex items-center gap-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI reja yaratish
                  </button>
                </div>
              )}

              {/* Child Recommendations */}
              {yearlyPlan.child_recommendations?.length > 0 && (
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 mt-6">
                  <h3 className="text-[16px] font-bold text-[#2D3142] mb-4">
                    Individual tavsiyalar ({yearlyPlan.child_recommendations.length} ta bola)
                  </h3>
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
        <MonthlyPlanView
          monthlyGoal={currentMonthGoal ?? null}
          monthName={MONTH_NAMES[currentMonthNum]}
          planId={yearlyPlan?.id ?? null}
        />
      )}
    </div>
  );
}
