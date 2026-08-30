import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MediaFill } from "@/components/ui/media-fill";
import { Reveal } from "@/components/ui/reveal";
import { HeroActions } from "@/components/website/common/HeroActions";
import { RevealIntro } from "@/components/website/common/RevealIntro";
import { IndustryCard } from "@/components/website/industries/IndustryCard";
import { IndustriesNav } from "@/components/website/industries/IndustriesNav";
import { ProcessSection } from "@/components/website/process/ProcessSection";
import { ROUTES } from "@/lib/constants";
import { parseContentBlocks, parseProcessSteps } from "@/lib/i18n-messages";
import { industriesService } from "@/services/industries.service";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("industries");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function IndustriesPage() {
  const t = await getTranslations("industries");
  const industries = await industriesService.getIndustries();
  const overviewItems = parseContentBlocks(t.raw("overview.items"));
  const supportSteps = parseProcessSteps(t.raw("support.steps"));

  return (
    <div className="industries-page">
      <section className={"industries-hero"}>
        <MediaFill
          src="/images/industries/infrastructure.jpg"
          className={"industries-hero__media"}
          alt={t("hero.imageAlt")}
          sizes="100vw"
          priority
        />
        <div className={cn("container", "industries-hero__inner")}>
          <p className={cn("t-caption", "industries-hero__eyebrow")}>{t("hero.eyebrow")}</p>
          <h1 className={"industries-hero__title"}>{t("hero.title")}</h1>
          <p className={"industries-hero__lede"}>{t("hero.lede")}</p>
          <HeroActions
            className={"industries-hero__actions"}
            actions={[
              { href: ROUTES.quote, label: t("hero.ctaQuote"), variant: "accent" },
              { href: ROUTES.products, label: t("hero.ctaProducts"), variant: "ghost" },
            ]}
          />
        </div>
      </section>

      {industries?.length ? (
        <IndustriesNav
          items={industries.map((industry) => ({
            id: industry.id,
            slug: industry.slug,
            name: industry.name,
          }))}
          label={t("grid.navLabel")}
        />
      ) : null}

      <section className={cn("section", "industries-overview")}>
        <div className="container">
          <RevealIntro
            className={"industries-overview__intro"}
            eyebrow={t("overview.eyebrow")}
            title={t("overview.title")}
            body={t("overview.lede")}
          />
          <ol className={"industries-overview__track"}>
            {overviewItems.map((item, index) => (
              <Reveal
                as="li"
                key={item.title}
                className={"industries-overview__step"}
                delay={index * 70}
              >
                <span className={"industries-overview__n"}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={"industries-overview__card"}>
                  <h3 className={"t-h3"}>{item.title}</h3>
                  <p className={"t-muted"}>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className={cn("section", "industries-grid-section")}>
        <div className="container">
          <RevealIntro
            eyebrow={t("grid.eyebrow")}
            title={t("grid.title")}
            body={t("grid.lede")}
          />
          <div className="industry-card-grid">
            {industries?.map((industry, index) => (
              <Reveal key={industry.id} delay={index * 60}>
                <IndustryCard
                  industry={industry}
                  index={index}
                  viewLabel={t("grid.viewSector")}
                  applicationsLabel={t("grid.applicationsLabel")}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection
        eyebrow={t("support.eyebrow")}
        title={t("support.title")}
        lede={t("support.lede")}
        steps={supportSteps}
        stepLabel={t("support.stepLabel")}
      />

      <section className="section industries-cta">
        <div className="container">
          <Reveal className={"industries-cta__band"}>
            <div className={"industries-cta__copy"}>
              <p className={"t-caption"}>{t("cta.eyebrow")}</p>
              <h2 className="t-h2">{t("cta.title")}</h2>
              <p className={cn("t-muted", "mt-4")}>{t("cta.body")}</p>
            </div>
            <HeroActions
              className={"industries-cta__actions"}
              actions={[
                { href: ROUTES.quote, label: t("cta.quote"), variant: "accent" },
                { href: ROUTES.contact, label: t("cta.contact"), variant: "secondary" },
              ]}
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
