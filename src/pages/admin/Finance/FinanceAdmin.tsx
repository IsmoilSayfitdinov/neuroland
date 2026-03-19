import { Wallet, TrendingUp, PieChart, HeartPulse } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { FinanceChart } from "./components/FinanceChart";
import { PaymentHistoryTable } from "./components/PaymentHistoryTable";
import { cn } from "@/lib/utils";
import { useFinancePage } from "@/hooks/admin/useFinancePage";
import { Skeleton } from "@/components/admin/ui/Skeleton";

export default function FinanceAdmin() {
  const { isLoading, plans, subscriptions, totalIncome, activeSubsCount, chartData, incomeHealth } = useFinancePage();

  if (isLoading) {
    return (
      <div className="mx-auto pb-10 space-y-6">
        <PageHeader title="Moliya" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-8 w-[160px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
          <Skeleton className="h-5 w-[140px]" />
          <Skeleton className="h-[280px] w-full rounded-[16px]" />
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
          <Skeleton className="h-5 w-[180px]" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-[12px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      <PageHeader title="Moliya" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Jami tushum"
          value={`${(totalIncome / 1000000).toFixed(1)}M UZS`}
          subtitle="Barcha vaqtlar"
          icon={Wallet}
        />

        <StatCard
          title="Prognoz (Keyingi oy)"
          value={`${((totalIncome * 1.1) / 1000000).toFixed(1)}M UZS`}
          subtitle="Kutilayotgan"
          subtitleColor="text-[#9EB1D4]"
          icon={TrendingUp}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Faol obunalar"
            value={`${activeSubsCount} ta`}
            subtitle={`${plans?.length || 0} ta tarif`}
            subtitleColor="text-[#9EB1D4]"
            icon={PieChart}
            className="p-6"
          />

          <StatCard
            title="Daromad salomatligi"
            value={`${incomeHealth}%`}
            subtitle={incomeHealth > 80 ? "Yaxshi" : "O'rtacha"}
            icon={HeartPulse}
            className="p-6"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans?.slice(0, 3).map((plan, idx) => (
          <div
            key={plan.id}
            className={cn(
              "p-6 rounded-[16px]",
              idx === 0 ? "bg-[#EEF4FF]" : idx === 1 ? "bg-[#E8F8F0]" : "bg-[#FFF4E5]"
            )}
          >
            <h3 className="text-[16px] font-bold text-[#2D3142] mb-1">{plan.name}</h3>
            <p className="text-[13px] text-[#2D3142]/60 mb-3">{plan.sessions_per_week} kun/hafta</p>
            <p className="text-[20px] font-bold text-[#2D3142]">{parseInt(plan.price).toLocaleString()} UZS</p>
          </div>
        ))}
      </div>

      <FinanceChart data={chartData} />

      <PaymentHistoryTable data={subscriptions || []} />
    </div>
  );
}
