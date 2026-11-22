import { isScheduleActiveAt } from "@/lib/appearance/schedule";
import type { ThemeLifecycleStatus, ThemeRecord } from "@/types/appearance";

export function computeThemeLifecycleStatus(theme: ThemeRecord, at: Date = new Date()): ThemeLifecycleStatus {
  if (theme.disabled) {
    return "disabled";
  }

  if (theme.isActive && theme.schedule.mode === "manual") {
    return "active";
  }

  if (theme.schedule.mode === "always" && !theme.disabled) {
    return theme.isFallback ? "active" : "active";
  }

  if (theme.schedule.mode === "scheduled" || theme.schedule.mode === "interval") {
    if (isScheduleActiveAt(theme.schedule, at)) {
      return "active";
    }

    if (theme.schedule.startDate) {
      const start = Date.parse(`${theme.schedule.startDate}T00:00:00`);
      if (!Number.isNaN(start) && at.getTime() < start) {
        return "scheduled";
      }
    }

    if (theme.schedule.endDate && !isScheduleActiveAt(theme.schedule, at)) {
      return "expired";
    }

    return "scheduled";
  }

  if (!theme.isActive && !theme.isFallback) {
    return "draft";
  }

  return theme.isActive ? "active" : "draft";
}
