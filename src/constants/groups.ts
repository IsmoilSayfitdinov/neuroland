export const GROUP_SHIFTS = [
  { label: "Ertalabki (09:00–12:00)", value: "morning" },
  { label: "Kunduzi (13:00–17:00)", value: "afternoon" },
  { label: "Kechki (17:00–20:00)", value: "evening" },
] as const;

export type ShiftValue = (typeof GROUP_SHIFTS)[number]["value"];

export const GROUP_STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  active:      { label: "Faol",        cls: "bg-emerald-50 text-emerald-600" },
  new:         { label: "Yangi",       cls: "bg-blue-50 text-blue-600" },
  diagnostika: { label: "Diagnostika", cls: "bg-amber-50 text-amber-600" },
  completed:   { label: "Yakunlangan", cls: "bg-gray-100 text-gray-500" },
  archive:     { label: "Arxiv",       cls: "bg-gray-100 text-gray-400" },
};

export const SPECIALIST_ROLES = ["Logoped", "Neyropsixolog", "AFK", "Defektolog", "Koordinator"] as const;

export const DEFAULT_MAX_CHILDREN = 15;
