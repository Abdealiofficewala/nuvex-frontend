"use client";

import { useCallback, useEffect, useState } from "react";
import { APPEARANCE_UPDATED_EVENT } from "@/lib/constants";
import { appearanceService } from "@/services/appearance.service";
import type { BrandingRecord, ColorPaletteRecord } from "@/types/appearance";

export function useAppearanceResources() {
  const [branding, setBranding] = useState<BrandingRecord[]>([]);
  const [colorPalettes, setColorPalettes] = useState<ColorPaletteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [brandingItems, paletteItems] = await Promise.all([
        appearanceService.listBranding(),
        appearanceService.listColorPalettes(),
      ]);

      setBranding(brandingItems);
      setColorPalettes(paletteItems);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to load appearance resources");
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

  return {
    branding,
    colorPalettes,
    loading,
    error,
    refresh,
  };
}
