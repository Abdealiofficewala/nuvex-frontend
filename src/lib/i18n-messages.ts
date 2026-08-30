import type { AboutPersonSeed, ContentBlock, ProcessStep } from "@/types/content";
import type { FilterChip } from "@/types/ui";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

export function parseTitleLines(value: unknown, fallback: string): string[] {
  const lines = parseStringArray(value);
  return lines.length ? lines : [fallback];
}

export function parseProcessSteps(value: unknown): ProcessStep[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(
    (item): item is ProcessStep =>
      isRecord(item) &&
      typeof item.n === "string" &&
      typeof item.title === "string" &&
      typeof item.body === "string",
  );
}

export function parseContentBlocks(value: unknown): ContentBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(
    (item): item is ContentBlock =>
      isRecord(item) && typeof item.title === "string" && typeof item.body === "string",
  );
}

export function parseAboutPeople(value: unknown): AboutPersonSeed[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(
    (item): item is AboutPersonSeed =>
      isRecord(item) &&
      typeof item.key === "string" &&
      typeof item.role === "string" &&
      typeof item.crunch === "string" &&
      typeof item.body === "string",
  );
}

export function isFilterChip(value: FilterChip | null | false | undefined): value is FilterChip {
  return Boolean(value);
}
