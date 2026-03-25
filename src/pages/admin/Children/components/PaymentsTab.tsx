import { useState } from "react";
import type { ChildDetailOut } from "@/types/children.types";
import { CreditCard, Plus, X, Calendar, Wallet, Loader2 } from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import { useBilling } from "@/hooks/admin/useBilling";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";

interface PaymentsTabProps {
  child: ChildDetailOut;
}

const METHOD_OPTIONS = [
  { label: "Naqd", value: "cash" },
  { label: "Karta", value: "card" },
  { label: "Pul o'tkazma", value: "transfer" },
] as const;

const METHOD_MAP: Record<string, string> = {
  cash: "Naqd", card: "Karta", transfer: "Pul o'tkazma", payme: "Payme", click: "Click",
};

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  paid:    { label: "To'langan",       cls: "bg-emerald-50 text-emerald-600" },
  pending: { label: "Kutilmoqda",      cls: "bg-amber-50 text-amber-600" },
  failed:  { label: "Muvaffaqiyatsiz", cls: "bg-red-50 text-red-500" },
};

export function PaymentsTab({ child }: PaymentsTabProps) {
  const {
    useDeletePayment, useCreatePayment, usePlansList, usePaymentsList, useSubscriptionsList,
  } = useBilling();
  const deleteMutation = useDeletePayment();
  const createMutation = useCreatePayment();
  const { data: plans } = usePlansList();
  const { data: allPayments } = usePaymentsList();
  const { data: allSubscriptions } = useSubscriptionsList();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    plan: "",
    method: "cash" as string,
    payment_date: new Date().toISOString().split("T")[0],
    note: "",
  });

  // This child's data
  const payments = (allPayments ?? []).filter((p) => p.child === child.id);
  const subscription = (allSubscriptions ?? []).find((s) => s.child === child.id);
  const totalPaid = payments.reduce((s, p) => s + parseFloat(p.amount || "0"), 0);

  const resetForm = () =>
    setForm({ amount: "", plan: "", method: "cash", payment_date: new Date().toISOString().split("T")[0], note: "" });

  const handleCreate = () => {
    if (!form.amount) return;
    createMutation.mutate(
      {
        child: child.id,
        amount: form.amount,
        plan: form.plan ? Number(form.plan) : null,
        method: form.method as any,
        status: "pending" as const,
      },
      { onSuccess: () => { setIsModalOpen(false); resetForm(); } }
    );
  };

  const handlePlanChange = (planId: string) => {
    setForm((prev) => {
      const selected = plans?.find((p) => p.id === Number(planId));
      return { ...prev, plan: planId, amount: selected ? selected.price : prev.amount };
    });
  };

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-50 rounded-2xl px-6 py-5 border border-emerald-100">
          <p className="text-[12px] text-emerald-600 font-medium mb-1">Jami to'langan</p>
          <p className="text-[22px] font-bold text-emerald-700">{formatCurrency(String(totalPaid))}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl px-6 py-5 border border-blue-100">
          <p className="text-[12px] text-blue-500 font-medium mb-1">To'lovlar soni</p>
          <p className="text-[22px] font-bold text-blue-600">{payments.length} ta</p>
        </div>
        {subscription && (
          <>
            <div className="bg-purple-50 rounded-2xl px-6 py-5 border border-purple-100">
              <p className="text-[12px] text-purple-600 font-medium mb-1">Balans</p>
              <p className="text-[22px] font-bold text-purple-700">{formatCurrency(subscription.balance)}</p>
            </div>
            <div className={cn("rounded-2xl px-6 py-5 border", subscription.is_active ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100")}>
              <p className={cn("text-[12px] font-medium mb-1", subscription.is_active ? "text-emerald-600" : "text-red-500")}>Obuna holati</p>
              <p className={cn("text-[16px] font-bold", subscription.is_active ? "text-emerald-700" : "text-red-600")}>
                {subscription.is_active ? "Faol" : "Nofaol"}
              </p>
              {subscription.next_payment_date && (
                <p className="text-[11px] text-gray-500 mt-1">Keyingi: {formatDate(subscription.next_payment_date)}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-[#2D3142] text-[14px]">To'lov tarixi</h3>
          </div>
          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-[10px] transition-colors">
            <Plus className="w-3.5 h-3.5" />
            To'lov qo'shish
          </button>
        </div>

        {payments.length === 0 ? (
          <div className="py-14 text-center">
            <Wallet className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-[#9EB1D4] text-[13px]">Hali to'lovlar mavjud emas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {["Sana", "Tarif", "Summa", "Usul", "Izoh", "Holat", ""].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-left text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const st = STATUS_CFG[p.status ?? "paid"] ?? STATUS_CFG.paid;
                  return (
                    <tr key={p.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 group transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 text-[13px] text-[#2D3142]">
                          <Calendar className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                          {formatDate(p.payment_date)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-[#2D3142]">
                        {p.plan_name || plans?.find((plan) => plan.id === p.plan)?.name || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] font-bold text-[#2D3142]">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-[#2D3142]">
                        {METHOD_MAP[p.method] ?? p.method}
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-[#9EB1D4] max-w-[150px] truncate">
                        {p.note || "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("text-[11px] font-bold px-3 py-1 rounded-full", st.cls)}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <button
                          onClick={() => deleteMutation.mutate(p.id)}
                          disabled={deleteMutation.isPending}
                          className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[24px] w-full max-w-[440px] p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-[#2D3142]">Yangi to'lov qo'shish</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-4 h-4 text-[#9EB1D4]" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tarif */}
              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Tarif</label>
                <CustomSelect
                  options={plans?.map((p) => ({ label: `${p.name} — ${formatCurrency(p.price)}`, value: p.id })) ?? []}
                  value={form.plan}
                  onChange={(val) => handlePlanChange(val.toString())}
                  placeholder="Tarif tanlang"
                />
              </div>

              {/* Summa */}
              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Summa (so'm)</label>
                <input type="number" placeholder="5000000" value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] transition-colors" />
              </div>

              {/* Sana */}
              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">To'lov sanasi</label>
                <CustomDatePicker
                  value={form.payment_date}
                  onChange={(v) => setForm((p) => ({ ...p, payment_date: v }))}
                  placeholder="Sanani tanlang"
                  className="bg-[#F8F9FB] border-none rounded-[12px]"
                />
              </div>

              {/* Usul */}
              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">To'lov usuli</label>
                <div className="grid grid-cols-3 gap-2">
                  {METHOD_OPTIONS.map((m) => (
                    <button key={m.value} type="button"
                      onClick={() => setForm((p) => ({ ...p, method: m.value }))}
                      className={cn("h-[42px] rounded-[10px] border-2 text-[13px] font-bold transition-all",
                        form.method === m.value ? "border-[#4D89FF] bg-[#F0F5FF] text-[#4D89FF]" : "border-gray-100 text-[#9EB1D4]")}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Izoh */}
              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Izoh (ixtiyoriy)</label>
                <input type="text" placeholder="Masalan: 2 oylik to'lov" value={form.note}
                  onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                  className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] transition-colors" />
              </div>
            </div>

            <button onClick={handleCreate}
              disabled={!form.amount || createMutation.isPending}
              className="w-full mt-6 h-[48px] rounded-[14px] bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {createMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saqlanmoqda...</> : "To'lovni saqlash"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
