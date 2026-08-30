"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { ProcessStep } from "@/types/content";

type ProcessCarouselProps = {
  steps: ProcessStep[];
  stepLabel?: string;
};

const AUTO_MS = 5500;

export function ProcessCarousel({ steps, stepLabel = "Step" }: ProcessCarouselProps) {
  const total = steps?.length ?? 0;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (!total) {
        return;
      }
      const next = ((index % total) + total) % total;
      setActive(next);

      setPaused(true);
      if (pauseTimerRef.current) {
        window.clearTimeout(pauseTimerRef.current);
      }
      pauseTimerRef.current = window.setTimeout(() => setPaused(false), AUTO_MS);
    },
    [total],
  );

  useEffect(() => {
    if (!total || paused) {
      return;
    }

    timerRef.current = window.setInterval(() => {
      setActive((current) => (current + 1) % total);
    }, AUTO_MS);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [total, paused]);

  useEffect(
    () => () => {
      if (pauseTimerRef.current) {
        window.clearTimeout(pauseTimerRef.current);
      }
    },
    [],
  );

  if (!total) {
    return null;
  }

  const step = steps[active];
  const progress = total <= 1 ? 100 : (active / (total - 1)) * 100;

  return (
    <div
      className={`process-carousel${paused ? " is-paused" : ""}`}
      style={
        {
          "--steps": total,
          "--progress": progress,
          "--auto-ms": `${AUTO_MS}ms`,
        } as CSSProperties
      }
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={"process-carousel__progress"}>
        <div className={"process-carousel__bar"} aria-hidden="true">
          <span className={"process-carousel__bar-track"} />
          <span className={"process-carousel__bar-fill"} />
          <span key={active} className={"process-carousel__bar-tick"} />
        </div>
        <div className={"process-carousel__stops"} role="tablist" aria-label={stepLabel}>
          {steps.map((item, index) => (
            <button
              key={item.n}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={`process-carousel__stop${index === active ? " is-current" : ""}${index < active ? " is-done" : ""}`}
              onClick={() => goTo(index)}
            >
              <span className={"process-carousel__stop-n"}>{item.n}</span>
              <span className={"process-carousel__stop-title"}>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      <article className={"process-carousel__card"} aria-live="polite">
        <div key={active} className={"process-carousel__stage"}>
          <div className={"process-carousel__media"}>
            {step?.image ? (
              <Image
                src={step.image}
                alt={step.imageAlt ?? step.title ?? ""}
                fill
                sizes="(max-width: 980px) 100vw, 52vw"
                quality={80}
                className={"process-carousel__image"}
                priority={active === 0}
              />
            ) : null}
            <span className={"process-carousel__badge"}>
              {stepLabel} {step?.n}
            </span>
          </div>

          <div className={"process-carousel__copy"}>
            <h3 className={"process-carousel__title"}>{step?.title}</h3>
            <p className={"process-carousel__body"}>{step?.body}</p>
          </div>
        </div>
      </article>
    </div>
  );
}
