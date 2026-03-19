import { z } from "zod";

export const loginSchema = z.object({
    phone: z.string().min(9, "Telefon raqami noto'g'ri"),
    password: z.string().min(4, "Parol kamida 4 ta belgidan iborat bo'lishi shart"),
});

export type LoginSchema = z.infer<typeof loginSchema>;