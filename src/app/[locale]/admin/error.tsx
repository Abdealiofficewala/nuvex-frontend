"use client";

import { useTranslations } from "next-intl";
import { AdminStatusPage } from "@/components/admin/common/AdminStatusPage";
import { ROUTES } from "@/lib/constants";

type AdminErrorProps = {
  reset: () => void;
};

export default function AdminError({ reset }: AdminErrorProps) {
  const t = useTranslations("admin.error");

  return (
    <AdminStatusPage
      variant="error"
      code="500"
      eyebrow={t("eyebrow")}
      title={t("title")}
      lede={t("lede")}
      actions={[
        { label: t("retry"), onClick: reset, variant: "primary" },
        { href: ROUTES.admin.login, label: t("login"), variant: "secondary" },
      ]}
    />
  );
}
