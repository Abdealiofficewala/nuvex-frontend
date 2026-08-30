"use client";

import { useTranslations } from "next-intl";
import { StatusPage } from "@/components/website/common/StatusPage";
import { ROUTES } from "@/lib/constants";

type WebsiteErrorProps = {
  reset: () => void;
};

export default function WebsiteError({ reset }: WebsiteErrorProps) {
  const t = useTranslations("common");

  return (
    <StatusPage
      variant="error"
      code="500"
      eyebrow={t("error.eyebrow")}
      title={t("error.title")}
      lede={t("error.lede")}
      actions={[
        { label: t("error.retry"), onClick: reset, variant: "primary" },
        { href: ROUTES.home, label: t("error.home"), variant: "secondary" },
      ]}
    />
  );
}
