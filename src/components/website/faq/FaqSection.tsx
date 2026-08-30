import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { BrowseLink } from "@/components/website/common/BrowseLink";
import { MultiLineTitle } from "@/components/website/common/MultiLineTitle";
import { ROUTES } from "@/lib/constants";
import { parseTitleLines } from "@/lib/i18n-messages";
import type { FaqItem } from "@/types/faq";

type FaqSectionProps = {
  items?: FaqItem[];
};

export async function FaqSection({ items }: FaqSectionProps) {
  const t = await getTranslations("home.faq");
  const titleLines = parseTitleLines(t.raw("titleLines"), t("title"));

  if (!items?.length) {
    return null;
  }

  return (
    <section className={cn("section", "section--tight", "faq-section")}>
      <div className="container">
        <div className={"faq-section__layout"}>
          <Reveal className={"faq-section__intro"}>
            <p className="t-caption">{t("eyebrow")}</p>
            <h2 className={cn("t-h2", "faq-section__title")}>
              <MultiLineTitle lines={titleLines} className={"faq-section__title-line"} />
            </h2>
            <p className={"faq-section__lede"}>{t("lede")}</p>
            <BrowseLink href={ROUTES.contact} label={t("contact")} className="browse-link--section" />
          </Reveal>

          <div className={"faq-section__list"}>
            <Reveal delay={40}>
              <div className={"faq-panel"}>
                {items.map((item) => (
                  <details key={item.id} className={"faq-item"}>
                    <summary className={"faq-item__summary"}>
                      <span className={"faq-item__question"}>{item.question}</span>
                      <span className={"faq-item__toggle"} aria-hidden="true" />
                    </summary>
                    <div className={"faq-item__answer"}>
                      <p>{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
