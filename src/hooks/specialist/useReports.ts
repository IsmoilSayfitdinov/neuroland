import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";
import { toast } from "sonner";

export interface ReportCreatePayload {
  topic_id: number | null;
  group_id: number | null;
  game_name: string;
  notes: string;
  media_files: File[];
}

export const useReports = () => {
  const queryClient = useQueryClient();

  const useReportsList = () =>
    useQuery({
      queryKey: ["reports"],
      queryFn: () => SessionsAPI.list(),
    });

  const useCreateReport = () =>
    useMutation({
      mutationFn: async (payload: ReportCreatePayload) => {
        const today = new Date().toISOString().split("T")[0];

        // 1. Create session
        const session = await SessionsAPI.create({
          topic: payload.topic_id,
          group: payload.group_id,
          date: today,
          start_time: "09:00",
        });

        // 2. Create report with notes (game_name stored in notes prefix)
        const noteText = payload.game_name
          ? `${payload.game_name}\n\n${payload.notes}`
          : payload.notes;

        await SessionsAPI.createReport(session.id, {
          date: today,
          start_time: "09:00",
          ...(noteText ? { notes: noteText } as any : {}),
        });

        // 3. Upload media files
        for (const file of payload.media_files) {
          await SessionsAPI.uploadReportMedia(session.id, file);
        }

        return session;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reports"] });
        toast.success("Hisobot saqlandi!");
      },
      onError: () => toast.error("Hisobot saqlashda xatolik"),
    });

  return { useReportsList, useCreateReport };
};
