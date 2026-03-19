import { z } from "zod";

export const specialistSchema = z.object({
  fio: z.string().min(3, "F.I.O kamida 3 ta belgidan iborat bo'lishi kerak"),
  phone_number: z.string().min(9, "Telefon raqami noto'g'ri"),
  email: z.string().email("Email noto'g'ri"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak").optional().or(z.literal("")),
  photo: z.union([z.string(), z.instanceof(File)]).optional(),
  specialist_type_id: z.number().min(1, "Mutaxassis turini tanlang"),
  shift: z.string().min(1, "Smenani tanlang"),
  work_days: z.string().min(1, "Kamida bitta ish kunini tanlang"),
  max_patients: z.number().min(0, "Manfiy bo'lishi mumkin emas"),
  max_groups: z.number().min(0, "Manfiy bo'lishi mumkin emas"),
  weekly_hour_limit: z.number().min(0, "Manfiy bo'lishi mumkin emas"),
  is_certified: z.boolean(),
});

export type SpecialistSchema = z.infer<typeof specialistSchema>;
