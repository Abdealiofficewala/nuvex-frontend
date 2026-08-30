import { getTranslations } from "next-intl/server";
import { BackToWebsiteIcon } from "@/components/admin/header/AdminMenuIcons";
import { Link } from "@/i18n/routing";
import { ROUTES } from "@/lib/constants";

export async function AdminLoginBackLink() {
  const t = await getTranslations("admin.login");

  return (
    <Link href={ROUTES.home} className="admin-login__back" aria-label={t("backToSite")}>
      <span className="admin-login__back-icon" aria-hidden="true">
        <BackToWebsiteIcon />
      </span>
      <span className="admin-login__back-copy">
        <span className="admin-login__back-label">{t("backToSite")}</span>
        <span className="admin-login__back-hint">{t("backToSiteHint")}</span>
      </span>
    </Link>
  );
}
