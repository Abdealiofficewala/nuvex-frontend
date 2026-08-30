import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { StatCounter } from "@/components/website/stats/StatCounter";
import type { HomepageStat } from "@/types/homepage";

type StatsSectionProps = {
  stats?: HomepageStat[];
};

export function StatsSection({ stats }: StatsSectionProps) {
  if (!stats?.length) {
    return null;
  }

  return (
    <section className="section--dark">
      <div className={cn("container", "stats")}>
        {stats.map((stat, index) => (
          <Reveal as="article" key={stat.key} className={"stat"} delay={index * 90}>
            <StatCounter value={stat?.value} delay={index * 90} />
            <span className="t-small">{stat?.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
