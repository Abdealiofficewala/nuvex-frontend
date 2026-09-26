import type {
  AppearanceColorTokens,
  AppearanceComponentTokens,
  AppearanceHeaderTokens,
  AppearanceLayoutTokens,
  AppearanceRadiusTokens,
  AppearanceShadowTokens,
  AppearanceSidebarTokens,
  AppearanceSpacingTokens,
  AppearanceTypographyTokens,
  BrandingRecord,
  ThemeActivationSchedule,
  ThemeDesignConfig,
} from "@/types/appearance";

export const DEFAULT_THEME_SCHEDULE: ThemeActivationSchedule = {
  mode: "manual",
  startDate: null,
  endDate: null,
  fallbackThemeId: null,
};

/** Neutral placeholders for new palette forms — not tied to site config. */
export function createEmptyColorTokens(): AppearanceColorTokens {
  return {
    primary: "#000000",
    primaryDark: "#000000",
    secondary: "#000000",
    accent: "#000000",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    text: "#000000",
    muted: "#666666",
    border: "#CCCCCC",
    sidebar: "#111111",
    header: "#FFFFFF",
    success: "#067647",
    warning: "#B54708",
    error: "#B42318",
    info: "#175CD3",
    steel: "#7B8490",
    graphite: "#0D1117",
    line: "#CCCCCC",
  };
}

export function createEmptyBrandingRecord(now: string, id = "missing-branding"): BrandingRecord {
  return {
    id,
    name: "",
    slug: "",
    logo: "",
    logoDark: "",
    logoLight: "",
    mobileLogo: "",
    favicon: "",
    applicationName: "",
    brandName: "",
    createdAt: now,
    updatedAt: now,
  };
}

/** Site-wide typography — loaded in root layout. Not theme-configurable. */
export const SITE_TYPOGRAPHY: AppearanceTypographyTokens = {
  headingFont: 'var(--font-heading), "Poppins", sans-serif',
  bodyFont: 'var(--font-body), "Inter", sans-serif',
  baseFontSize: "1rem",
  headingSizes: {
    h1: "clamp(2.2rem, 4vw, 3.4rem)",
    h2: "clamp(1.7rem, 3vw, 2.4rem)",
    h3: "1.25rem",
    h4: "1.05rem",
  },
  fontWeights: {
    heading: 600,
    body: 400,
    bold: 700,
  },
  lineHeights: {
    heading: 1.15,
    body: 1.7,
  },
  letterSpacing: {
    tight: "-0.03em",
    normal: "0",
    wide: "0.12em",
  },
};

export const DEFAULT_SPACING: AppearanceSpacingTokens = {
  scale: 1,
};

export const DEFAULT_RADIUS: AppearanceRadiusTokens = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
};

export const DEFAULT_SHADOWS: AppearanceShadowTokens = {
  sm: "0 1px 2px rgba(13, 17, 23, 0.06)",
  md: "0 8px 24px rgba(13, 17, 23, 0.08)",
  lg: "0 16px 40px rgba(13, 17, 23, 0.12)",
};

export const DEFAULT_LAYOUT: AppearanceLayoutTokens = {
  sidebarWidth: "260px",
  headerHeight: "72px",
  contentMaxWidth: "1280px",
};

export const DEFAULT_SIDEBAR: AppearanceSidebarTokens = {
  background: "#111111",
  text: "#E8EDF5",
  mutedText: "#9AA6B8",
  activeBackground: "rgba(193, 122, 58, 0.18)",
  activeText: "#FFFFFF",
  borderColor: "rgba(255, 255, 255, 0.08)",
};

export const DEFAULT_HEADER: AppearanceHeaderTokens = {
  background: "#FFFFFF",
  text: "#141A22",
  borderColor: "#D4CFC4",
};

export const DEFAULT_COMPONENTS: AppearanceComponentTokens = {
  button: {
    radius: DEFAULT_RADIUS.md,
    primaryShadow: DEFAULT_SHADOWS.sm,
  },
  card: {
    radius: DEFAULT_RADIUS.lg,
    shadow: DEFAULT_SHADOWS.md,
    borderColor: "#D4CFC4",
  },
  form: {
    gap: "16px",
  },
  input: {
    radius: DEFAULT_RADIUS.md,
    borderColor: "#D4CFC4",
    focusRing: "#2563eb",
  },
  table: {
    headerBackground: "#F7F5F0",
    rowHover: "rgba(30, 58, 95, 0.04)",
    borderColor: "#D4CFC4",
  },
  badge: {
    radius: "999px",
  },
  alert: {
    radius: DEFAULT_RADIUS.md,
  },
};

export const DEFAULT_DESIGN: ThemeDesignConfig = {
  spacing: DEFAULT_SPACING,
  radius: DEFAULT_RADIUS,
  shadows: DEFAULT_SHADOWS,
  layout: DEFAULT_LAYOUT,
  sidebar: DEFAULT_SIDEBAR,
  header: DEFAULT_HEADER,
  components: DEFAULT_COMPONENTS,
};
