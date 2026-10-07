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
import type { ResolvedTheme } from "@/types/appearance";

type ActiveThemeContextValue = {
  resolved: ResolvedTheme | null;
  loading: boolean;
  refresh: () => Promise<void>;
  previewResolved: ResolvedTheme | null;
  setPreviewResolved: (theme: ResolvedTheme | null) => void;
  cssVars: CSSProperties;
};

const ActiveThemeContext = createContext<ActiveThemeContextValue | null>(null);

type ActiveThemeProviderProps = {
  children: ReactNode;
};

export function ActiveThemeProvider({ children }: ActiveThemeProviderProps) {
  const [resolved, setResolved] = useState<ResolvedTheme | null>(null);
  const [previewResolved, setPreviewResolved] = useState<ResolvedTheme | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const active = await appearanceService.getActiveTheme();
      setResolved(active);
    } catch {
      setResolved(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void refresh();
    });

    const onUpdated = () => {
      void refresh();
    };

    window.addEventListener(APPEARANCE_UPDATED_EVENT, onUpdated);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(APPEARANCE_UPDATED_EVENT, onUpdated);
    };
  }, [refresh]);

  const cssVars = useMemo(() => {
    const source = previewResolved ?? resolved;
    return source ? resolvedThemeToCssVars(source) : {};
  }, [previewResolved, resolved]);

  const value = useMemo<ActiveThemeContextValue>(
    () => ({
      resolved,
      loading,
      refresh,
      previewResolved,
      setPreviewResolved,
      cssVars,
    }),
    [resolved, loading, refresh, previewResolved, cssVars],
  );

  return (
    <ActiveThemeContext.Provider value={value}>
      <div className="admin-theme-runtime" style={value.cssVars}>
        {children}
      </div>
    </ActiveThemeContext.Provider>
  );
}

export function useActiveTheme() {
  const context = useContext(ActiveThemeContext);
  if (!context) {
    throw new Error("useActiveTheme must be used within ActiveThemeProvider");
  }

  return context;
}

export function useActiveThemeOptional() {
  return useContext(ActiveThemeContext);
}
