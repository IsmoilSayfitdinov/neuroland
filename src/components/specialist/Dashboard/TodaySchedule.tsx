import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Loader2, Square } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";
import { toast } from "sonner";

interface Props {
  apiData?: any[];
}

export default function TodaySchedule({ apiData }: Props) {
  const queryClient = useQueryClient();
  const sessions = apiData ?? [];

  const { mutate: startSession, isPending: starting } = useMutation({
    mutationFn: (id: number) => SessionsAPI.start(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics", "doctor", "dashboard"] });
      toast.success("Seans boshlandi!");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const { mutate: endSession, isPending: ending } = useMutation({
    mutationFn: (id: number) => SessionsAPI.end(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics", "doctor", "dashboard"] });
      toast.success("Seans yakunlandi!");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const isBusy = starting || ending;

  return (
    <Card className="h-full min-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-slate-800">Bugungi Jadval</CardTitle>
        <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
          {sessions.length} ta seans
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-[13px] text-slate-400">Bugungi seanslar mavjud emas</div>
        ) : (
          sessions.map((session: any) => {
            const isStarted = session.is_started && !session.ended_at;
            const isEnded = !!session.ended_at;
            return (
              <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm font-bold text-slate-800">{session.start_time?.slice(0, 5)}</div>
                    <div className={`text-[10px] mt-1 ${isStarted ? "text-emerald-500" : isEnded ? "text-slate-400" : "text-blue-500"}`}>
                      {isStarted ? "Davom" : isEnded ? "Tugagan" : "Kutilmoqda"}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800">{session.group_name || "Individual"}</span>
                    <div className="bg-white/80 border px-2 py-0.5 rounded-lg text-[10px] text-emerald-600 font-medium mt-1 inline-block">
                      {session.topic_title || "Mavzu belgilanmagan"}
                    </div>
                  </div>
                </div>
                {!isEnded && (
                  isStarted ? (
                    <Button onClick={() => endSession(session.id)} disabled={isBusy}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-10 px-4 flex items-center gap-2 text-xs font-bold">
                      {ending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Square className="w-3 h-3 fill-current" />} Yakunlash
                    </Button>
                  ) : (
                    <Button onClick={() => startSession(session.id)} disabled={isBusy}
                      className="bg-[#2ECC71] hover:bg-emerald-600 text-white rounded-xl h-10 px-4 flex items-center gap-2 text-xs font-bold">
                      {starting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />} Boshlash
                    </Button>
                  )
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
