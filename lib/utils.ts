import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
