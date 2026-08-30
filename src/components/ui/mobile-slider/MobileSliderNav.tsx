"use client";

import { cn } from "@/lib/utils";

type MobileSliderNavProps = {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  prevLabel: string;
  nextLabel: string;
  className?: string;
};

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      className={"mobile-slider-nav__icon"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {direction === "prev" ? (
        <path
          d="M14.5 6.5 9 12l5.5 5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 6.5 15 12l-5.5 5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function MobileSliderNav({
  onPrev,
  onNext,
  canPrev,
  canNext,
  prevLabel,
  nextLabel,
  className,
}: MobileSliderNavProps) {
  return (
    <div className={cn("mobile-slider-nav", className)}>
      <button
        type="button"
        className={cn("mobile-slider-nav__btn", "mobile-slider-nav__btn--prev")}
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={prevLabel}
      >
        <ChevronIcon direction="prev" />
      </button>
      <button
        type="button"
        className={cn("mobile-slider-nav__btn", "mobile-slider-nav__btn--next")}
        onClick={onNext}
        disabled={!canNext}
        aria-label={nextLabel}
      >
        <ChevronIcon direction="next" />
      </button>
    </div>
  );
}
