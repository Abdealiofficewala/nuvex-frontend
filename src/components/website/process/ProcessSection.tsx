import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { ProcessCarousel } from "@/components/website/process/ProcessCarousel";
import { MAX_PROCESS_STEPS, PROCESS_STEP_IMAGES } from "@/lib/constants";
import type { ProcessStep } from "@/types/content";

export type { ProcessStep };

type ProcessSectionProps = {
  eyebrow: string;
  title: string;
  lede: string;
  steps: ProcessStep[];
  stepLabel?: string;
};

export function ProcessSection({
  eyebrow,
  title,
  lede,
  steps,
  stepLabel = "Step",
}: ProcessSectionProps) {
  const visible =
    steps?.slice(0, MAX_PROCESS_STEPS).map((step, index) => {
      const fallback = PROCESS_STEP_IMAGES[index];
      return {
        ...step,
        image: step.image ?? fallback?.src,
        imageAlt: step.imageAlt ?? fallback?.alt ?? step.title,
      };
    }) ?? [];

  if (!visible.length) {
    return null;
  }

  return (
    <section className={cn("section", "section--tight", "process-section")}>
      <div className="container">
        <Reveal className={"process-section__intro"}>
          <p className="t-caption">{eyebrow}</p>
          <h2 className="t-h2">{title}</h2>
          {lede ? <p className={"process-section__lede"}>{lede}</p> : null}
        </Reveal>

        <Reveal delay={60}>
          <ProcessCarousel steps={visible} stepLabel={stepLabel} />
        </Reveal>
      </div>
    </section>
  );
}
