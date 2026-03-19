import { z } from "zod";

export const groupSchema = z.object({
  name: z.string().min(1, "Guruh nomini kiriting"),
  shift: z.string().min(1, "Smena tanlang"),
  age_group_id: z.string().min(1, "Yosh toifasini tanlang"),
  max_children: z.string().optional(),
  start_date: z.string().optional(),
  Logoped: z.string().optional().or(z.literal("")),
  Neyropsixolog: z.string().optional().or(z.literal("")),
  AFK: z.string().optional().or(z.literal("")),
  Defektolog: z.string().optional().or(z.literal("")),
  Koordinator: z.string().optional().or(z.literal("")),
});

export type GroupSchema = z.infer<typeof groupSchema>;
