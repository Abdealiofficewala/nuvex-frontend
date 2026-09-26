import type { ThemeActivationSchedule, ThemeRecord } from "@/types/appearance";

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year!, month! - 1, day!);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isDateInRange(at: Date, startDate: string, endDate: string): boolean {
  const day = startOfDay(at).getTime();
  return day >= parseDateOnly(startDate).getTime() && day <= parseDateOnly(endDate).getTime();
}

export function isDateOnOrAfter(at: Date, startDate: string): boolean {
  return startOfDay(at).getTime() >= parseDateOnly(startDate).getTime();
}

export function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = parseDateOnly(value);
  return !Number.isNaN(parsed.getTime());
}

export function resolveScheduledThemeRecord(
  themes: ThemeRecord[],
  at: Date = new Date(),
): ThemeRecord | null {
  if (!themes.length) {
    return null;
  }

  const inRangeInterval = themes
    .filter(
      (theme) =>
        theme.schedule?.mode === "interval" &&
        theme.schedule.startDate &&
        theme.schedule.endDate &&
        isDateInRange(at, theme.schedule.startDate, theme.schedule.endDate),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (inRangeInterval[0]) {
    return inRangeInterval[0];
  }

  const fromDateThemes = themes
    .filter(
      (theme) =>
        theme.schedule?.mode === "from_date" &&
        theme.schedule.startDate &&
        isDateOnOrAfter(at, theme.schedule.startDate),
    )
    .sort((a, b) => {
      const startCompare = (b.schedule.startDate ?? "").localeCompare(a.schedule.startDate ?? "");
      return startCompare !== 0 ? startCompare : b.updatedAt.localeCompare(a.updatedAt);
    });

  if (fromDateThemes[0]) {
    return fromDateThemes[0];
  }

  const outsideInterval = themes.find(
    (theme) =>
      theme.schedule?.mode === "interval" &&
      theme.schedule.startDate &&
      theme.schedule.endDate &&
      theme.schedule.fallbackThemeId &&
      !isDateInRange(at, theme.schedule.startDate, theme.schedule.endDate),
  );

  if (outsideInterval?.schedule?.fallbackThemeId) {
    const fallback = themes.find((theme) => theme.id === outsideInterval.schedule.fallbackThemeId);
    if (fallback) {
      return fallback;
    }
  }

  return themes.find((theme) => theme.isActive) ?? themes[0] ?? null;
}

export function normalizeThemeSchedule(schedule?: ThemeActivationSchedule | null): ThemeActivationSchedule {
  return {
    mode: schedule?.mode ?? "manual",
    startDate: schedule?.startDate ?? null,
    endDate: schedule?.endDate ?? null,
    fallbackThemeId: schedule?.fallbackThemeId ?? null,
  };
}
