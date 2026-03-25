import { useState } from "react";
import { Plus, X, Calendar } from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import { useBilling } from "@/hooks/admin/useBilling";
import type { PaymentStub } from "@/types/children.types";

interface PaymentsHistoryTabProps {
  childId: number;
  payments: PaymentStub[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  paid: { label: "To'langan", color: "bg-[#E8FFF3] text-[#3DB87E]" },
  pending: { label: "Kutilmoqda", color: "bg-amber-50 text-amber-600" },
  failed: { label: "Rad etilgan", color: "bg-red-50 text-red-500" },
};

const METHOD_MAP: Record<string, string> = { cash: "Naqd", card: "Karta", payme: "Payme", click: "Click" };

export default function PaymentsHistoryTab({ childId, payments }: PaymentsHistoryTabProps) {
  const { useCreatePayment } = useBilling();
  const createPayment = useCreatePayment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    payment_date: new Date().toISOString().split("T")[0],
    amount: "",
    payment_type: "Oylik to'lov",
    method: "cash" as "cash" | "card" | "payme" | "click",
    notes: "",
  });

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + parseFloat(p.amount || "0"), 0);

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + parseFloat(p.amount || "0"), 0);

  const resetForm = () =>
    setForm({ payment_date: new Date().toISOString().split("T")[0], amount: "", payment_type: "Oylik to'lov", method: "cash", notes: "" });

  const handleCreate = () => {
    if (!form.amount) return;
    createPayment.mutate(
      { child: childId, amount: form.amount, method: form.method, status: "paid", plan: null },
      { onSuccess: () => { setIsModalOpen(false); resetForm(); } }
    );
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#E8FFF3] rounded-[20px] p-5">
          <p className="text-[12px] text-[#3DB87E] font-medium mb-1">Jami to'langan</p>
          <p className="text-[20px] font-bold text-[#2D3142]">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-amber-50 rounded-[20px] p-5">
          <p className="text-[12px] text-amber-600 font-medium mb-1">Kutilmoqda</p>
          <p className="text-[20px] font-bold text-[#2D3142]">{formatCurrency(totalPending)}</p>
        </div>
        <div className="bg-[#F0F5FF] rounded-[20px] p-5">
          <p className="text-[12px] text-[#4D89FF] font-medium mb-1">Jami to'lovlar soni</p>
          <p className="text-[20px] font-bold text-[#2D3142]">{payments.length} ta</p>
        </div>
      </div>

      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-[12px] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi to'lov
        </button>
      </div>

      {/* Table */}
      {payments.length === 0 ? (
        <div className="py-14 text-center bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-[#9EB1D4] font-medium">To'lovlar mavjud emas</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50/50">
                <tr>
                  {["Sana", "Turi", "Summa", "To'lov usuli", "Izoh", "Holati"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-[#9EB1D4] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => {
                  const status = STATUS_CONFIG[p.status ?? "paid"] ?? STATUS_CONFIG.paid;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#9EB1D4]" />
                          <span className="text-[13px] font-medium text-[#2D3142]">{formatDate(p.payment_date)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-[#2D3142]">Oylik to'lov</td>
                      <td className="px-5 py-3 text-[13px] font-bold text-[#2D3142]">{formatCurrency(p.amount)}</td>
                      <td className="px-5 py-3 text-[13px] text-[#9EB1D4]">{METHOD_MAP[p.method] ?? p.method}</td>
                      <td className="px-5 py-3 text-[13px] text-[#9EB1D4]">—</td>
                      <td className="px-5 py-3">
                        <span className={cn("px-3 py-1 rounded-full text-[11px] font-bold", status.color)}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[24px] w-full max-w-[400px] p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-[#2D3142]">Yangi to'lov qo'shish</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-4 h-4 text-[#9EB1D4]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Sana</label>
                <input
                  type="date"
                  value={form.payment_date}
                  onChange={(e) => setForm((p) => ({ ...p, payment_date: e.target.value }))}
                  className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Summa (so'm)</label>
                <input
                  type="number"
                  placeholder="1 500 000"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">To'lov turi</label>
                <select
                  value={form.payment_type}
                  onChange={(e) => setForm((p) => ({ ...p, payment_type: e.target.value }))}
                  className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] transition-colors"
                >
                  <option>Oylik to'lov</option>
                  <option>Qo'shimcha mashg'ulot</option>
                  <option>Konsultatsiya</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">To'lov usuli</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["cash", "card", "payme", "click"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, method: m }))}
                      className={cn(
                        "h-[42px] rounded-[10px] border-2 text-[13px] font-bold transition-all",
                        form.method === m ? "border-[#4D89FF] bg-[#F0F5FF] text-[#4D89FF]" : "border-gray-100 text-[#9EB1D4]"
                      )}
                    >
                      {METHOD_MAP[m]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#2D3142] mb-2">Izoh</label>
                <input
                  type="text"
                  placeholder="Izoh yo'ldagi..."
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={!form.amount || createPayment.isPending}
              className="w-full mt-6 h-[48px] rounded-[14px] bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold transition-colors disabled:opacity-50"
            >
              {createPayment.isPending ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
