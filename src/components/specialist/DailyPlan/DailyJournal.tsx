import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";
import { toast } from "sonner";

interface DailyJournalProps {
  sessionId: number | null;
}

export default function DailyJournal({ sessionId }: DailyJournalProps) {
  const queryClient = useQueryClient();
  const [gameName, setGameName] = useState("");
  const [notes, setNotes] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const { data: session } = useQuery({
    queryKey: ["sessions", sessionId],
    queryFn: () => SessionsAPI.getById(sessionId!),
    enabled: !!sessionId,
  });

  const { mutate: createReport, isPending } = useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error("Seans tanlanmagan");
      const report = await SessionsAPI.createReport(sessionId, {
        game_name: gameName,
        notes,
      });
      if (videoFile) {
        await SessionsAPI.uploadReportMedia(sessionId, videoFile, "video");
      }
      if (imageFile) {
        await SessionsAPI.uploadReportMedia(sessionId, imageFile, "image");
      }
      return report;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Hisobot muvaffaqiyatli saqlandi!");
      setGameName("");
      setNotes("");
      setVideoFile(null);
      setImageFile(null);
    },
    onError: () => toast.error("Hisobot saqlashda xatolik yuz berdi"),
  });

  return (
    <Card className="border-none shadow-xs rounded-[32px] bg-white h-full">
      <CardContent className="p-10 space-y-10">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Kunlik jurnal</h3>
          <p className="text-sm text-slate-400">Mashg'ulot natijalarini qayd eting</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mashg'ulot nomi</p>
            <p className="text-sm font-bold text-slate-800">
              {session?.topic_title || "Seans tanlanmagan"}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">O'yin nomi</p>
            <input
              type="text"
              placeholder="O'yin nomini kiriting..."
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Izohlar</p>
          <textarea
            placeholder="Bugungi mashg'ulot natijalarini yozing..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 bg-[#F8FAFC] border border-slate-100 rounded-[24px] p-6 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div
            onClick={() => videoRef.current?.click()}
            className="border-2 border-dashed border-slate-100 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-200 transition-colors"
          >
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            />
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
              <Video size={24} />
            </div>
            <p className="text-xs font-bold text-slate-500">
              {videoFile ? videoFile.name : "Video yuklash"}
            </p>
            <Button variant="ghost" className="h-9 px-4 rounded-xl flex items-center gap-2 text-[10px] font-bold bg-slate-50 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Upload size={12} />
              Tanlash
            </Button>
          </div>

          <div
            onClick={() => imageRef.current?.click()}
            className="border-2 border-dashed border-slate-100 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-200 transition-colors"
          >
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
              <ImageIcon size={24} />
            </div>
            <p className="text-xs font-bold text-slate-500">
              {imageFile ? imageFile.name : "Rasm yuklash"}
            </p>
            <Button variant="ghost" className="h-9 px-4 rounded-xl flex items-center gap-2 text-[10px] font-bold bg-slate-50 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Upload size={12} />
              Tanlash
            </Button>
          </div>
        </div>

        <Button
          onClick={() => createReport()}
          disabled={isPending || !sessionId || !notes.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl text-white font-bold text-base shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : null}
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </CardContent>
    </Card>
  );
}
