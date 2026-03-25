import { z } from "zod";

export const videoSchema = z.object({
  title: z.string().min(3, "Sarlahani kiriting"),
  video_url: z.string().url("Noto'g'ri video URL"),
  duration: z.string().optional(),
  equipments: z.string().optional(),
  section_id: z.string().min(1, "Bo'limni tanlang"),
  exercise_id: z.string().optional(),
});

export type VideoSchema = z.infer<typeof videoSchema>;
