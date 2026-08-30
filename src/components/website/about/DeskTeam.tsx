"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MobileSliderNav } from "@/components/ui/mobile-slider/MobileSliderNav";
import { Reveal } from "@/components/ui/reveal";
import { BREAKPOINTS } from "@/lib/constants";
import { cn, hasValue, initials, phoneHref } from "@/lib/utils";
import type { DeskPerson } from "@/types/content";

type DeskTeamProps = {
  people: DeskPerson[];
  prevLabel: string;
  nextLabel: string;
};

function getScrollStep(rail: HTMLElement) {
  const card = rail.querySelector<HTMLElement>(`[data-desk-card]`);
  if (!card) {
    return rail.clientWidth * 0.85;
  }

  const styles = getComputedStyle(rail);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || "12") || 12;
  return card.offsetWidth + gap;
}

export function DeskTeam({ people, prevLabel, nextLabel }: DeskTeamProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [mobileSlider, setMobileSlider] = useState(false);
  const cards = people.filter((person) => hasValue(person?.name));
  const sliderEnabled = cards.length >= 4 || (mobileSlider && cards.length >= 2);

  const updateControls = useCallback(() => {
    const rail = railRef.current;
    if (!rail || !sliderEnabled) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }

    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    setCanPrev(rail.scrollLeft > 4);
    setCanNext(maxScroll > 4 && rail.scrollLeft < maxScroll - 4);
  }, [sliderEnabled]);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile}px)`);
    const sync = () => setMobileSlider(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !sliderEnabled) {
      return;
    }

    const onScroll = () => updateControls();
    const observer = new ResizeObserver(() => updateControls());

    observer.observe(rail);
    Array.from(rail.children).forEach((child) => observer.observe(child));

    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    rail.scrollLeft = 0;
    requestAnimationFrame(updateControls);
    window.setTimeout(updateControls, 120);

    return () => {
      observer.disconnect();
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sliderEnabled, updateControls, cards.length]);

  const scrollRail = (direction: "prev" | "next") => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const step = getScrollStep(rail);
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const nextLeft =
      direction === "next"
        ? Math.min(rail.scrollLeft + step, maxScroll)
        : Math.max(0, rail.scrollLeft - step);

    rail.scrollTo({ left: nextLeft, behavior: "smooth" });
  };

  if (!cards.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "desk-rail-wrap",
        sliderEnabled ? "desk-rail-wrap--slider" : "desk-rail-wrap--static",
      )}
    >
      <div className={"desk-rail"} ref={railRef} role="list">
        {cards.map((person, index) => (
          <Reveal
            as="article"
            key={person?.key}
            className={"desk-card"}
            delay={index * 90}
            role="listitem"
            data-desk-card
          >
            <div className={"desk-card__avatar"}>
              {hasValue(person?.image) ? (
                <Image
                  src={person?.image ?? ""}
                  alt={`${person?.name ?? ""}${person?.role ? `, ${person.role}` : ""}`}
                  fill
                  sizes="(max-width: 720px) 85vw, 96px"
                  quality={75}
                  unoptimized={Boolean(person?.image?.startsWith("http"))}
                />
              ) : (
                <span className={"desk-card__initials"} aria-hidden="true">
                  {initials(person?.name)}
                </span>
              )}
            </div>
            <div className={"desk-card__content"}>
              <p className={"desk-card__tag"}>{person?.role}</p>
              <h3 className={"desk-card__name"}>{person?.name}</h3>
              <p className={"desk-card__crunch"}>{person?.crunch}</p>
              <p className={"desk-card__body"}>{person?.body}</p>
              {person?.phone || person?.email ? (
                <div className={"desk-card__meta"}>
                  {person.phone ? (
                    <a href={phoneHref(person.phone)} className={"desk-card__link"}>
                      {person.phone}
                    </a>
                  ) : null}
                  {person.email ? (
                    <a href={`mailto:${person.email}`} className={"desk-card__link"}>
                      {person.email}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>

      {sliderEnabled ? (
        <MobileSliderNav
          className={"desk-rail__nav"}
          onPrev={() => scrollRail("prev")}
          onNext={() => scrollRail("next")}
          canPrev={canPrev}
          canNext={canNext}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
        />
      ) : null}
    </div>
  );
}
