"use client";

import { useEffect, useRef, useState } from "react";

type StatCounterProps = {
  value?: string;
  delay?: number;
};

function parseStat(value?: string) {
  const raw = value ?? "";
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) {
    return { target: null as number | null, suffix: raw };
  }
  return { target: Number(match[1]), suffix: match[2] ?? "" };
}

export function StatCounter({ value, delay = 0 }: StatCounterProps) {
  const parsed = parseStat(value);
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(value ?? "");

  useEffect(() => {
    const node = ref.current;
    const target = parsed.target;
    const suffix = parsed.suffix;

    if (!node || target == null || Number.isNaN(target)) {
      setDisplay(value ?? "");
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(`${target}${suffix}`);
      return;
    }

    setDisplay(`0${suffix}`);
    let frame = 0;
    let startAt = 0;
    const duration = 1200;

    const run = (now: number) => {
      if (!startAt) {
        startAt = now;
      }
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - (1 - t) ** 3;
      const current = Math.round(target * eased);
      setDisplay(`${current}${suffix}`);
      if (t < 1) {
        frame = window.requestAnimationFrame(run);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }
        observer.disconnect();
        window.setTimeout(() => {
          frame = window.requestAnimationFrame(run);
        }, delay);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [delay, parsed.suffix, parsed.target, value]);

  return <strong ref={ref}>{display}</strong>;
}
