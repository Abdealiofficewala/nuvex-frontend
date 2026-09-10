export type HakimiLogoMarkVariant = "duo" | "monochrome" | "white" | "bronze";

export type HakimiLogoLayout = "horizontal" | "stacked" | "symbol-only";

export type HakimiColorScheme = "light" | "dark";

export interface HakimiLogoMarkProps {
  size?: number;
  className?: string;
  decorative?: boolean;
}

export interface HakimiLogoProps {
  layout?: HakimiLogoLayout;
  variant?: HakimiLogoMarkVariant;
  scheme?: HakimiColorScheme;
  size?: number;
  compact?: boolean;
  className?: string;
}

export interface SplashScreenProps {
  onComplete?: () => void;
  className?: string;
  holdMs?: number;
  skippable?: boolean;
}
