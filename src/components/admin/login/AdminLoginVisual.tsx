import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/website/common/BrandLogo";
import { AdminLoginHeroPanel } from "@/components/admin/login/AdminLoginHeroPanel";
import { ADMIN_LOGIN_MEDIA } from "@/lib/constants";
import { siteConfig } from "@/config/site.config";

export async function AdminLoginVisual() {
  const t = await getTranslations("admin.login.visual");

  return (
    <aside className="admin-login__visual" aria-label={t("panelLabel", { company: siteConfig.company.shortName })}>
      <Image
        src={ADMIN_LOGIN_MEDIA.src}
        alt=""
        fill
        priority
        sizes="(max-width: 900px) 100vw, 65vw"
        className="admin-login__visual-image"
        aria-hidden="true"
      />
      <div className="admin-login__visual-shade" aria-hidden="true" />

      <div className="admin-login__visual-top">
        <BrandLogo variant="light" height={36} />
        <span className="admin-login__badge">{t("badge")}</span>
      </div>

      <AdminLoginHeroPanel />
    </aside>
  );
}
