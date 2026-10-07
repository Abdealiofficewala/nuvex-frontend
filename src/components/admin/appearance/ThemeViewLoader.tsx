"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ThemeViewDetail } from "@/components/admin/appearance/ThemeViewDetail";
import { appearanceService } from "@/services/appearance.service";
import type { ResolvedTheme, ThemeRecord } from "@/types/appearance";

type ThemeViewLoaderProps = {
  id: string;
};

export function ThemeViewLoader({ id }: ThemeViewLoaderProps) {
  const t = useTranslations("admin.appearance.themes");
  const [theme, setTheme] = useState<ThemeRecord | null>(null);
  const [resolved, setResolved] = useState<ResolvedTheme | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void appearanceService.getTheme(id).then((payload) => {
        setTheme(payload.theme);
        setResolved(payload.resolved);
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [id]);

  if (!theme || !resolved) {
    return <p>{t("errors.load")}</p>;
  }

  return <ThemeViewDetail theme={theme} resolved={resolved} />;
}
