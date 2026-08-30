import type { ApiSuccess } from "@/types/api";

export function unwrapApiData<T>(payload: T | ApiSuccess<T> | null | undefined): T {
  if (payload && typeof payload === "object" && "data" in payload && !("id" in payload)) {
    return (payload as ApiSuccess<T>).data;
  }

  return payload as T;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function pickString(source: Record<string, unknown> | null | undefined, keys: string[]): string {
  if (!source) {
    return "";
  }

  for (const key of keys) {
    const value = text(source[key]);
    if (value) {
      return value;
    }
  }

  return "";
}

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
}

export function unwrapApiList<T>(payload: unknown): T[] {
  const unwrapped = unwrapApiData(payload);
  if (Array.isArray(unwrapped)) {
    return unwrapped as T[];
  }

  const record = asRecord(unwrapped) ?? asRecord(payload);
  if (!record) {
    return [];
  }

  const nested = ["data", "items", "results", "records", "companies", "list", "rows"]
    .map((key) => record[key])
    .find(Array.isArray);

  if (nested) {
    return nested as T[];
  }

  if (record.id || record.name || record.email) {
    return [record as T];
  }

  return [];
}
