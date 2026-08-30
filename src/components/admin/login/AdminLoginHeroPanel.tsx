import { getTranslations } from "next-intl/server";
import { ADMIN_LOGIN_FEATURES } from "@/components/admin/login/login-visual.config";
import { ChartIcon, FeatureIcon, ShieldIcon } from "@/components/admin/login/AdminLoginIcons";
import type { AdminLoginFeatureKey } from "@/types/admin-login";

const featureIcons: Record<AdminLoginFeatureKey, typeof FeatureIcon> = {
  products: FeatureIcon,
  inquiries: ChartIcon,
  company: ShieldIcon,
};

export async function AdminLoginHeroPanel() {
  const t = await getTranslations("admin.login.visual");

  return (
    <div className="admin-login-hero">
      <p className="admin-login-hero__eyebrow">{t("eyebrow")}</p>
      <h1 className="admin-login-hero__title">{t("title")}</h1>
      <p className="admin-login-hero__body">{t("body")}</p>

      <ul className="admin-login-hero__list">
        {ADMIN_LOGIN_FEATURES.map(({ key }) => {
          const Icon = featureIcons[key];

          return (
            <li key={key} className="admin-login-hero__item">
              <span className="admin-login-hero__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="admin-login-hero__copy">
                <strong>{t(`features.${key}.title`)}</strong>
                <span>{t(`features.${key}.body`)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
