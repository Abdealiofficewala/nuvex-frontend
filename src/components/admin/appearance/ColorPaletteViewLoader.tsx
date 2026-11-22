"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ColorPaletteViewDetail } from "@/components/admin/appearance/ColorPaletteViewDetail";
import { appearanceService } from "@/services/appearance.service";
import type { ColorPaletteRecord } from "@/types/appearance";

type ColorPaletteViewLoaderProps = {
  id: string;
};

export function ColorPaletteViewLoader({ id }: ColorPaletteViewLoaderProps) {
  const t = useTranslations("admin.appearance.colors");
  const [palette, setPalette] = useState<ColorPaletteRecord | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void appearanceService.listColorPalettes().then((items) => {
        setPalette(items.find((item) => item.id === id) ?? null);
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [id]);

  if (!palette) {
    return <p>{t("errors.load")}</p>;
  }

  return <ColorPaletteViewDetail palette={palette} />;
}
