import { z } from "zod";

export const sectionSchema = z.object({
  name: z.string().min(1, "Bo'lim nomi majburiy"),
  percentage: z.number().min(0, "Foiz 0 dan kichik bo'lmasligi kerak").max(100, "Foiz 100 dan oshmasligi kerak"),
  description: z.string().min(1, "Bo'lim tavsifi majburiy"),
  icon: z.string().min(1, "Ikonka tanlash majburiy"),
  color: z.string().min(1, "Rang tanlash majburiy"),
  age_group_id: z.number().min(1, "Bola yoshini tanlang"),
});

export type SectionSchema = z.infer<typeof sectionSchema>;

export const ageGroupSchema = z.object({
  name: z.string().min(1, "Yosh toifasi nomi majburiy"),
});

export type AgeGroupSchema = z.infer<typeof ageGroupSchema>;

export const exerciseSchema = z.object({
  name: z.string().min(1, "Mashq nomi majburiy"),
  video_url: z.string().url("Noto'g'ri URL").optional().or(z.literal("")),
  status: z.enum(["active", "draft"]),
  section_id: z.number(),
});

export type ExerciseSchema = z.infer<typeof exerciseSchema>;
