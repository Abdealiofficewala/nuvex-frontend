import { cn } from "@/lib/utils";
import { MediaFill } from "@/components/ui/media-fill";
import { StatCounter } from "@/components/website/stats/StatCounter";
import type { ResolvedCompanyStrengthStat } from "@/lib/company-strength";

type CompanyStrengthCardProps = {
  stat: ResolvedCompanyStrengthStat;
  delay?: number;
};

export function CompanyStrengthCard({ stat, delay = 0 }: CompanyStrengthCardProps) {
  const layout = stat.layout;
  const decorativeImage = layout === "backdrop";

  return (
    <article
      className={cn(
        "company-strength-card",
        layout === "backdrop" && "company-strength-card--backdrop",
        layout === "split" && "company-strength-card--split",
        layout === "media-end" && "company-strength-card--media-end",
      )}
    >
      {stat.image ? (
        <div className="company-strength-card__media" aria-hidden={decorativeImage ? true : undefined}>
          <MediaFill
            src={stat.image}
            alt={decorativeImage ? "" : stat.imageAlt}
            sizes="(max-width: 720px) 100vw, 50vw"
            className="company-strength-card__image media-fill"
          />
          {layout === "backdrop" ? <div className="company-strength-card__scrim" /> : null}
        </div>
      ) : null}

      <div className="company-strength-card__body">
        <p className="company-strength-card__value">
          <StatCounter value={stat.value} delay={delay} />
        </p>
        <h3 className="company-strength-card__title">{stat.title}</h3>
        {stat.description ? <p className="company-strength-card__desc">{stat.description}</p> : null}
      </div>
    </article>
  );
}
