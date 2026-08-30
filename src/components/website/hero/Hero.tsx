import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { MediaFill } from "@/components/ui/media-fill";
import { BrowseLink } from "@/components/website/common/BrowseLink";
import { MultiLineTitle } from "@/components/website/common/MultiLineTitle";
import { Link } from "@/i18n/routing";
import { mockHomepage } from "@/data/mock/homepage";
import { ROUTES } from "@/lib/constants";
import { parseTitleLines } from "@/lib/i18n-messages";
import type { HomepageContent } from "@/types/homepage";

type HeroProps = {
  content?: HomepageContent;
};

export async function Hero({ content }: HeroProps) {
  const t = await getTranslations("home");
  const cta = await getTranslations("common");
  const hero = content?.hero ?? mockHomepage.hero;
  const titleLines = parseTitleLines(t.raw("hero.titleLines"), t("hero.title"));

  return (
    <section className={"hero"}>
      <MediaFill
        src={hero?.image}
        className={"hero__media"}
        alt={t("hero.imageAlt")}
        sizes="100vw"
        priority
      />
      <div className={cn("container", "hero__content")}>
        <p className={cn("hero__eyebrow", "hero__rise", "hero__rise--1")}>{t("hero.eyebrow")}</p>
        <h1 className={cn("t-display", "hero__title", "hero__rise", "hero__rise--2")}>
          <MultiLineTitle lines={titleLines} className={"hero__title-line"} />
        </h1>
        <p className={cn("t-body-lg", "mt-4", "hero__lede", "hero__rise", "hero__rise--3")}>{t("hero.body")}</p>
        <div className={cn("hero__actions", "hero__rise", "hero__rise--4")}>
          <Link href={hero?.primaryHref ?? ROUTES.products} className={cn("hero-action", "hero-action--primary")}>
            {cta("cta.viewProducts")}
          </Link>
          <BrowseLink
            href={ROUTES.industries}
            label={t("hero.ctaIndustries")}
            className={"browse-link--hero"}
          />
        </div>
      </div>
    </section>
  );
}
