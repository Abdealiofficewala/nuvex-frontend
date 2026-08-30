import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { MediaFill } from "@/components/ui/media-fill";
import { Reveal } from "@/components/ui/reveal";
import { mockHomepage } from "@/data/mock/homepage";
import type { HomepageBenefit } from "@/types/homepage";

type WhyChooseProps = {
  benefits?: HomepageBenefit[];
  image?: string;
};

export async function WhyChoose({ benefits, image }: WhyChooseProps) {
  const t = await getTranslations("home.why");
  const items = benefits?.length ? benefits : mockHomepage.benefits;
  const src = image ?? mockHomepage.infrastructure.image;

  return (
    <section className="section">
      <div className="container split">
        <Reveal>
          <MediaFill src={src} className="featured__media why__media" sizes="50vw" />
        </Reveal>
        <Reveal delay={80}>
          <p className="t-caption">{t("eyebrow")}</p>
          <h2 className="t-h2">{t("title")}</h2>
          <div className={cn("reason-list", "mt-6")}>
            {items?.map((item, index) => (
              <article key={item.key}>
                <span className={"reason-list__n"}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="t-h3">{item.title}</h3>
                  <p className="t-muted">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
