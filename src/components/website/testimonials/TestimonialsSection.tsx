import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/website/common/SectionIntro";
import type { Testimonial } from "@/types/testimonial";

type TestimonialsSectionProps = {
  testimonials?: Testimonial[];
};

export async function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = await getTranslations("home.testimonials");
  const lead = testimonials?.[0];
  const rest = testimonials?.slice(1) ?? [];

  if (!lead) {
    return null;
  }

  return (
    <section className="section">
      <div className={cn("container", "quote-rail")}>
        <Reveal>
          <SectionIntro eyebrow={t("eyebrow")} title={t("title")} />
        </Reveal>
        <Reveal delay={80}>
          <blockquote className={"quote"}>
            <p className="t-body-lg">“{lead.quote}”</p>
            <footer className="t-small mt-4">
              {lead.author}, {lead.role}, {lead.company}
            </footer>
          </blockquote>
          {rest.map((item) => (
            <blockquote key={item.id} className={"quote"}>
              <p>“{item.quote}”</p>
              <footer className="t-small mt-3">
                {item.author}, {item.role}, {item.company}
              </footer>
            </blockquote>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
