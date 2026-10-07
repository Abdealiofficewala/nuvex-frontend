"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { resolvedThemeToCssVars } from "@/lib/appearance/css-vars";
import { APPEARANCE_UPDATED_EVENT } from "@/lib/constants";
import { appearanceService } from "@/services/appearance.service";
import type { GlobalAppearanceSettings, ResolvedTheme } from "@/types/appearance";

type ThemeProviderValue = {
  resolved: ResolvedTheme | null;
  settings: GlobalAppearanceSettings | null;
  previewResolved: ResolvedTheme | null;
  setPreviewResolved: (theme: ResolvedTheme | null) => void;
  cssVars: CSSProperties;
  colorScheme: "light" | "dark";
  refresh: () => Promise<void>;
};

const ThemeContext = createContext<ThemeProviderValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
  initialResolved?: ResolvedTheme | null;
  initialSettings?: GlobalAppearanceSettings | null;
};

function resolveColorScheme(
  settings: GlobalAppearanceSettings | null,
  themeMode: ResolvedTheme["theme"]["appearance"]["colorScheme"] | undefined,
): "light" | "dark" {
  const preferred = themeMode ?? settings?.defaultColorScheme ?? "system";

  if (preferred === "dark") {
    return "dark";
  }

  if (preferred === "light") {
    return "light";
  }

  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

export function ThemeProvider({ children, initialResolved = null, initialSettings = null }: ThemeProviderProps) {
  const [resolved, setResolved] = useState<ResolvedTheme | null>(initialResolved);
  const [settings, setSettings] = useState<GlobalAppearanceSettings | null>(initialSettings);
  const [previewResolved, setPreviewResolved] = useState<ResolvedTheme | null>(null);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  const refresh = useCallback(async () => {
    const [active, appearanceSettings] = await Promise.all([
      appearanceService.getActiveTheme(),
      appearanceService.getAppearanceSettings(),
    ]);
    setResolved(active);
    setSettings(appearanceSettings);
    setColorScheme(resolveColorScheme(appearanceSettings, active?.theme.appearance?.colorScheme));
  }, []);

  useEffect(() => {
    if (!initialResolved) {
      void refresh();
    }

    const onUpdated = () => void refresh();
    window.addEventListener(APPEARANCE_UPDATED_EVENT, onUpdated);
    return () => window.removeEventListener(APPEARANCE_UPDATED_EVENT, onUpdated);
  }, [initialResolved, refresh]);

  const cssVars = useMemo(() => {
    const source = previewResolved ?? resolved;
    return source ? resolvedThemeToCssVars(source) : {};
  }, [previewResolved, resolved]);

  const value = useMemo(
    () => ({
      resolved,
      settings,
      previewResolved,
      setPreviewResolved,
      cssVars,
      colorScheme,
      refresh,
    }),
    [resolved, settings, previewResolved, cssVars, colorScheme, refresh],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={colorScheme === "dark" ? "dark theme-runtime" : "theme-runtime"}
        style={value.cssVars}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

export function useThemeOptional() {
  return useContext(ThemeContext);
}
