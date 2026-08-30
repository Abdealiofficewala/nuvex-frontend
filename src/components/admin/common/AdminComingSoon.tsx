import { getTranslations } from "next-intl/server";
import { AdminComingSoonVisual } from "@/components/admin/common/AdminComingSoonVisual";

export async function AdminComingSoon() {
  const t = await getTranslations("admin.comingSoon");

  return (
    <section className="admin-soon" aria-labelledby="admin-soon-title">
      <div className="admin-soon__shell">
        <div className="admin-soon__art" aria-hidden="true">
          <div className="admin-soon__art-glow" />
          <AdminComingSoonVisual />
        </div>

        <div className="admin-soon__content">
          <span className="admin-soon__badge">{t("badge")}</span>
          <p className="admin-soon__eyebrow">{t("eyebrow")}</p>
          <h2 id="admin-soon-title" className="admin-soon__title">
            {t("title")}
          </h2>
          <p className="admin-soon__lede">{t("lede")}</p>
          <p className="admin-soon__hint">{t("hint")}</p>

          <div className="admin-soon__status">
            <div className="admin-soon__status-head">
              <span>{t("statusLabel")}</span>
              <span className="admin-soon__status-value">{t("statusValue")}</span>
            </div>
            <div className="admin-soon__track" role="presentation">
              <span className="admin-soon__fill" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
