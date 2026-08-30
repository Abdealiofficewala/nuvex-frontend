import { getTranslations } from "next-intl/server";
import { AdminStatusPage } from "@/components/admin/common/AdminStatusPage";
import { ROUTES } from "@/lib/constants";

export default async function AdminNotFound() {
  const t = await getTranslations("admin.notFound");

  return (
    <AdminStatusPage
      variant="not-found"
      code="404"
      eyebrow={t("eyebrow")}
      title={t("title")}
      lede={t("lede")}
      actions={[
        { href: ROUTES.admin.dashboard, label: t("dashboard"), variant: "primary" },
        { href: ROUTES.admin.login, label: t("login"), variant: "secondary" },
      ]}
    />
  );
}
