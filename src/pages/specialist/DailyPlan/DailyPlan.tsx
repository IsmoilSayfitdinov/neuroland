import { useState, useEffect } from "react";
import { Loader2, Play, Square, Users, CheckCircle2, XCircle } from "lucide-react";
import DailyJournal from "@/components/specialist/DailyPlan/DailyJournal";
import AssignHomework from "@/components/specialist/DailyPlan/AssignHomework";
import { useGroups } from "@/hooks/admin/useGroups";
import { useChildren } from "@/hooks/specialist/useChildren";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";
import { CustomSelect } from "@/components/ui/custom-select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AttendanceEntry } from "@/types/session.types";

export default function DailyPlan() {
  const { useGroupsList } = useGroups();
  const { useChildrenList } = useChildren();
  const { data: groups, isLoading: groupsLoading } = useGroupsList();
  const { data: children } = useChildrenList();
  const queryClient = useQueryClient();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, boolean>>({});

  const { data: todaySessions } = useQuery({
    queryKey: ["sessions-today"],
    queryFn: () => SessionsAPI.getToday(),
  });

  // Auto-select first group
  useEffect(() => {
    if (groups?.length && !selectedGroupId) setSelectedGroupId(groups[0].id);
  }, [groups]);

  // Find today's session for selected group
  const currentSession = todaySessions?.find(
    (s) => s.group === selectedGroupId
  );

  // Filter children by selected group
  const groupChildren = children?.filter(
    (c) => c.group_id === selectedGroupId
  );

  // Initialize attendance map when group children change
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

  // Start session
  const { mutate: startSession, isPending: starting } = useMutation({
    mutationFn: () => SessionsAPI.start(currentSession!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions-today"] });
      toast.success("Seans boshlandi!");
    },
    onError: () => toast.error("Seansni boshlashda xatolik"),
  });

  // End session
  const { mutate: endSession, isPending: ending } = useMutation({
    mutationFn: () => SessionsAPI.end(currentSession!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions-today"] });
      toast.success("Seans yakunlandi!");
    },
    onError: () => toast.error("Seansni yakunlashda xatolik"),
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
    onError: () => toast.error("Davomatni saqlashda xatolik"),
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      <h2 className="text-2xl font-bold text-slate-800">Kunlik reja</h2>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="min-w-[220px]">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-2">
            Guruh
          </label>
          {groupsLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Yuklanmoqda...
            </div>
          ) : (
            <CustomSelect
              value={selectedGroupId || ""}
              onChange={(val) => {
                setSelectedGroupId(Number(val));
                setSelectedChildId(null);
              }}
              options={groups?.map((g) => ({ label: g.name, value: g.id.toString() })) || []}
              placeholder="Guruhni tanlang"
            />
          )}
        </div>

        <div className="min-w-[220px]">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-2">
            Bola (uy vazifasi uchun)
          </label>
          <CustomSelect
            value={selectedChildId || ""}
            onChange={(val) => setSelectedChildId(Number(val))}
            options={groupChildren?.map((c) => ({ label: c.fio, value: c.id.toString() })) || []}
            placeholder="Bolani tanlang"
          />
        </div>
      </div>

      {/* Today's session info + controls */}
      {currentSession && (
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
              {/* Attendance button */}
              {isSessionStarted && (
                <Button
                  variant="outline"
                  onClick={() => setShowAttendance(!showAttendance)}
                  className="h-9 px-4 rounded-xl text-[12px] font-bold gap-2"
                >
                  <Users className="w-3.5 h-3.5" />
                  Davomat
                </Button>
              )}

              {/* Start/End session */}
              {!currentSession.is_started && !isSessionEnded && (
                <Button
                  onClick={() => startSession()}
                  disabled={starting}
                  className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-bold gap-2"
                >
                  {starting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  Boshlash
                </Button>
              )}
              {isSessionStarted && (
                <Button
                  onClick={() => endSession()}
                  disabled={ending}
                  className="h-9 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[12px] font-bold gap-2"
                >
                  {ending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5 fill-current" />}
                  Yakunlash
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
                  <div
                    key={child.id}
                    onClick={() =>
                      setAttendanceMap((p) => ({ ...p, [child.id]: !p[child.id] }))
                    }
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                      attendanceMap[child.id]
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    {attendanceMap[child.id] ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-[13px] font-medium text-slate-700">{child.fio}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => markAttendance()}
                disabled={markingAttendance}
                className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold"
              >
                {markingAttendance ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Davomatni saqlash
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mt-4">
        <DailyJournal sessionId={currentSession?.id ?? null} />
        <AssignHomework sessionId={currentSession?.id ?? null} childId={selectedChildId} />
      </div>
    </div>
  );
}
