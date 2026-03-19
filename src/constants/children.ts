// ── Child statuses ──
export const CHILD_STATUS = {
  ACTIVE: "active",
  NEW: "new",
  DIAGNOSTIKA: "diagnostika",
  COMPLETED: "completed",
  ARCHIVE: "archive",
} as const;

export const CHILD_STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  active:      { label: "Faol",        cls: "bg-[#3DB87E] text-white" },
  new:         { label: "Yangi",       cls: "bg-[#4D89FF] text-white" },
  diagnostika: { label: "Diagnostika", cls: "bg-[#FFB020] text-white" },
  completed:   { label: "Yakunlangan", cls: "bg-gray-400 text-white" },
  archive:     { label: "Arxiv",       cls: "bg-gray-300 text-gray-600" },
};

// ── Age filter options ──
export const AGE_RANGE_OPTIONS = [
  { label: "0-3 yosh", value: "0-3" },
  { label: "3-5 yosh", value: "3-5" },
  { label: "5-7 yosh", value: "5-7" },
  { label: "7+ yosh",  value: "7+" },
];

// ── Payment method & status ──
export const PAYMENT_METHODS = [
  { label: "Naqd",  value: "cash" },
  { label: "Karta", value: "card" },
  { label: "Payme", value: "payme" },
  { label: "Click", value: "click" },
] as const;

export const PAYMENT_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  paid:    { label: "To'langan",   cls: "bg-[#E8FFF3] text-[#3DB87E]" },
  pending: { label: "Kutilmoqda",  cls: "bg-amber-50 text-amber-600" },
  failed:  { label: "Muvaffaqiyatsiz", cls: "bg-red-50 text-red-500" },
};

// ── Diagnostic score labels ──
export const SCORE_LABELS: Record<number, { label: string; cls: string }> = {
  1:   { label: "Mustaqil",     cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  0.5: { label: "Yordam bilan", cls: "bg-amber-50 text-amber-600 border-amber-100" },
  0:   { label: "Bajarmadi",    cls: "bg-red-50 text-red-500 border-red-100" },
};

export function getScoreLabel(score: number) {
  return SCORE_LABELS[score] ?? SCORE_LABELS[0];
}

// ── Detail page tabs (shared between admin & specialist) ──
export type ChildTab = "basic" | "anamnesis" | "diagnostika" | "natijalar" | "uchrashuvlar" | "tolov";

export const CHILD_DETAIL_TABS: { id: ChildTab; label: string }[] = [
  { id: "basic",        label: "Asosiy ma'lumotlar" },
  { id: "anamnesis",    label: "Rivojlanish tarixi" },
  { id: "diagnostika",  label: "Diagnostika" },
  { id: "natijalar",    label: "Diagnostika natijalari" },
  { id: "uchrashuvlar", label: "Uchrashuvlar" },
  { id: "tolov",        label: "To'lov tarixi" },
];
