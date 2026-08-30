import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { IndustryCard } from "@/components/website/industries/IndustryCard";
import type { Industry } from "@/types/industry";

type HomeIndustriesRailProps = {
  industries: Industry[];
  viewLabel: string;
};

export function HomeIndustriesRail({ industries, viewLabel }: HomeIndustriesRailProps) {
  if (!industries.length) {
    return null;
  }

  return (
    <div className={cn("home-industries-rail-wrap", "mobile-slider-wrap", "mobile-slider-wrap--swipe")}>
      <div className={cn("home-industries-rail__track", "mobile-slider__track")}>
        {industries.map((industry, index) => (
          <Reveal key={industry.id} className={cn("home-industries-rail__item", "mobile-slider__item")} delay={index * 60}>
            <IndustryCard industry={industry} index={index} viewLabel={viewLabel} compact />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
