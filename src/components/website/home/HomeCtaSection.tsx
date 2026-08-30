import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { HeroActions } from "@/components/website/common/HeroActions";
import { ROUTES } from "@/lib/constants";

export async function HomeCtaSection() {
  const t = await getTranslations("home.cta");

  return (
    <section className="section industries-cta">
      <div className="container">
        <Reveal className={"industries-cta__band"}>
          <div className={"industries-cta__copy"}>
            <p className={"t-caption"}>{t("eyebrow")}</p>
            <h2 className="t-h2">{t("title")}</h2>
            <p className={cn("t-muted", "mt-4")}>{t("body")}</p>
          </div>
          <HeroActions
            className={"industries-cta__actions"}
            actions={[
              { href: ROUTES.quote, label: t("quote"), variant: "accent" },
              { href: ROUTES.contact, label: t("contact"), variant: "secondary" },
            ]}
          />
        </Reveal>
      </div>
    </section>
  );
}
