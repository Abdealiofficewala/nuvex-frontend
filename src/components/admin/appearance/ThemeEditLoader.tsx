"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ThemeForm } from "@/components/admin/appearance/ThemeForm";
import { appearanceService } from "@/services/appearance.service";
import type { ThemeRecord } from "@/types/appearance";

type ThemeEditLoaderProps = {
  id: string;
};

export function ThemeEditLoader({ id }: ThemeEditLoaderProps) {
  const t = useTranslations("admin.appearance.themes");
  const [theme, setTheme] = useState<ThemeRecord | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void appearanceService.getTheme(id).then((payload) => setTheme(payload.theme));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [id]);

  if (!theme) {
    return <p>{t("errors.load")}</p>;
  }

  return <ThemeForm mode="edit" initialTheme={theme} />;
}
