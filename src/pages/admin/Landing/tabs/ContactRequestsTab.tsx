import { useState } from "react";
import { useLanding } from "@/hooks/admin/useLanding";
import { Loader2, Trash2, Eye, Mail, MailOpen } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";

export function ContactRequestsTab() {
  const { useContactRequests, useContactRequestStats, useMarkContactRequestRead, useDeleteContactRequest } = useLanding();
  const { data: requests, isLoading } = useContactRequests();
  const { data: stats } = useContactRequestStats();
  const markReadMutation = useMarkContactRequestRead();
  const deleteMutation = useDeleteContactRequest();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#2D3142]">Kontakt so'rovlari</h3>
        {stats && (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#F8F9FB] rounded-full text-[12px] font-medium text-[#6B7A99]">
              Jami: {stats.total_requests}
            </span>
            {stats.unread_count > 0 && (
              <span className="px-3 py-1 bg-red-50 rounded-full text-[12px] font-medium text-red-500">
                O'qilmagan: {stats.unread_count}
              </span>
            )}
          </div>
        )}
      </div>

      {requests?.length === 0 ? (
        <p className="text-center text-[#9EB1D4] py-8">Hozircha so'rovlar yo'q</p>
      ) : (
        <div className="space-y-3">
          {requests?.map((req) => (
            <div
              key={req.id}
              className={`p-4 rounded-[14px] transition-colors ${req.is_read ? "bg-[#F8F9FB]" : "bg-blue-50/50 border border-blue-100"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${req.is_read ? "bg-gray-100 text-[#9EB1D4]" : "bg-[#2563EB] text-white"}`}>
                    {req.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold text-[#2D3142]">{req.name}</p>
                      {!req.is_read && <span className="px-1.5 py-0.5 bg-[#2563EB] text-white rounded text-[10px] font-bold">Yangi</span>}
                    </div>
                    <p className="text-[12px] text-[#9EB1D4]">
                      {req.phone}
                      {req.child_age && <> · Bola yoshi: {req.child_age}</>}
                    </p>
                    {req.message && <p className="text-[12px] text-[#9EB1D4] mt-1 line-clamp-2">{req.message}</p>}
                    <p className="text-[11px] text-[#9EB1D4] mt-2">{new Date(req.created_at).toLocaleDateString("uz-UZ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!req.is_read && (
                    <button
                      onClick={() => markReadMutation.mutate(req.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-[#4D89FF] hover:bg-blue-50"
                      title="O'qilgan deb belgilash"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteId(req.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }} title="So'rovni o'chirish" description="Ushbu so'rovni o'chirishni xohlaysizmi?" isLoading={deleteMutation.isPending} />
    </div>
  );
}
