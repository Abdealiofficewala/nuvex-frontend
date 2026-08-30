import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { MediaFill } from "@/components/ui/media-fill";
import { Reveal } from "@/components/ui/reveal";
import { mockHomepage } from "@/data/mock/homepage";
import type { HomepageInfrastructure } from "@/types/homepage";

type InfrastructureSectionProps = {
  content?: HomepageInfrastructure;
};

export async function InfrastructureSection({ content }: InfrastructureSectionProps) {
  const t = await getTranslations("home.infrastructure");
  const src = content?.image ?? mockHomepage.infrastructure.image;

  return (
    <section className={"infra"}>
      <MediaFill src={src} className={"infra__media"} sizes="100vw" />
      <div className={cn("container", "infra__copy")}>
        <Reveal>
          <p className="t-caption">{t("eyebrow")}</p>
          <h2 className="t-h2">{t("title")}</h2>
          <p className="t-body-lg mt-4 infra__body">{t("body")}</p>
        </Reveal>
      </div>
    </section>
  );
}
