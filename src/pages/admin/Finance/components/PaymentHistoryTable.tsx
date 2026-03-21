import type { PaymentJournalEntry } from "@/types/analytics.types";
import { CreditCard, Banknote } from "lucide-react";

interface PaymentHistoryTableProps {
  data: PaymentJournalEntry[];
}

export function PaymentHistoryTable({ data }: PaymentHistoryTableProps) {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
      <h3 className="text-[16px] font-bold text-[#2D3142] mb-6">To'lov jurnali</h3>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 pb-4 border-b border-gray-100 mb-2">
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Bola</div>
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Ota-ona</div>
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Tarif</div>
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Summa</div>
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Sana</div>
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Holat</div>
            <div className="text-[12px] font-bold tracking-widest text-[#9EB1D4] uppercase">Usul</div>
          </div>

          {/* Table Body */}
          <div>
            {data.map((item) => {
              const isPaid = item.status === "paid";
              return (
                <div key={item.id} className={`grid grid-cols-7 gap-4 items-center p-4 rounded-[12px] ${!isPaid ? "bg-[#FFF5F5]" : ""}`}>
                  <div className="text-[14px] font-medium text-[#2D3142]">{item.child_name}</div>
                  <div className="text-[14px] text-[#6B7A99]">{item.parent_name}</div>
                  <div className="text-[14px] font-medium text-[#2D3142]">{item.plan_name}</div>
                  <div className="text-[14px] font-bold text-[#2D3142]">
                    {item.amount.toLocaleString()} UZS
                  </div>
                  <div className="text-[14px] text-[#6B7A99]">{item.payment_date}</div>
                  <div>
                    <span className={`inline-flex items-center justify-center px-4 py-1 text-[12px] font-bold rounded-full ${
                      isPaid ? "bg-[#E8FFF3] text-[#3DB87E]" : "bg-[#FFE8E8] text-[#EF4444]"
                    }`}>
                      {isPaid ? "To'langan" : "Kutilmoqda"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-[#6B7A99]">
                    {item.method === "card" ? (
                      <CreditCard className="w-3.5 h-3.5" />
                    ) : (
                      <Banknote className="w-3.5 h-3.5" />
                    )}
                    {item.method === "card" ? "Karta" : item.method === "cash" ? "Naqd" : item.method}
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
