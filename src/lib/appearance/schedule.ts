import { DEFAULT_THEME_SCHEDULE } from "@/lib/appearance/defaults";
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

function parseTime(value: string | null | undefined): { hours: number; minutes: number } | null {
  if (!value?.trim()) {
    return null;
  }

  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return { hours, minutes };
}

function zonedParts(at: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(at);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${read("year")}-${read("month")}-${read("day")}`,
    minutesOfDay: Number(read("hour")) * 60 + Number(read("minute")),
  };
}

export function isScheduleActiveAt(schedule: ThemeActivationSchedule, at: Date = new Date()): boolean {
  const mode = schedule.mode === "interval" ? "scheduled" : schedule.mode;

  if (mode === "manual" || mode === "always") {
    return mode === "always";
  }

  if (mode === "from_date") {
    return schedule.startDate ? isDateOnOrAfter(at, schedule.startDate) : false;
  }

  if (mode !== "scheduled") {
    return false;
  }

  if (!schedule.startDate || !schedule.endDate) {
    return false;
  }

  const timezone = schedule.timezone || DEFAULT_THEME_SCHEDULE.timezone;
  const { date, minutesOfDay } = zonedParts(at, timezone);

  if (date < schedule.startDate || date > schedule.endDate) {
    return false;
  }

  const start = parseTime(schedule.startTime) ?? { hours: 0, minutes: 0 };
  const end = parseTime(schedule.endTime) ?? { hours: 23, minutes: 59 };
  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;

  if (date === schedule.startDate && minutesOfDay < startMinutes) {
    return false;
  }

  if (date === schedule.endDate && minutesOfDay > endMinutes) {
    return false;
  }

  return true;
}

function schedulePriority(theme: ThemeRecord): number {
  return theme.schedule?.priority ?? 0;
}

function isScheduledCandidate(theme: ThemeRecord): boolean {
  if (theme.disabled) {
    return false;
  }

  const mode = theme.schedule?.mode;
  return mode === "scheduled" || mode === "interval" || mode === "from_date";
}

export function resolveScheduledThemeRecord(
  themes: ThemeRecord[],
  at: Date = new Date(),
): ThemeRecord | null {
  if (!themes.length) {
    return null;
  }

  const enabled = themes.filter((theme) => !theme.disabled);

  const scheduledActive = enabled
    .filter((theme) => isScheduledCandidate(theme) && isScheduleActiveAt(theme.schedule, at))
    .sort((a, b) => {
      const priorityDelta = schedulePriority(b) - schedulePriority(a);
      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return b.updatedAt.localeCompare(a.updatedAt);
    });

  if (scheduledActive[0]) {
    return scheduledActive[0];
  }

  const alwaysThemes = enabled
    .filter((theme) => theme.schedule?.mode === "always")
    .sort((a, b) => schedulePriority(b) - schedulePriority(a));

  if (alwaysThemes[0]) {
    return alwaysThemes[0];
  }

  const outsideInterval = enabled.find(
    (theme) =>
      (theme.schedule?.mode === "scheduled" || theme.schedule?.mode === "interval") &&
      theme.schedule.startDate &&
      theme.schedule.endDate &&
      theme.schedule.fallbackThemeId &&
      !isScheduleActiveAt(theme.schedule, at),
  );

  if (outsideInterval?.schedule?.fallbackThemeId) {
    const fallback = enabled.find((theme) => theme.id === outsideInterval.schedule.fallbackThemeId);
    if (fallback) {
      return fallback;
    }
  }

  const fallbackTheme = enabled.find((theme) => theme.isFallback);
  if (fallbackTheme) {
    return fallbackTheme;
  }

  const manualActive = enabled.find((theme) => theme.isActive);
  if (manualActive) {
    return manualActive;
  }

  return enabled[0] ?? null;
}

export function normalizeThemeSchedule(schedule?: ThemeActivationSchedule | null): ThemeActivationSchedule {
  const mode = schedule?.mode ?? "manual";
  const normalizedMode =
    mode === "interval"
      ? "scheduled"
      : mode === "from_date"
        ? "scheduled"
        : mode;

  return {
    mode: normalizedMode,
    startDate: schedule?.startDate ?? null,
    endDate: schedule?.endDate ?? null,
    startTime: schedule?.startTime ?? null,
    endTime: schedule?.endTime ?? null,
    timezone: schedule?.timezone ?? DEFAULT_THEME_SCHEDULE.timezone,
    priority: schedule?.priority ?? 0,
    fallbackThemeId: schedule?.fallbackThemeId ?? null,
  };
}
