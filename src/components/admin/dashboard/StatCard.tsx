import { DashboardStatIcon } from "@/components/admin/dashboard/DashboardIcons";
import type { DashboardStatKey } from "@/components/admin/dashboard/dashboard.config";

type StatCardProps = {
  label: string;
  value: number;
  hint?: string;
  statKey: DashboardStatKey;
  tone?: "primary" | "accent" | "neutral" | "success";
};

export function StatCard({ label, value, hint, statKey, tone = "primary" }: StatCardProps) {
  return (
    <article className={`dash-stat dash-stat--${tone}`}>
      <div className="dash-stat__shine" aria-hidden="true" />
      <div className="dash-stat__head">
        <span className="dash-stat__icon" aria-hidden="true">
          <DashboardStatIcon name={statKey} />
        </span>
        <span className="dash-stat__label">{label}</span>
      </div>
      <strong className="dash-stat__value">{value.toLocaleString()}</strong>
      {hint ? <span className="dash-stat__hint">{hint}</span> : null}
    </article>
  );
}
