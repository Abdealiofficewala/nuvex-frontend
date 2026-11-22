"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BrandingForm } from "@/components/admin/appearance/BrandingForm";
import { appearanceService } from "@/services/appearance.service";
import type { BrandingRecord } from "@/types/appearance";

type BrandingEditLoaderProps = {
  id: string;
};

export function BrandingEditLoader({ id }: BrandingEditLoaderProps) {
  const t = useTranslations("admin.appearance.branding");
  const [branding, setBranding] = useState<BrandingRecord | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void appearanceService.listBranding().then((items) => {
        setBranding(items.find((item) => item.id === id) ?? null);
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [id]);

  if (!branding) {
    return <p>{t("errors.load")}</p>;
  }

  return <BrandingForm mode="edit" initial={branding} />;
}
