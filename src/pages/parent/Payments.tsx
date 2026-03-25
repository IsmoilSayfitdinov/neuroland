import { CheckCircle2, Zap, Wallet, Calendar, Clock, Loader2, CreditCard } from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import { useMySubscription, useMyPayments, usePlans } from "@/hooks/parent/useMySubscription";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  paid: { label: "To'langan", color: "bg-green-50 text-green-600 ring-green-600/10" },
  pending: { label: "Kutilmoqda", color: "bg-yellow-50 text-yellow-600 ring-yellow-600/10" },
  failed: { label: "Xatolik", color: "bg-red-50 text-red-600 ring-red-600/10" },
};

const METHOD_MAP: Record<string, string> = {
  payme: "Payme",
  click: "Click",
  cash: "Naqd",
  card: "Karta",
};

export default function ParentPayments() {
  const { data: subscription, isLoading: subLoading } = useMySubscription();
  const { data: payments, isLoading: paymentsLoading } = useMyPayments();
  const { data: plans, isLoading: plansLoading } = usePlans();

  const isLoading = subLoading || plansLoading;

  const remainingDays = subscription?.remaining_days ?? 0;
  const totalDays = (() => {
    if (subscription?.last_payment_date && subscription?.next_payment_date) {
      const start = new Date(subscription.last_payment_date).getTime();
      const end = new Date(subscription.next_payment_date).getTime();
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 30;
    }
    return 30;
  })();
  const percentage = Math.max(0, Math.min(100, Math.round((remainingDays / totalDays) * 100)));

  return (
    <div className="mx-auto space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2D3142]">To'lovlar</h1>
        <p className="text-[#9EB1D4]">Obunangiz va to'lov holatini kuzating</p>
      </div>

      {/* Summary Card */}
      {isLoading ? (
        <div className="bg-white rounded-2xl md:rounded-[32px] p-8 shadow-sm border border-gray-50 flex items-center justify-center min-h-[160px]">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : !subscription ? (
        <div className="bg-white rounded-2xl md:rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-blue-300" />
          </div>
          <div className="text-center">
            <p className="font-bold text-[#2D3142] mb-1">Faol obuna topilmadi</p>
            <p className="text-sm text-gray-400">Quyidagi tariflardan birini tanlang</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl md:rounded-[32px] p-5 md:p-8 shadow-sm border border-gray-50">
          {/* Balance */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Joriy balans</p>
              <p className="text-3xl font-bold text-[#2D3142]">
                {formatCurrency(subscription.balance)}
              </p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400">Faol tarif</p>
                <p className="text-[13px] font-bold text-[#2D3142]">{subscription.plan_name}</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400">Oxirgi to'lov</p>
                <p className="text-[13px] font-bold text-[#2D3142]">{formatDate(subscription.last_payment_date)}</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400">Keyingi to'lov</p>
                <p className="text-[13px] font-bold text-[#2D3142]">{formatDate(subscription.next_payment_date)}</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-orange-400 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400">Qolgan kunlar</p>
                <p className={cn(
                  "text-[13px] font-bold",
                  remainingDays <= 7 ? "text-red-500" : "text-[#2D3142]"
                )}>
                  {remainingDays} kun
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium">Hisob-kitob davri</span>
              <span className="text-[#2D3142] font-bold">{remainingDays} kun qoldi</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400">Keyingi to'lovgacha {remainingDays} kun qoldi</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {subscription?.is_active && (
        <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-sm font-medium text-[#065F46]">
            To'lovingiz muvaffaqiyatli amalga oshirildi. Keyingi to'lovgacha{" "}
            <span className="font-bold">{remainingDays} kun</span> qoldi.
          </p>
        </div>
      )}

      {/* Tariffs */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#2D3142]">Tariflar</h2>
        {plansLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-[24px] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isActive = subscription?.plan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative p-6 rounded-[24px] bg-white border transition-all duration-200",
                    isActive
                      ? "border-blue-500 ring-1 ring-blue-500 shadow-md shadow-blue-500/10"
                      : "border-gray-100 hover:shadow-lg hover:shadow-blue-500/5"
                  )}
                >
                  {isActive && (
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-blue-50 rounded-full">
                      <span className="text-[11px] font-bold text-blue-600">Faol</span>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        isActive ? "bg-blue-50" : "bg-gray-50"
                      )}>
                        <Zap className={cn("w-5 h-5", isActive ? "text-blue-500" : "text-gray-400")} />
                      </div>
                      <h3 className="font-bold text-[#2D3142]">{plan.name}</h3>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-[#2D3142]">{formatCurrency(plan.price)}</span>
                        <span className="text-xs text-gray-400 font-medium">/ oy</span>
                      </div>
                      {plan.sessions_per_week && (
                        <p className="text-xs text-gray-400">{plan.sessions_per_week} ta seans</p>
                      )}
                      {plan.description && (
                        <p className="text-xs text-gray-500">{plan.description}</p>
                      )}
                    </div>

                    {isActive ? (
                      <div className="w-full py-2.5 rounded-xl text-sm font-bold text-center bg-blue-600 text-white shadow-sm shadow-blue-500/30">
                        Faol tarif
                      </div>
                    ) : (
                      <div className="w-full py-2.5 rounded-xl text-sm font-medium text-center bg-gray-50 border border-gray-200 text-[#9EB1D4]">
                        Admin orqali faollashtiring
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white rounded-[24px] border border-gray-100">
            <CreditCard className="w-8 h-8 text-gray-300" />
            <p className="text-sm text-gray-400 font-medium">Tariflar mavjud emas</p>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#2D3142]">To'lov tarixi</h2>
        {paymentsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : payments && payments.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-50 overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead className="bg-gray-50/50">
                <tr className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Sana</th>
                  <th className="px-6 py-4">Summa</th>
                  <th className="px-6 py-4">Holati</th>
                  <th className="px-6 py-4">To'lov usuli</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((item) => {
                  const statusInfo = STATUS_MAP[item.status ?? ""] ?? {
                    label: item.status ?? "—",
                    color: "bg-gray-50 text-gray-600 ring-gray-600/10",
                  };
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-[#2D3142]">{formatDate(item.payment_date)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#2D3142]">{formatCurrency(item.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ring-1 ring-inset",
                          statusInfo.color
                        )}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                        {METHOD_MAP[item.method] ?? item.method}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white rounded-[24px] border border-gray-50">
            <CreditCard className="w-8 h-8 text-gray-300" />
            <p className="text-sm text-gray-400 font-medium">To'lov tarixi mavjud emas</p>
          </div>
        )}
      </div>
    </div>
  );
}
