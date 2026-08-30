import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { MediaFill } from "@/components/ui/media-fill";
import { Reveal } from "@/components/ui/reveal";
import { HeroActions } from "@/components/website/common/HeroActions";
import { IndustryCard } from "@/components/website/industries/IndustryCard";
import { Link } from "@/i18n/routing";
import { industryHref, ROUTES } from "@/lib/constants";
import type { Industry } from "@/types/industry";

type SectorDetail = {
  body?: string;
  highlights?: string[];
  requirements?: string[];
};

type IndustryDetailProps = {
  industry: Industry;
  related?: Industry[];
  sector?: SectorDetail;
};

export async function IndustryDetail({ industry, related, sector }: IndustryDetailProps) {
  const t = await getTranslations("industries");
  const cta = await getTranslations("common");
  const body = sector?.body ?? industry?.description;
  const highlights = sector?.highlights ?? [];
  const requirements = sector?.requirements ?? [];

  return (
    <div className={"industry-view"}>
      <div className="container">
        <Reveal className={"industry-view__nav"}>
          <Link href={ROUTES.industries}>{t("detail.back")}</Link>
          <span aria-hidden="true">/</span>
          <span>{industry?.name}</span>
        </Reveal>

        <div className={"industry-view__hero"}>
          <Reveal>
            <div className={"industry-view__media"}>
              <MediaFill
                src={industry?.image}
                alt={industry?.name ?? ""}
                sizes="(max-width: 980px) 100vw, 55vw"
                priority
              />
            </div>
          </Reveal>
          <Reveal className="industry-view__copy" delay={80}>
            <p className={cn("t-caption", "industry-view__eyebrow")}>{industry?.summary}</p>
            <h1 className={"industry-view__title"}>{industry?.name}</h1>
            {body ? <p className={"industry-view__lede"}>{body}</p> : null}
            {industry?.applications?.length ? (
              <div className={"industry-view__apps"}>
                <p className={"t-caption"}>{t("detail.applicationsLabel")}</p>
                <ul className={"industry-view__chips"}>
                  {industry.applications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <HeroActions
              className={"industry-view__actions"}
              actions={[
                { href: ROUTES.quote, label: t("detail.quote"), variant: "accent" },
                { href: ROUTES.products, label: cta("cta.viewProducts"), variant: "secondary" },
              ]}
            />
          </Reveal>
        </div>

        {(highlights.length > 0 || requirements.length > 0) && (
          <div className={"industry-view__panels"}>
            {highlights.length > 0 ? (
              <Reveal className={"industry-panel"}>
                <h2 className="t-h3">{t("detail.highlightsLabel")}</h2>
                <ul className={cn("industry-view__list", "mt-4")}>
                  {highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
            {requirements.length > 0 ? (
              <Reveal className={"industry-panel"} delay={70}>
                <h2 className="t-h3">{t("detail.requirementsLabel")}</h2>
                <ul className={cn("industry-view__list", "mt-4")}>
                  {requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
        )}
      </div>

      {related?.length ? (
        <section className="related-rail">
          <div className="container">
            <Reveal className="related-rail__head">
              <div>
                <p className={"t-caption"}>{t("detail.relatedEyebrow")}</p>
                <h2 className="t-h2">{t("detail.related")}</h2>
                <p className={cn("t-muted", "related-rail__lede")}>{t("detail.relatedLede")}</p>
              </div>
              <Link href={ROUTES.industries} className="related-rail__browse">
                {t("detail.relatedBrowse")}
              </Link>
            </Reveal>
            <div className="industry-card-grid industry-card-grid--rail">
              {related.map((item, index) => (
                <IndustryCard
                  key={item.id}
                  industry={item}
                  index={index}
                  viewLabel={t("grid.viewSector")}
                  compact
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={cn("section", "industries-cta", "industries-cta--detail")}>
        <div className="container">
          <Reveal className={"industries-cta__band"}>
            <div className={"industries-cta__copy"}>
              <p className={"t-caption"}>{t("cta.eyebrow")}</p>
              <h2 className="t-h2">{t("detail.quoteTitle", { sector: industry?.name ?? "" })}</h2>
              <p className={cn("t-muted", "mt-4")}>{t("detail.quoteBody")}</p>
            </div>
            <HeroActions
              className={"industries-cta__actions"}
              actions={[
                { href: ROUTES.quote, label: t("cta.quote"), variant: "accent" },
                { href: industryHref(), label: t("detail.back"), variant: "secondary" },
              ]}
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
