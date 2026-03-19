import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates age in years and months from a birth date string
 */
export function calculateAge(birthDate: string | undefined | null) {
  if (!birthDate) return "-";
  const birth = new Date(birthDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  return `${years} yil ${months} oy`;
}

/**
 * Formats a date string to DD.MM.YYYY
 */
export function formatDate(dateStr: string | undefined | null) {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch (e) {
    return dateStr;
  }
}

/**
 * Formats a number or string to Uzbek currency format (e.g. 1 000 000 so'm)
 */
export function formatCurrency(amount: string | number | undefined | null) {
  if (amount === undefined || amount === null) return "0 so'm";
  const numericValue = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericValue)) return "0 so'm";
  return new Intl.NumberFormat("uz-UZ").format(numericValue) + " so'm";
}
