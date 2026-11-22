import type {
  AppearanceColorTokens,
  AppearanceTypographyTokens,
  BrandingRecord,
  ThemeActivationSchedule,
  ThemeDesignConfig,
  ThemeLifecycleStatus,
  ThemeRecord,
} from "@/types/appearance";

export type { ThemeLifecycleStatus };

export type BrandIdentity = Pick<
  BrandingRecord,
  | "applicationName"
  | "brandName"
  | "logo"
  | "logoDark"
  | "logoLight"
  | "mobileLogo"
  | "favicon"
>;

export type ColorConfig = AppearanceColorTokens;

export type TypographyConfig = AppearanceTypographyTokens;

export type ShapeConfig = {
  borderRadius: string;
  buttonRadius: string;
  scale: ThemeDesignConfig["radius"];
};

export type AppearanceConfig = {
  colorScheme: "light" | "dark" | "system";
  allowUserThemeSwitch: boolean;
};

export type ThemeActivation = ThemeActivationSchedule & {
  status: ThemeLifecycleStatus;
  isFallback: boolean;
  disabled: boolean;
};

/** Canonical CMS theme shape (API / admin preview). */
export type Theme = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  branding: BrandIdentity;
  colors: ColorConfig;
  typography: TypographyConfig;
  shape: ShapeConfig;
  appearance: AppearanceConfig;
  activation: ThemeActivation;
  updatedAt: string;
};

export type ThemeRepository = {
  getThemes(): Promise<Theme[]>;
  getActiveTheme(at?: Date): Promise<Theme | null>;
  createTheme(input: unknown): Promise<Theme>;
  updateTheme(id: string, input: unknown): Promise<Theme>;
  duplicateTheme(id: string, options?: { name?: string; slug?: string }): Promise<Theme>;
  activateTheme(id: string): Promise<Theme>;
  scheduleTheme(id: string, schedule: ThemeActivationSchedule): Promise<Theme>;
  disableTheme(id: string): Promise<Theme>;
};

export type ResolvedThemeBundle = {
  record: ThemeRecord;
  theme: Theme;
};
