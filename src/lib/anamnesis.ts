const DELIMITER = " | ";

export function serializeSleepHabits(time: string, companion: string): string | null {
  const parts = [time, companion].filter(Boolean);
  return parts.length > 0 ? parts.join(DELIMITER) : null;
}

export function deserializeSleepHabits(combined?: string | null): { time: string; companion: string } {
  if (!combined) return { time: "", companion: "" };
  const [time = "", companion = ""] = combined.split(DELIMITER);
  return { time, companion };
}
