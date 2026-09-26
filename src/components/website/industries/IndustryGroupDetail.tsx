import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { MediaFill } from "@/components/ui/media-fill";
import { Reveal } from "@/components/ui/reveal";
import { HeroActions } from "@/components/website/common/HeroActions";
import { IndustryCard } from "@/components/website/industries/IndustryCard";
import { Link } from "@/i18n/routing";
import { ROUTES } from "@/lib/constants";
import type { Industry, Sector } from "@/types/industry";

type IndustryGroupDetailProps = {
  industry: Industry;
  sectors: Sector[];
};

export async function IndustryGroupDetail({ industry, sectors }: IndustryGroupDetailProps) {
  const t = await getTranslations("industries");

  return (
    <div className="industry-view">
      <div className="container">
        <Reveal className="industry-view__nav">
          <Link href={ROUTES.industries}>{t("detail.back")}</Link>
          <span aria-hidden="true">/</span>
          <span>{industry.name}</span>
        </Reveal>

        <div className="industry-view__hero">
          <Reveal>
            <div className="industry-view__media">
              <MediaFill
                src={industry.image}
                alt={industry.name}
                sizes="(max-width: 980px) 100vw, 55vw"
                priority
              />
            </div>
          </Reveal>
          <Reveal className="industry-view__copy" delay={80}>
            <p className={cn("t-caption", "industry-view__eyebrow")}>{industry.summary}</p>
            <h1 className="industry-view__title">{industry.name}</h1>
            {industry.description ? <p className="industry-view__lede">{industry.description}</p> : null}
          </Reveal>
        </div>
      </div>

      {sectors.length ? (
        <section className={cn("section", "industries-grid-section")}>
          <div className="container">
            <div className="industry-card-grid">
              {sectors.map((sector, index) => (
                <Reveal key={sector.id} delay={index * 60}>
                  <IndustryCard
                    industry={sector}
                    index={index}
                    viewLabel={t("grid.viewSector")}
                    applicationsLabel={t("grid.applicationsLabel")}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
