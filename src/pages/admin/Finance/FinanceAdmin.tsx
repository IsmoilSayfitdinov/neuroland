import { Wallet, TrendingUp, PieChart, HeartPulse } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { FinanceChart } from "./components/FinanceChart";
import { PaymentHistoryTable } from "./components/PaymentHistoryTable";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/admin/useAnalytics";
import { Skeleton } from "@/components/admin/ui/Skeleton";

export default function FinanceAdmin() {
  const { useAdminFinance } = useAnalytics();
  const { data: finance, isLoading } = useAdminFinance();

  if (isLoading) {
    return (
      <div className="mx-auto pb-10 space-y-6">
        <PageHeader title="Moliya" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
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
      </div>
    );
  }

  const revenue = finance?.monthly_revenue ?? 0;
  const growthPercent = finance?.revenue_growth_percent ?? 0;
  const forecast = finance?.forecast ?? 0;

  return (
    <div className="mx-auto pb-10 space-y-6">
      <PageHeader title="Moliya" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Jami tushum"
          value={`${(revenue / 1_000_000).toFixed(1)}M`}
          subtitle={`${growthPercent >= 0 ? "+" : ""}${growthPercent}% o'sish`}
          subtitleColor={growthPercent >= 0 ? "text-[#3DB87E]" : "text-[#EF4444]"}
          icon={Wallet}
        />

        <StatCard
          title="Prognoz"
          value={forecast > 0 ? `${(forecast / 1_000_000).toFixed(1)}M` : "—"}
          subtitle="Keyingi oy"
          subtitleColor="text-[#9EB1D4]"
          icon={TrendingUp}
        />

        <StatCard
          title="Tariflar"
          value={`${finance?.tariff_count ?? 0} ta`}
          subtitle="Faol tariflar"
          subtitleColor="text-[#9EB1D4]"
          icon={PieChart}
        />

        <StatCard
          title="Daromad salomatligi"
          value={`${finance?.health_percent ?? 0}%`}
          subtitle={(finance?.health_percent ?? 0) >= 80 ? "Yaxshi" : "O'rtacha"}
          icon={HeartPulse}
        />
      </div>

      {/* Tariff cards */}
      {finance?.tariff_cards && finance.tariff_cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {finance.tariff_cards.map((card, idx) => (
            <div
              key={card.id}
              className={cn(
                "p-6 rounded-[16px]",
                idx === 0 ? "bg-[#EEF4FF]" : idx === 1 ? "bg-[#E8F8F0]" : "bg-[#FFF4E5]"
              )}
            >
              <h3 className="text-[16px] font-bold text-[#2D3142] mb-1">{card.name}</h3>
              <p className="text-[13px] text-[#2D3142]/60 mb-3">{card.sessions_per_week} kun/hafta · {card.subscribers_count} obunachi</p>
              <p className="text-[20px] font-bold text-[#2D3142]">{card.price.toLocaleString()} UZS</p>
            </div>
          ))}
        </div>
      )}

      {/* Trend chart */}
      {finance?.tariff_trend && finance.tariff_trend.length > 0 && (
        <FinanceChart data={finance.tariff_trend} />
      )}

      {/* Payment journal */}
      {finance?.payment_journal && finance.payment_journal.length > 0 && (
        <PaymentHistoryTable data={finance.payment_journal} />
      )}
    </div>
  );
}
