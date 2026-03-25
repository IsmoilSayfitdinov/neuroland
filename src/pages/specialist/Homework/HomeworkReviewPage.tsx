import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronLeft, Loader2, CheckCircle2, XCircle, Clock,
  FileText, ExternalLink, Plus, AlertCircle, Eye,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGroups } from "@/hooks/admin/useGroups";
import { SessionsAPI } from "@/api/sessions.api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { HomeTask, HomeTaskStatus } from "@/types/session.types";

const STATUS_LABELS: Record<HomeTaskStatus, string> = {
  pending:   "Kutilmoqda",
  submitted: "Yuborildi",
  approved:  "Tasdiqlandi",
  rejected:  "Rad etildi",
};

const STATUS_STYLES: Record<HomeTaskStatus, string> = {
  pending:   "bg-gray-100 text-gray-500",
  submitted: "bg-blue-50 text-blue-600",
  approved:  "bg-emerald-50 text-emerald-600",
  rejected:  "bg-red-50 text-red-500",
};

type FilterTab = "all" | HomeTaskStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all",       label: "Barchasi" },
  { key: "submitted", label: "Yuborilgan" },
  { key: "pending",   label: "Kutilmoqda" },
  { key: "approved",  label: "Tasdiqlangan" },
  { key: "rejected",  label: "Rad etilgan" },
];

function RejectModal({
  onConfirm,
  onClose,
  isPending,
}: {
  onConfirm: (reason: string) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <h3 className="text-[16px] font-bold text-[#2D3142]">Rad etish sababi</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Rad etish sababini yozing..."
          rows={3}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-[#2D3142] resize-none focus:outline-none focus:border-blue-400 transition-colors"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-gray-100 rounded-xl text-[14px] font-bold text-[#2D3142] hover:bg-gray-200 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={isPending || !reason.trim()}
            className="flex-1 h-11 bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-xl text-[14px] font-bold text-white transition-colors flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Rad etish
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  childPhoto,
  onApprove,
  onReject,
  approving,
  rejecting,
}: {
  task: HomeTask;
  childPhoto?: string | null;
  onApprove: () => void;
  onReject: () => void;
  approving: boolean;
  rejecting: boolean;
}) {
  const initials = task.child_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatDate = (str: string) => {
    const d = new Date(str);
    const months = ["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className={cn(
      "bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-4 transition-all",
      task.status === "submitted" ? "border-blue-100" :
      task.status === "approved"  ? "border-emerald-100" :
      task.status === "rejected"  ? "border-red-100" :
      "border-gray-100"
    )}>
      {/* Top row: child info + status */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {childPhoto ? (
            <img
              src={import.meta.env.VITE_API_MEDIA_URL + childPhoto}
              alt={task.child_name}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
          )}
          <div>
            <p className="font-bold text-[14px] text-[#2D3142]">{task.child_name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3 text-[#9EB1D4]" />
              <span className="text-[11px] text-[#9EB1D4]">Muddat: {formatDate(task.due_date)}</span>
            </div>
          </div>
        </div>
        <span className={cn("text-[11px] font-bold px-3 py-1 rounded-full shrink-0", STATUS_STYLES[task.status])}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {/* Items list */}
      {task.items.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {task.items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#9EB1D4] shrink-0" />
              <span className="text-[13px] text-[#5A6484]">{item.title}</span>
              <span className="ml-auto text-[11px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                +{item.xp_reward} XP
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Evidence file */}
      {task.evidence_file && (
        <a
          href={import.meta.env.VITE_API_MEDIA_URL + task.evidence_file}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 rounded-xl text-[13px] font-bold text-blue-600 hover:bg-blue-100 transition-colors w-fit"
        >
          <FileText className="w-4 h-4" />
          Isbot faylini ko'rish
          <ExternalLink className="w-3.5 h-3.5 ml-auto" />
        </a>
      )}

      {/* Rejection reason */}
      {task.status === "rejected" && task.rejection_reason && (
        <div className="flex items-start gap-2 bg-red-50 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-600">{task.rejection_reason}</p>
        </div>
      )}

      {/* Approve / Reject buttons — only for submitted */}
      {task.status === "submitted" && (
        <div className="flex gap-3 pt-1">
          <button
            onClick={onApprove}
            disabled={approving || rejecting}
            className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-xl text-[13px] font-bold text-white transition-colors flex items-center justify-center gap-2"
          >
            {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Tasdiqlash
          </button>
          <button
            onClick={onReject}
            disabled={approving || rejecting}
            className="flex-1 h-10 bg-red-50 hover:bg-red-100 disabled:opacity-50 rounded-xl text-[13px] font-bold text-red-500 transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Rad etish
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomeworkReviewPage() {
  const navigate = useNavigate();
  const { groupId } = useParams({ strict: false });
  const id = Number(groupId);
  const queryClient = useQueryClient();

  const { useGroupDetail } = useGroups();
  const { data: group, isLoading: groupLoading } = useGroupDetail(id);

  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [rejectingTaskId, setRejectingTaskId] = useState<number | null>(null);

  const { data: allTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["home-tasks-all"],
    queryFn: () => SessionsAPI.listHomeTasks(),
  });

  // Filter tasks that belong to children in this group
  const childIds = new Set((group?.children ?? []).map((c) => c.id));
  const childPhotoMap = Object.fromEntries(
    (group?.children ?? []).map((c) => [c.id, c.photo ?? null])
  );

  const groupTasks = (allTasks ?? []).filter((t) => childIds.has(t.child));
  const filteredTasks = filterTab === "all"
    ? groupTasks
    : groupTasks.filter((t) => t.status === filterTab);

  const counts: Record<FilterTab, number> = {
    all:       groupTasks.length,
    submitted: groupTasks.filter((t) => t.status === "submitted").length,
    pending:   groupTasks.filter((t) => t.status === "pending").length,
    approved:  groupTasks.filter((t) => t.status === "approved").length,
    rejected:  groupTasks.filter((t) => t.status === "rejected").length,
  };

  const { mutate: approve, isPending: approving, variables: approvingId } = useMutation({
    mutationFn: (taskId: number) =>
      SessionsAPI.reviewHomeTask(taskId, { decision: "approved" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-tasks-all"] });
      toast.success("Vazifa tasdiqlandi!");
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail || "Xatolik yuz berdi"),
  });

  const { mutate: reject, isPending: rejecting, variables: rejectingVars } = useMutation({
    mutationFn: ({ taskId, reason }: { taskId: number; reason: string }) =>
      SessionsAPI.reviewHomeTask(taskId, { decision: "rejected", rejection_reason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-tasks-all"] });
      setRejectingTaskId(null);
      toast.success("Vazifa rad etildi");
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail || "Xatolik yuz berdi"),
  });

  if (groupLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5 pb-10 ">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/specialist/groups/$groupId", params: { groupId: String(id) } })}
              className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
            >
              <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-[#2D3142]">Uy vazifalari</h1>
              {group && (
                <p className="text-[12px] text-[#9EB1D4] mt-0.5">
                  {group.name} · {groupTasks.length} ta topshiriq
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate({ to: "/specialist/groups/$groupId/homework", params: { groupId: String(id) } })}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Vazifa berish
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key)}
              className={cn(
                "h-9 px-4 rounded-xl text-[13px] font-semibold border transition-all",
                filterTab === tab.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-[#5A6484] border-gray-200 hover:border-gray-300"
              )}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={cn(
                  "ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded-full",
                  filterTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-[#9EB1D4]"
                )}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {tasksLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 bg-white rounded-2xl border border-dashed border-gray-200">
            <Eye className="w-10 h-10 text-gray-200" />
            <p className="text-[14px] font-bold text-[#9EB1D4]">
              {filterTab === "all" ? "Hali uy vazifa berilmagan" : `${STATUS_LABELS[filterTab as HomeTaskStatus]} vazifalar yo'q`}
            </p>
            {filterTab === "all" && (
              <button
                onClick={() => navigate({ to: "/specialist/groups/$groupId/homework", params: { groupId: String(id) } })}
                className="mt-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Vazifa berish
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                childPhoto={childPhotoMap[task.child]}
                onApprove={() => approve(task.id)}
                onReject={() => setRejectingTaskId(task.id)}
                approving={approving && approvingId === task.id}
                rejecting={rejecting && rejectingVars?.taskId === task.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectingTaskId !== null && (
        <RejectModal
          isPending={rejecting}
          onClose={() => setRejectingTaskId(null)}
          onConfirm={(reason) => reject({ taskId: rejectingTaskId, reason })}
        />
      )}
    </>
  );
}
