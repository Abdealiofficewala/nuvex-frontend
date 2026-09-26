import { isValidDateOnly } from "@/lib/appearance/schedule";
import { isValidSlug, normalizeSlug } from "@/lib/appearance/slug";
import type {
  BrandingInput,
  ColorPaletteInput,
  ThemeActivationSchedule,
  ThemeInput,
} from "@/types/appearance";

const HEX_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export type ValidationErrors = Record<string, string>;

function required(value: string | undefined | null, key: string, errors: ValidationErrors) {
  if (!value?.trim()) {
    errors[key] = "required";
  }
}

function validateHex(value: string, key: string, errors: ValidationErrors) {
  if (!HEX_PATTERN.test(value.trim())) {
    errors[key] = "invalidColor";
  }
}

export function validateThemeInput(
  input: Partial<ThemeInput>,
  existingSlugs: string[] = [],
  options?: { themeId?: string },
): ValidationErrors {
  const errors: ValidationErrors = {};
  const name = input.name?.trim() ?? "";
  const slug = normalizeSlug(input.slug ?? input.name ?? "");

  required(name, "name", errors);

  if (!isValidSlug(slug)) {
    errors.slug = "invalidSlug";
  } else if (existingSlugs.includes(slug)) {
    errors.slug = "duplicateSlug";
  }

  if (!input.brandingId) {
    errors.brandingId = "required";
  }

  if (!input.colorPaletteId) {
    errors.colorPaletteId = "required";
  }

  validateThemeSchedule(input.schedule, errors, { themeId: options?.themeId });

  return errors;
}

function validateThemeSchedule(
  schedule: ThemeActivationSchedule | undefined,
  errors: ValidationErrors,
  context: { themeId?: string } = {},
) {
  const mode = schedule?.mode ?? "manual";

  if (mode === "from_date") {
    if (!schedule?.startDate || !isValidDateOnly(schedule.startDate)) {
      errors["schedule.startDate"] = "required";
    }
  }

  if (mode === "interval") {
    if (!schedule?.startDate || !isValidDateOnly(schedule.startDate)) {
      errors["schedule.startDate"] = "required";
    }

    if (!schedule?.endDate || !isValidDateOnly(schedule.endDate)) {
      errors["schedule.endDate"] = "required";
    }

    if (
      schedule?.startDate &&
      schedule?.endDate &&
      isValidDateOnly(schedule.startDate) &&
      isValidDateOnly(schedule.endDate) &&
      schedule.endDate < schedule.startDate
    ) {
      errors["schedule.endDate"] = "invalidRange";
    }

    if (!schedule?.fallbackThemeId) {
      errors["schedule.fallbackThemeId"] = "required";
    } else if (context.themeId && schedule.fallbackThemeId === context.themeId) {
      errors["schedule.fallbackThemeId"] = "selfReference";
    }
  }
}

export function validateBrandingInput(
  input: Partial<BrandingInput>,
  existingSlugs: string[] = [],
): ValidationErrors {
  const errors: ValidationErrors = {};
  const slug = normalizeSlug(input.slug ?? input.name ?? "");

  required(input.name, "name", errors);

  if (!isValidSlug(slug)) {
    errors.slug = "invalidSlug";
  } else if (existingSlugs.includes(slug)) {
    errors.slug = "duplicateSlug";
  }

  return errors;
}

export function validateColorPaletteInput(
  input: Partial<ColorPaletteInput>,
  existingSlugs: string[] = [],
): ValidationErrors {
  const errors: ValidationErrors = {};
  const slug = normalizeSlug(input.slug ?? input.name ?? "");

  required(input.name, "name", errors);

  if (!isValidSlug(slug)) {
    errors.slug = "invalidSlug";
  } else if (existingSlugs.includes(slug)) {
    errors.slug = "duplicateSlug";
  }

  if (input.colors) {
    for (const [key, value] of Object.entries(input.colors)) {
      if (typeof value === "string") {
        validateHex(value, `colors.${key}`, errors);
      }
    }
  }

  return errors;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
