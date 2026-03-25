import { useState, useEffect } from "react";
import { Loader2, Play, Square, Users, CheckCircle2, XCircle, FileText, BookOpen, Plus, Clock } from "lucide-react";
import DailyJournal from "@/components/specialist/DailyPlan/DailyJournal";
import AssignHomework from "@/components/specialist/DailyPlan/AssignHomework";
import { useGroups } from "@/hooks/admin/useGroups";
import { useChildren } from "@/hooks/specialist/useChildren";
import { useTopics } from "@/hooks/admin/useTopics";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";
import { CustomSelect } from "@/components/ui/custom-select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { AttendanceEntry } from "@/types/session.types";

type Step = "session" | "report" | "homework";

export default function DailyPlan() {
  const { useGroupsList } = useGroups();
  const { useChildrenList } = useChildren();
  const { data: groups, isLoading: groupsLoading } = useGroupsList();
  const { data: children } = useChildrenList();
  const queryClient = useQueryClient();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, boolean>>({});
  const [activeStep, setActiveStep] = useState<Step>("session");
  const [reportSaved, setReportSaved] = useState(false);

  const { data: todaySessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessions-today"],
    queryFn: () => SessionsAPI.getToday(),
  });

  // Get active topic for selected group
  const { useActiveTopic } = useTopics();
  const { data: activeTopic } = useActiveTopic(selectedGroupId ?? undefined);

  // Auto-select first group
  useEffect(() => {
    if (groups?.length && !selectedGroupId) setSelectedGroupId(groups[0].id);
  }, [groups, selectedGroupId]);

  // Find today's session for selected group
  const currentSession = todaySessions?.find((s) => s.group === selectedGroupId);

  // Filter children by selected group
  const groupChildren = children?.filter((c) => c.group_id === selectedGroupId);

  // Initialize attendance map
  useEffect(() => {
    if (groupChildren?.length) {
      setAttendanceMap((prev) => {
        const next = { ...prev };
        groupChildren.forEach((c) => {
          if (next[c.id] === undefined) next[c.id] = true;
        });
        return next;
      });
    }
  }, [groupChildren]);

  const isSessionStarted = currentSession?.is_started && !currentSession?.ended_at;
  const isSessionEnded = !!currentSession?.ended_at;

  // Check if report exists
  const { data: existingReport } = useQuery({
    queryKey: ["session-report", currentSession?.id],
    queryFn: () => SessionsAPI.getReport(currentSession!.id).catch(() => null),
    enabled: !!currentSession?.id && isSessionEnded,
  });

  const hasReport = !!existingReport || reportSaved;

  // Auto-set step
  useEffect(() => {
    if (isSessionEnded && hasReport) {
      setActiveStep("homework");
    } else if (isSessionEnded) {
      setActiveStep("report");
    } else {
      setActiveStep("session");
    }
  }, [isSessionEnded, hasReport]);

  // Create session
  const { mutate: createSession, isPending: creating } = useMutation({
    mutationFn: () => {
      const now = new Date();
      return SessionsAPI.create({
        group: selectedGroupId!,
        topic: (activeTopic as any)?.id ?? undefined,
        date: now.toISOString().split("T")[0],
        start_time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions-today"] });
      toast.success("Seans yaratildi!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Seans yaratishda xatolik");
    },
  });

  // Start session
  const { mutate: startSession, isPending: starting } = useMutation({
    mutationFn: () => SessionsAPI.start(currentSession!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions-today"] });
      toast.success("Seans boshlandi!");
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail || "Seansni boshlashda xatolik"),
  });

  // End session
  const { mutate: endSession, isPending: ending } = useMutation({
    mutationFn: () => SessionsAPI.end(currentSession!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions-today"] });
      toast.success("Seans yakunlandi! Endi hisobot yozing.");
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail || "Seansni yakunlashda xatolik"),
  });

  // Mark attendance
  const { mutate: markAttendance, isPending: markingAttendance } = useMutation({
    mutationFn: () => {
      const attendances: AttendanceEntry[] = (groupChildren ?? []).map((c) => ({
        child: c.id,
        is_present: attendanceMap[c.id] ?? true,
      }));
      return SessionsAPI.markAttendance(currentSession!.id, attendances);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions-today"] });
      toast.success("Davomat saqlandi!");
      setShowAttendance(false);
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail || "Davomatni saqlashda xatolik"),
  });

  const STEPS: { key: Step; label: string; icon: typeof Play; enabled: boolean }[] = [
    { key: "session", label: "Seans", icon: Play, enabled: true },
    { key: "report", label: "Hisobot", icon: FileText, enabled: isSessionEnded },
    { key: "homework", label: "Uy vazifasi", icon: BookOpen, enabled: hasReport },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      <h2 className="text-2xl font-bold text-slate-800">Uyga vaziyfa</h2>

      {/* Selectors */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="min-w-[220px]">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-2">Guruh</label>
          {groupsLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Yuklanmoqda...
            </div>
          ) : (
            <CustomSelect
              value={selectedGroupId ?? ""}
              onChange={(val) => {
                setSelectedGroupId(Number(val));
                setReportSaved(false);
              }}
              options={groups?.map((g) => ({ label: g.name, value: g.id })) || []}
              placeholder="Guruhni tanlang"
            />
          )}
        </div>

      </div>

      {/* Step indicators */}
      {currentSession && (
        <div className="flex items-center gap-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === step.key;
            const isDone = (step.key === "session" && isSessionEnded) || (step.key === "report" && hasReport);
            return (
              <div key={step.key} className="flex items-center gap-2">
                {idx > 0 && <div className={cn("w-8 h-0.5 rounded-full", isDone || isActive ? "bg-blue-400" : "bg-gray-200")} />}
                <button
                  onClick={() => step.enabled && setActiveStep(step.key)}
                  disabled={!step.enabled}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all",
                    isActive ? "bg-blue-600 text-white shadow-sm"
                      : isDone ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : step.enabled ? "bg-white text-slate-500 border border-gray-200 hover:border-gray-300"
                      : "bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed"
                  )}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  {step.label}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Session controls */}
      {currentSession && activeStep === "session" && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${isSessionStarted ? "bg-green-500 animate-pulse" : isSessionEnded ? "bg-gray-400" : "bg-blue-500"}`} />
              <div>
                <p className="text-[14px] font-bold text-slate-800">
                  {currentSession.topic_title || "Mavzu belgilanmagan"}
                </p>
                <p className="text-[12px] text-slate-400">
                  {currentSession.start_time?.slice(0, 5)} | {currentSession.group_name}
                  {isSessionStarted && " — Davom etmoqda"}
                  {isSessionEnded && " — Yakunlangan"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSessionStarted && (
                <Button variant="outline" onClick={() => setShowAttendance(!showAttendance)}
                  className="h-9 px-4 rounded-xl text-[12px] font-bold gap-2">
                  <Users className="w-3.5 h-3.5" /> Davomat
                </Button>
              )}
              {!currentSession.is_started && !isSessionEnded && (
                <Button onClick={() => startSession()} disabled={starting}
                  className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-bold gap-2">
                  {starting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  Boshlash
                </Button>
              )}
              {isSessionStarted && (
                <Button onClick={() => endSession()} disabled={ending}
                  className="h-9 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[12px] font-bold gap-2">
                  {ending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5 fill-current" />}
                  Yakunlash
                </Button>
              )}
              {isSessionEnded && (
                <Button onClick={() => setActiveStep("report")}
                  className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold gap-2">
                  <FileText className="w-3.5 h-3.5" /> Hisobot yozish
                </Button>
              )}
            </div>
          </div>

          {/* Attendance panel */}
          {showAttendance && groupChildren && groupChildren.length > 0 && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <p className="text-[13px] font-bold text-slate-700">Davomat belgilash</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {groupChildren.map((child) => (
                  <div key={child.id}
                    onClick={() => setAttendanceMap((p) => ({ ...p, [child.id]: !p[child.id] }))}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                      attendanceMap[child.id] ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
                    }`}>
                    {attendanceMap[child.id]
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      : <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                    <span className="text-[13px] font-medium text-slate-700">{child.fio}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => markAttendance()} disabled={markingAttendance}
                className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold">
                {markingAttendance ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Davomatni saqlash
              </Button>
            </div>
          )}
        </div>
      )}

      {/* No session — create one */}
      {!currentSession && !sessionsLoading && !groupsLoading && selectedGroupId && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-800">Bugungi seans mavjud emas</p>
                <p className="text-[12px] text-slate-400">
                  {(activeTopic as any)?.title
                    ? `Mavzu: ${(activeTopic as any).title}`
                    : "Yangi seans yarating"}
                </p>
              </div>
            </div>
            <Button onClick={() => createSession()} disabled={creating}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold gap-2">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Seans yaratish
            </Button>
          </div>
        </div>
      )}

      {/* No group selected */}
      {!selectedGroupId && !groupsLoading && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <p className="text-[#9EB1D4] font-medium">Guruhni tanlang</p>
        </div>
      )}

      {/* Report step */}
      {activeStep === "report" && currentSession && (
        <div className="max-w-2xl">
          <DailyJournal
            sessionId={currentSession.id}
            onReportSaved={() => {
              setReportSaved(true);
              setActiveStep("homework");
            }}
          />
        </div>
      )}

      {/* Homework step */}
      {activeStep === "homework" && (
        <div className="max-w-2xl space-y-4">
          <h3 className="text-[16px] font-bold text-[#2D3142]">Uy vazifa berish</h3>
          <AssignHomework
            sessionId={currentSession?.id ?? null}
            children={groupChildren ?? []}
            onCancel={() => setActiveStep("report")}
          />
        </div>
      )}

      {/* Always show homework option if no session */}
      {!currentSession && !sessionsLoading && selectedGroupId && (
        <div className="max-w-2xl mt-2 space-y-4">
          <h3 className="text-[16px] font-bold text-[#2D3142]">Uy vazifasi berish</h3>
          <AssignHomework sessionId={null} children={groupChildren ?? []} />
        </div>
      )}
    </div>
  );
}
