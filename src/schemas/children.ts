import { z } from "zod";

export const childSchema = z.object({
  // Step 1: Basic Info
  fio: z.string().min(3, "Ism-familiyani kiriting"),
  birth_date: z.string().min(1, "Tug'ilgan sanani tanlang").refine((date) => {
    const d = new Date(date);
    const now = new Date();
    return d <= now;
  }, "Kelajakdagi sanani tanlab bo'lmaydi").refine((date) => {
    const d = new Date(date);
    const now = new Date();
    const age = now.getFullYear() - d.getFullYear();
    return age <= 18;
  }, "Bemor 18 yoshdan oshgan bo'lishi mumkin emas"),
  alias: z.string().optional().or(z.literal("")),
  diagnosis: z.string().optional().or(z.literal("")),
  kelib_tushgan_sana: z.string().optional(),
  
  // Step 2: Parents
  father_name: z.string().optional().or(z.literal("")),
  mother_name: z.string().optional().or(z.literal("")),
  phone_number: z.string().min(9, "Telefon raqamini kiriting"),
  phone_number_2: z.string().optional().or(z.literal("")),
  password: z.string().min(4, "Kamida 4 ta belgi").regex(/[a-zA-Z]/, "Kamida 1 ta harf bo'lishi kerak").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  recommended_by: z.string().optional().or(z.literal("")),
  child_number_in_family: z.preprocess((val) => (val === "" || val === null ? undefined : Number(val)), z.number().min(1).max(20).optional()),

  // Step 3-7: Anamnesis (will be transformed to anamnesis object)
  pregnancy_1_trimester: z.string().optional(),
  pregnancy_2_trimester: z.string().optional(),
  pregnancy_3_trimester: z.string().optional(),
  birth_process: z.string().optional(),
  birth_weight: z.string().optional(),
  first_40_days: z.string().optional(),
  up_to_1_year: z.string().optional(),
  
  breastfeeding_duration: z.string().max(50, "50 belgi oralig'ida bo'lishi kerak").optional(),
  pacifier_usage_period: z.string().max(50, "50 belgi oralig'ida bo'lishi kerak").optional(),
  
  // Integer age fields (in months usually, so max ~100 months ~8.5 years is plenty, or just max 200)
  walking_age: z.preprocess((val) => (val === "" || val === null ? undefined : Number(val)), z.number().min(0).max(200, "200 dan oshmasligi kerak").optional()),
  gadget_usage_age: z.preprocess((val) => (val === "" || val === null ? undefined : Number(val)), z.number().min(0).max(200, "200 dan oshmasligi kerak").optional()),
  kindergarten_age: z.preprocess((val) => (val === "" || val === null ? undefined : Number(val)), z.number().min(0).max(200, "200 dan oshmasligi kerak").optional()),
  first_word_age: z.preprocess((val) => (val === "" || val === null ? undefined : Number(val)), z.number().min(0).max(200, "200 dan oshmasligi kerak").optional()),
  
  sleep_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Vaqt formati noto'g'ri (Masalan: 21:00)").optional().or(z.literal("")),
  sleep_with_who: z.string().max(100).optional(),
  sleep_habits: z.string().optional(),
  eating_habits: z.string().optional(),
  has_constipation: z.boolean().default(false),
  has_diarrhea: z.boolean().default(false),
  wears_pampers: z.boolean().default(false),
  likes_bathing: z.boolean().default(false),
  
  has_inner_speech: z.boolean().default(false),
  current_vocabulary_count: z.string().max(50, "50 belgidan oshmasligi kerak").optional().or(z.literal("")),
  vaccination: z.string().optional(),
  
  // Step 8: Neurocorrection/Anamnesis Treatment plan (Mapped to Consultation)
  complex_name: z.string().optional().or(z.literal("")).nullable(),
  duration: z.string().max(50, "50 belgi oralig'ida bo'lishi kerak").optional().or(z.literal("")).nullable(),
  recommendations: z.string().optional().or(z.literal("")).nullable(),

  // Center info
  consultant_id: z.string().optional().or(z.literal("")).nullable(),
  group_id: z.string().optional().or(z.literal("")).nullable(),
  group_admission_date: z.string().optional().or(z.literal("")).nullable(),
  photo: z.any().optional().nullable(),

  // Specialist Assignments: { "Logoped": 5, "Neyropsixolog": 3 }
  specialist_assignments: z.record(z.string(), z.number().nullable()).optional().default({}),
});

export type ChildSchema = z.infer<typeof childSchema>;
