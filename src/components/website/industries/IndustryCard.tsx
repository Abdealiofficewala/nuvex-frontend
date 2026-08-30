import { cn } from "@/lib/utils";
import { MediaFill } from "@/components/ui/media-fill";
import { BrowseLink } from "@/components/website/common/BrowseLink";
import { Link } from "@/i18n/routing";
import { industryHref } from "@/lib/constants";
import type { Industry } from "@/types/industry";

type IndustryCardProps = {
  industry: Industry;
  index?: number;
  viewLabel: string;
  applicationsLabel?: string;
  compact?: boolean;
};

export function IndustryCard({
  industry,
  index,
  viewLabel,
  applicationsLabel,
  compact = false,
}: IndustryCardProps) {
  const href = industryHref(industry?.slug);
  const number = index != null ? String(index + 1).padStart(2, "0") : null;

  return (
    <article className={`industry-card${compact ? " industry-card--compact" : ""}`}>
      <Link href={href} className={"industry-card__link"}>
        <div className={"industry-card__media"}>
          <MediaFill
            src={industry?.image}
            alt={industry?.name ?? ""}
            sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
          {number ? (
            <span className={"industry-card__index"} aria-hidden="true">
              {number}
            </span>
          ) : null}
        </div>
        <div className={"industry-card__body"}>
          {!compact && industry?.summary ? (
            <p className={cn("t-caption", "industry-card__eyebrow")}>{industry?.summary}</p>
          ) : null}
          <h2 className={"industry-card__title"}>{industry?.name}</h2>
          {!compact && industry?.description ? (
            <p className={cn("t-muted", "industry-card__desc")}>{industry.description}</p>
          ) : null}
          {!compact && industry?.applications?.length && applicationsLabel ? (
            <div className={"industry-card__apps"}>
              <p className={cn("t-caption", "industry-card__apps-label")}>{applicationsLabel}</p>
              <ul className={"industry-card__chips"}>
                {industry.applications.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <BrowseLink label={viewLabel} className={"browse-link--card"} />
        </div>
      </Link>
    </article>
  );
}
