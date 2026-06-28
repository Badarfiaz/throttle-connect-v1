import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeCreatedAt(value: unknown): string | null | unknown {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return value ?? null;
}

export function normalizeFirestoreStore<T extends { createdAt?: unknown }>(
  data: T | null | undefined,
): T | null {
  if (!data) return null;

  return {
    ...data,
    createdAt: normalizeCreatedAt(data.createdAt),
  } as T;
}

export function safeFormatDate(
  value: unknown,
  pattern = "MMM d, yyyy",
): string {
  if (!value) return "—";
  try {
    // Firestore Timestamp object
    if (
      typeof value === "object" &&
      value !== null &&
      "toDate" in value &&
      typeof (value as { toDate?: unknown }).toDate === "function"
    ) {
      return format((value as { toDate: () => Date }).toDate(), pattern);
    }
    // Numeric timestamp (ms)
    if (typeof value === "number") {
      return format(new Date(value), pattern);
    }
    // ISO string or other string
    if (typeof value === "string") {
      const d = new Date(value);
      if (isNaN(d.getTime())) return "—";
      return format(d, pattern);
    }
    return "—";
  } catch {
    return "—";
  }
}
