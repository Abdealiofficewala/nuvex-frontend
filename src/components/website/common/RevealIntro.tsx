import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { SectionIntroContent } from "@/components/website/common/SectionIntro";

type RevealIntroProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  bodyClassName?: string;
  className?: string;
  delay?: number;
};

export function RevealIntro({
  eyebrow,
  title,
  body,
  bodyClassName = "t-muted mt-4",
  className,
  delay,
}: RevealIntroProps) {
  return (
    <Reveal className={cn("section__intro", className)} delay={delay}>
      <SectionIntroContent eyebrow={eyebrow} title={title} body={body} bodyClassName={bodyClassName} />
    </Reveal>
  );
}
