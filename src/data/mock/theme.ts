import { siteConfig } from "@/config/site.config";
import type { ThemeTokens } from "@/types/theme";

export const mockTheme: ThemeTokens = {
  colors: { ...siteConfig.theme.colors },
  fonts: { ...siteConfig.theme.fonts },
  radius: { ...siteConfig.theme.radius },
};
