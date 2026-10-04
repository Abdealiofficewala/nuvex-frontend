import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/website/common/BrandLogo";
import { LoginForm } from "@/components/admin/forms/LoginForm";
import { AdminLoginBackLink } from "@/components/admin/login/AdminLoginBackLink";
import { AdminLoginVisual } from "@/components/admin/login/AdminLoginVisual";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { siteConfig } from "@/config/site.config";

export default async function AdminLoginPage() {
  const t = await getTranslations("admin.login");
  const company = siteConfig.company.shortName;

  return (
    <div className="admin-login">
      <AdminLoginVisual />

      <div className="admin-login__shell">
        <div className="admin-login__utilities">
          <LanguageSwitcher className="admin-login__lang" />
        </div>

        <main className="admin-login__main" id="main-content">
          <div className="admin-login__card">
            <div className="admin-login__brand">
              <BrandLogo variant="default" height={40} />
            </div>

            <header className="admin-login__intro">
              <h1 className="admin-login__title">{t("title", { company })}</h1>
              <p className="admin-login__lede">{t("body")}</p>
            </header>

            <LoginForm />

            <AdminLoginBackLink />
          </div>
        </main>
      </div>
    </div>
  );
}
