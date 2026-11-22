import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { resolveCompanyStrengthStat } from "@/lib/company-strength";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/website/common/SectionIntro";
import { CompanyStrengthCard } from "@/components/website/stats/CompanyStrengthCard";
import type { HomepageStat } from "@/types/homepage";

type StatsSectionProps = {
  stats?: HomepageStat[];
};

const STRENGTH_STAT_KEYS = ["years", "products", "applications", "countries"] as const;

type StrengthStatKey = (typeof STRENGTH_STAT_KEYS)[number];

function isStrengthStatKey(key: string): key is StrengthStatKey {
  return (STRENGTH_STAT_KEYS as readonly string[]).includes(key);
}

export async function StatsSection({ stats }: StatsSectionProps) {
  if (!stats?.length) {
    return null;
  }

  const t = await getTranslations("home.strength");
  const items = stats.map((stat) => {
    const localized: HomepageStat = isStrengthStatKey(stat.key)
      ? {
          ...stat,
          title: t(`${stat.key}.title`),
          description: t(`${stat.key}.description`),
        }
      : stat;
    return resolveCompanyStrengthStat(localized);
  });

  return (
    <section className={cn("section", "section--dark", "company-strength")}>
      <div className="container">
        <Reveal>
          <SectionIntro eyebrow={t("eyebrow")} title={t("title")} body={t("lede")} />
        </Reveal>

        <div className="company-strength__grid">
          {items.map((stat, index) => (
            <Reveal as="div" key={stat.key} className="company-strength__cell" delay={index * 90}>
              <CompanyStrengthCard stat={stat} delay={index * 90} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
