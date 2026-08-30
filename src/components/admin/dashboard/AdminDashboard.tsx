import { getTranslations } from "next-intl/server";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { DashboardRecentMessages } from "@/components/admin/dashboard/DashboardRecentMessages";
import {
  DASHBOARD_STAT_KEYS,
  DASHBOARD_STAT_TONES,
  type DashboardStatKey,
} from "@/components/admin/dashboard/dashboard.config";
import type { ContactMessage } from "@/types/message";

type AdminDashboardProps = {
  stats: Record<DashboardStatKey, number>;
  messages: ContactMessage[];
};

export async function AdminDashboard({ stats, messages }: AdminDashboardProps) {
  const t = await getTranslations("admin.dashboard");
  const totalRecords = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="dash">
      <header className="dash-hero">
        <div className="dash-hero__grid" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="dash-hero__inner">
          <div className="dash-hero__copy">
            <p className="dash-hero__kicker">{t("kicker")}</p>
            <h1>{t("title")}</h1>
            <p className="dash-hero__body">{t("body")}</p>
          </div>
          <aside className="dash-hero__panel">
            <span className="dash-hero__panel-label">{t("snapshot")}</span>
            <strong className="dash-hero__panel-value">{totalRecords}</strong>
            <span className="dash-hero__panel-hint">{t("snapshotHint")}</span>
            <span className="dash-hero__panel-badge">{t("liveBadge")}</span>
          </aside>
        </div>
      </header>

      <section className="dash-stats" aria-label={t("metricsLabel")}>
        {DASHBOARD_STAT_KEYS.map((key) => (
          <StatCard
            key={key}
            statKey={key}
            tone={DASHBOARD_STAT_TONES[key]}
            label={t(key)}
            value={stats[key]}
            hint={t(`hints.${key}`)}
          />
        ))}
      </section>

      <DashboardRecentMessages messages={messages} totalCount={stats.messages} />
    </div>
  );
}
