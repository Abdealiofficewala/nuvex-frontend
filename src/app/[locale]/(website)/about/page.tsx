import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DeskTeam } from "@/components/website/about/DeskTeam";
import { AboutFactsTicket } from "@/components/website/about/AboutFactsTicket";
import { HeroActions } from "@/components/website/common/HeroActions";
import { RevealIntro } from "@/components/website/common/RevealIntro";
import { MediaFill } from "@/components/ui/media-fill";
import { Reveal } from "@/components/ui/reveal";
import { StatsSection } from "@/components/website/stats/StatsSection";
import { ROUTES, TICKET_SERIAL } from "@/lib/constants";
import {
  parseAboutPeople,
  parseContentBlocks,
  parseProcessSteps,
  parseStringArray,
} from "@/lib/i18n-messages";
import { toDeskPerson } from "@/lib/leadership";
import { companyService } from "@/services/company.service";
import { homepageService } from "@/services/homepage.service";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: t("title"),
    description: t("lede"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const homepage = await homepageService.getHomepage();
  const company = await companyService.getCompany();
  const storyPoints = parseStringArray(t.raw("story.points"));
  const steps = parseProcessSteps(t.raw("process.steps"));
  const promises = parseContentBlocks(t.raw("promise.items"));
  const people = parseAboutPeople(t.raw("people"));
  const leadership = company?.leadership;
  const teamPeople = people.map((person) => toDeskPerson(person, leadership));

  return (
    <div className="about-page">
      <section className={"about-hero"}>
        <MediaFill
          src="/images/hero/hero-assembly.jpg"
          className={"about-hero__media"}
          alt={t("heroImageAlt")}
          sizes="100vw"
          priority
        />
        <div className={cn("container", "about-hero__inner")}>
          <p className={cn("t-caption", "about-hero__eyebrow")}>{t("eyebrow")}</p>
          <h1 className={"about-hero__title"}>{t("title")}</h1>
          <p className={"about-hero__lede"}>{t("lede")}</p>
          <HeroActions
            className={"about-hero__actions"}
            actions={[
              { href: ROUTES.quote, label: t("ctaQuote"), variant: "accent" },
              { href: ROUTES.products, label: t("ctaProducts"), variant: "ghost" },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={"about-story"}>
            <Reveal className={"about-story__media"}>
              <MediaFill
                src="/images/company/about-workers.jpg"
                alt={t("story.mediaAlt")}
                sizes="(max-width: 980px) 100vw, 55vw"
              />
            </Reveal>
            <Reveal className={"about-story__copy"} delay={80}>
              <p className={cn("t-caption", "about-story__eyebrow")}>{t("story.eyebrow")}</p>
              <h2 className={cn("t-h2", "about-story__title")}>{t("story.title")}</h2>
              <p className={cn("t-muted", "mt-4")}>{t("story.body")}</p>
              <ul className={"about-story__points"}>
                {storyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className={"about-pull"}>{t("story.pull")}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={cn("section", "about-process")}>
        <div className="container">
          <RevealIntro
            className={"about-process__intro"}
            eyebrow={t("process.eyebrow")}
            title={t("process.title")}
            body={t("process.lede")}
          />
          <ol className={"about-timeline"}>
            {steps.map((step, index) => (
              <Reveal as="li" key={step.n} className={"about-timeline__step"} delay={index * 80}>
                <span className={"about-timeline__n"}>{step.n}</span>
                <div className={"about-timeline__card"}>
                  <h3 className={"t-h3"}>{step.title}</h3>
                  <p className={"t-muted"}>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <StatsSection stats={homepage?.stats} />

      <section className="section about-desk">
        <div className="container about-desk__head">
          <RevealIntro eyebrow={t("desk.eyebrow")} title={t("desk.title")} body={t("desk.lede")} />
        </div>
        <article className="about-desk__ticket">
          <div className="container about-desk__ticket-bar">
            <p className="about-desk__serial" aria-hidden="true">
              {TICKET_SERIAL.team}
            </p>
          </div>
          <DeskTeam
            people={teamPeople}
            prevLabel={t("desk.prev")}
            nextLabel={t("desk.next")}
          />
        </article>
        <div className="container">
          <AboutFactsTicket />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RevealIntro eyebrow={t("promise.eyebrow")} title={t("promise.title")} />
          <div className={"about-promise"}>
            {promises.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <article className={"about-promise__card"}>
                  <h3 className={"t-h3"}>{item.title}</h3>
                  <p className={cn("t-muted", "mt-3")}>{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
