import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { HomeIndustriesRail } from "@/components/website/industries/HomeIndustriesRail";
import { SectionHead } from "@/components/website/common/SectionHead";
import { ROUTES } from "@/lib/constants";
import type { Industry } from "@/types/industry";

type IndustriesSectionProps = {
  industries?: Industry[];
};

export async function IndustriesSection({ industries }: IndustriesSectionProps) {
  const t = await getTranslations("home.industries");
  const visible = industries?.slice(0, 3) ?? [];

  if (!visible.length) {
    return null;
  }

  return (
    <section className="section section--tight home-industries">
      <div className="container">
        <Reveal>
          <SectionHead
            eyebrow={t("eyebrow")}
            title={t("title")}
            href={ROUTES.industries}
            browseLabel={t("viewAll")}
          />
        </Reveal>
        <HomeIndustriesRail industries={visible} viewLabel={t("viewSector")} />
      </div>
    </section>
  );
}
