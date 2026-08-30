import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/website/common/BrandLogo";
import { LoginForm } from "@/components/admin/forms/LoginForm";
import { AdminLoginBackLink } from "@/components/admin/login/AdminLoginBackLink";
import { AdminLoginVisual } from "@/components/admin/login/AdminLoginVisual";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default async function AdminLoginPage() {
  const t = await getTranslations("admin.login");

  return (
    <div className="admin-login">
      <AdminLoginVisual />

      <div className="admin-login__panel">
        <div className="admin-login__topbar">
          <BrandLogo variant="light" height={32} className="admin-login__mobile-logo" />
          <LanguageSwitcher className="admin-login__lang" />
        </div>

        <div className="admin-login__form-wrap">
          <div className="admin-login__intro">
            <p className="admin-login__kicker">{t("kicker")}</p>
            <h2>{t("title")}</h2>
            <p className="admin-login__lede">{t("body")}</p>
          </div>

          <LoginForm />

          <AdminLoginBackLink />
        </div>
      </div>
    </div>
  );
}
