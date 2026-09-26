export type AppearanceColorTokens = {
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  sidebar: string;
  header: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  steel: string;
  graphite: string;
  line: string;
};

export type AppearanceTypographyTokens = {
  headingFont: string;
  bodyFont: string;
  baseFontSize: string;
  headingSizes: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
  };
  fontWeights: {
    heading: number;
    body: number;
    bold: number;
  };
  lineHeights: {
    heading: number;
    body: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
};

export type AppearanceSpacingTokens = {
  scale: number;
};

export type AppearanceRadiusTokens = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
};

export type AppearanceShadowTokens = {
  sm: string;
  md: string;
  lg: string;
};

export type AppearanceLayoutTokens = {
  sidebarWidth: string;
  headerHeight: string;
  contentMaxWidth: string;
};

export type AppearanceSidebarTokens = {
  background: string;
  text: string;
  mutedText: string;
  activeBackground: string;
  activeText: string;
  borderColor: string;
};

export type AppearanceHeaderTokens = {
  background: string;
  text: string;
  borderColor: string;
};

export type AppearanceComponentTokens = {
  button: {
    radius: string;
    primaryShadow: string;
  };
  card: {
    radius: string;
    shadow: string;
    borderColor: string;
  };
  form: {
    gap: string;
  };
  input: {
    radius: string;
    borderColor: string;
    focusRing: string;
  };
  table: {
    headerBackground: string;
    rowHover: string;
    borderColor: string;
  };
  badge: {
    radius: string;
  };
  alert: {
    radius: string;
  };
};

export type ThemeActivationMode = "manual" | "interval" | "from_date";

export type ThemeActivationSchedule = {
  mode: ThemeActivationMode;
  /** ISO date YYYY-MM-DD */
  startDate: string | null;
  /** ISO date YYYY-MM-DD — interval mode only */
  endDate: string | null;
  /** Theme used outside the interval window */
  fallbackThemeId: string | null;
};

export type ThemeDesignConfig = {
  spacing: AppearanceSpacingTokens;
  radius: AppearanceRadiusTokens;
  shadows: AppearanceShadowTokens;
  layout: AppearanceLayoutTokens;
  sidebar: AppearanceSidebarTokens;
  header: AppearanceHeaderTokens;
  components: AppearanceComponentTokens;
};

export type BrandingRecord = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  logoDark: string;
  logoLight: string;
  mobileLogo: string;
  favicon: string;
  applicationName: string;
  brandName: string;
  createdAt: string;
  updatedAt: string;
};

export type ColorPaletteRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  colors: AppearanceColorTokens;
  createdAt: string;
  updatedAt: string;
};

export type ThemeRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  brandingId: string | null;
  colorPaletteId: string | null;
  schedule: ThemeActivationSchedule;
  design: ThemeDesignConfig;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ResolvedTheme = {
  theme: ThemeRecord;
  branding: BrandingRecord;
  colors: AppearanceColorTokens;
  typography: AppearanceTypographyTokens;
  design: ThemeDesignConfig;
};

export type AppearanceStore = {
  themes: ThemeRecord[];
  branding: BrandingRecord[];
  colorPalettes: ColorPaletteRecord[];
};

export type ThemeInput = Pick<
  ThemeRecord,
  "name" | "slug" | "description" | "brandingId" | "colorPaletteId" | "schedule" | "design"
>;

export type BrandingInput = Pick<
  BrandingRecord,
  | "name"
  | "slug"
  | "logo"
  | "logoDark"
  | "logoLight"
  | "mobileLogo"
  | "favicon"
  | "applicationName"
  | "brandName"
>;

export type ColorPaletteInput = Pick<
  ColorPaletteRecord,
  "name" | "slug" | "description" | "colors"
>;

