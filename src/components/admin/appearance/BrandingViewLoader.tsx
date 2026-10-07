"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BrandingViewDetail } from "@/components/admin/appearance/BrandingViewDetail";
import { appearanceService } from "@/services/appearance.service";
import type { BrandingRecord } from "@/types/appearance";

type BrandingViewLoaderProps = {
  id: string;
};

export function BrandingViewLoader({ id }: BrandingViewLoaderProps) {
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

  return <BrandingViewDetail branding={branding} />;
}
