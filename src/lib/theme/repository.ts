import type { Theme, ThemeRepository } from "@/config/theme/types";
import type { ThemeActivationSchedule, ThemeInput } from "@/types/appearance";

/**
 * Server-side repository contract. Implemented by `appearance-store` functions.
 * Client UI uses `appearanceService` with the same operations over HTTP.
 */
export type ThemeRepositoryServer = ThemeRepository;

export type CreateThemePayload = ThemeInput;
export type UpdateThemePayload = Partial<ThemeInput>;

export function isTheme(value: unknown): value is Theme {
  return Boolean(value && typeof value === "object" && "id" in value && "branding" in value);
}

export type ScheduleThemePayload = ThemeActivationSchedule;
