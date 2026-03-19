import { useState } from "react";
import { Loader2, MinusCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BillingAPI } from "@/api/billing.api";
import { toast } from "sonner";
import type { Subscription } from "@/types/billing.types";

interface PaymentHistoryTableProps {
  data: Subscription[];
}

export function PaymentHistoryTable({ data }: PaymentHistoryTableProps) {
  const queryClient = useQueryClient();
  const [deductingId, setDeductingId] = useState<number | null>(null);

  const { mutate: deductBalance, isPending } = useMutation({
    mutationFn: (id: number) => BillingAPI.deductFromBalance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Balansdan yechildi");
      setDeductingId(null);
    },
    onError: () => {
      toast.error("Balansdan yechishda xatolik");
      setDeductingId(null);
    },
  });

  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
      <h3 className="text-[16px] font-bold text-[#2D3142] mb-6">To'lov jurnali</h3>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 pb-4 border-b border-gray-100 mb-2">
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Bola</div>
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Tarif</div>
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Balans</div>
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Oxirgi To'lov</div>
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Holat</div>
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Amal</div>
          </div>

          {/* Table Body */}
          <div>
            {data.map((item) => {
              const isPaid = item.is_active;
              const isDeducting = isPending && deductingId === item.id;
              return (
                <div key={item.id} className={`grid grid-cols-6 gap-4 items-center p-4 rounded-[12px] ${!isPaid ? 'bg-[#FFF5F5]' : ''}`}>
                  <div className="text-[14px] font-medium text-[#2D3142]">{item.child_fio}</div>
                  <div className="text-[14px] font-medium text-[#2D3142]">{item.plan_name}</div>
                  <div className="text-[14px] font-bold text-[#2D3142]">
                    {parseInt(item.balance).toLocaleString()} UZS
                  </div>
                  <div className="text-[14px] text-[#6B7A99]">{item.last_payment_date || "—"}</div>
                  <div>
                    <span className={`inline-flex items-center justify-center px-4 py-1 text-[12px] font-bold rounded-full ${
                      isPaid ? "bg-[#E8FFF3] text-[#3DB87E]" : "bg-[#FFE8E8] text-[#EF4444]"
                    }`}>
                      {isPaid ? "Faol" : "Muddati o'tgan"}
                    </span>
                  </div>
                  <div>
                    {isPaid && (
                      <button
                        onClick={() => {
                          setDeductingId(item.id);
                          deductBalance(item.id);
                        }}
                        disabled={isDeducting}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Balansdan yechish"
                      >
                        {isDeducting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <MinusCircle className="w-3.5 h-3.5" />
                        )}
                        Yechish
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
