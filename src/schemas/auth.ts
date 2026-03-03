import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(3, "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi shart"),
    password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi shart"),
});

export type LoginSchema = z.infer<typeof loginSchema>;