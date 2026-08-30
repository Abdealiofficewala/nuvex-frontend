"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { industryHref } from "@/lib/constants";
import { cn } from "@/lib/utils";

type IndustryNavItem = {
  id: string;
  slug: string;
  name: string;
};

type IndustriesNavProps = {
  items: IndustryNavItem[];
  label: string;
};

export function IndustriesNav({ items, label }: IndustriesNavProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollEdge, setScrollEdge] = useState({ start: false, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = track;
      const maxScroll = scrollWidth - clientWidth;

      setScrollEdge({
        start: scrollLeft > 6,
        end: maxScroll > 6 && scrollLeft < maxScroll - 6,
      });
    };

    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [items]);

  if (!items.length) {
    return null;
  }

  return (
    <nav
      className={cn(
        "industries-nav",
        scrollEdge.start && "is-scroll-start",
        scrollEdge.end && "is-scroll-end",
      )}
      aria-label={label}
    >
      <div className="container industries-nav__shell">
        <div ref={trackRef} className="industries-nav__track">
          {items.map((industry) => (
            <Link key={industry.id} href={industryHref(industry.slug)} className="industries-nav__link">
              {industry.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
