import { siteConfig } from "@/config/site.config";
import { ADMIN_THEME_STORE_KEY } from "@/lib/constants";
import type { AdminThemeLogoKey } from "@/lib/admin-theme.config";
import type { ThemeColors, ThemeTokens } from "@/types/theme";

export type AdminThemeBranding = Record<AdminThemeLogoKey, string>;

export type AdminThemeDraft = {
  branding: AdminThemeBranding;
  colors: ThemeColors;
  fonts: ThemeTokens["fonts"];
  radius: ThemeTokens["radius"];
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function getDefaultAdminTheme(): AdminThemeDraft {
  return {
    branding: {
      logo: siteConfig.branding.logo,
      logoLight: siteConfig.branding.logoLight,
      logoDark: siteConfig.branding.logoDark,
      mobileLogo: siteConfig.branding.mobileLogo,
      favicon: siteConfig.branding.favicon,
    },
    colors: { ...siteConfig.theme.colors },
    fonts: { ...siteConfig.theme.fonts },
    radius: { ...siteConfig.theme.radius },
  };
}

export function getAdminThemeDraft(): AdminThemeDraft {
  return readJson(ADMIN_THEME_STORE_KEY, getDefaultAdminTheme());
}

export function saveAdminThemeDraft(draft: AdminThemeDraft) {
  writeJson(ADMIN_THEME_STORE_KEY, draft);
}

export function resetAdminThemeDraft(): AdminThemeDraft {
  const defaults = getDefaultAdminTheme();
  saveAdminThemeDraft(defaults);
  return defaults;
}
