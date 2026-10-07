"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ColorPaletteForm } from "@/components/admin/appearance/ColorPaletteForm";
import { appearanceService } from "@/services/appearance.service";
import type { ColorPaletteRecord } from "@/types/appearance";

type ColorPaletteEditLoaderProps = {
  id: string;
};

export function ColorPaletteEditLoader({ id }: ColorPaletteEditLoaderProps) {
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

  return <ColorPaletteForm mode="edit" initial={palette} />;
}
