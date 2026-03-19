import { useMemo } from "react";
import { useBilling } from "@/hooks/admin/useBilling";

const MONTH_NAMES = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

export const useFinancePage = () => {
  const { usePaymentsList, usePlansList, useSubscriptionsList } = useBilling();
  const { data: payments, isLoading: isLoadingPayments } = usePaymentsList();
  const { data: plans, isLoading: isLoadingPlans } = usePlansList();
  const { data: subscriptions, isLoading: isLoadingSubs } = useSubscriptionsList();

  const isLoading = isLoadingPayments || isLoadingPlans || isLoadingSubs;

  const totalIncome = useMemo(() => {
    if (!payments) return 0;
    return payments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
  }, [payments]);

  const activeSubsCount = useMemo(() => {
    if (!subscriptions) return 0;
    return subscriptions.filter((s) => s.is_active).length;
  }, [subscriptions]);

  const chartData = useMemo(() => {
    if (!payments) return [];

    const now = new Date();
    const result: { name: string; month: number; year: number; yengil: number; standart: number; individual: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push({
        name: MONTH_NAMES[d.getMonth()],
        month: d.getMonth(),
        year: d.getFullYear(),
        yengil: 0,
        standart: 0,
        individual: 0,
      });
    }

    payments.forEach((p) => {
      const pDate = new Date(p.payment_date);
      const entry = result.find((r) => r.month === pDate.getMonth() && r.year === pDate.getFullYear());
      if (entry) {
        const amount = parseFloat(p.amount) / 1000000;
        const planName = p.plan_name?.toLowerCase() || "";

        if (planName.includes("yengil")) entry.yengil += amount;
        else if (planName.includes("individual")) entry.individual += amount;
        else entry.standart += amount;
      }
    });

    return result;
  }, [payments]);

  const incomeHealth = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) return 0;
    const active = subscriptions.filter((s) => s.is_active).length;
    return Math.round((active / subscriptions.length) * 100);
  }, [subscriptions]);

  return {
    isLoading,
    payments,
    plans,
    subscriptions,
    totalIncome,
    activeSubsCount,
    chartData,
    incomeHealth,
  };
};
