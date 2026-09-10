"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { SplashScreenProps } from "@/components/brand/types";
import { HAKIMI_BRAND } from "@/config/brand.config";
import { cn } from "@/lib/utils";

const EXIT_FADE_S = 0.48;
const DEFAULT_HOLD_MS = 4200;
const EASE_CINEMA = [0.16, 1, 0.3, 1] as const;
const SPARKS = [22, 78, 134, 198, 246, 304] as const;

function SplashEmblem({ reduceMotion }: { reduceMotion: boolean }) {
  const { assets, ariaLabel } = HAKIMI_BRAND;

  if (reduceMotion) {
    return (
      <div className="hakimi-splash__emblem">
        <img
          src={assets.mark}
          alt={ariaLabel}
          width={assets.markWidth}
          height={assets.markHeight}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className="hakimi-splash__emblem">
      <motion.span
        className="hakimi-splash__bloom"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE_CINEMA }}
      />

      <motion.span
        className="hakimi-splash__ring hakimi-splash__ring--gold"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.55, 2.1] }}
        transition={{ duration: 0.7, delay: 0.92, ease: EASE_CINEMA }}
      />

      {SPARKS.map((angle) => (
        <motion.span
          key={angle}
          className="hakimi-splash__spark"
          aria-hidden="true"
          style={{ rotate: angle }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0.15] }}
          transition={{ duration: 0.48, delay: 0.94, ease: "easeOut" }}
        />
      ))}

      <img
        src={assets.mark}
        alt=""
        aria-hidden="true"
        width={assets.markWidth}
        height={assets.markHeight}
        draggable={false}
        className="hakimi-splash__clip-i hakimi-splash__i-glow"
      />

      <motion.img
        src={assets.mark}
        alt=""
        aria-hidden="true"
        width={assets.markWidth}
        height={assets.markHeight}
        draggable={false}
        className="hakimi-splash__clip-h"
        initial={{ opacity: 0, x: -36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.22, ease: EASE_CINEMA }}
      />

      <motion.img
        src={assets.mark}
        alt={ariaLabel}
        width={assets.markWidth}
        height={assets.markHeight}
        draggable={false}
        className="hakimi-splash__clip-i"
        initial={{ opacity: 0, x: 36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.38, ease: EASE_CINEMA }}
      />

      <motion.span
        className="hakimi-splash__flash"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 0.32, delay: 0.92, ease: "easeOut" }}
      />

      <span className="hakimi-splash__shine-mask" aria-hidden="true">
        <span className="hakimi-splash__shine" />
      </span>
    </div>
  );
}

export function HakimiSplashScreen({
  onComplete,
  className,
  holdMs = DEFAULT_HOLD_MS,
  skippable = true,
}: SplashScreenProps) {
  const reduceMotionPref = useReducedMotion();
  const reduceMotion = reduceMotionPref === true;
  const [exiting, setExiting] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const finishedRef = useRef(false);
  const exitStartedRef = useRef(false);
  const startedAtRef = useRef(0);
  const { wordmark, colors } = HAKIMI_BRAND;
  const letters = wordmark.primary.split("");

  const complete = useCallback(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    onComplete?.();
  }, [onComplete]);

  const finish = useCallback(() => {
    if (finishedRef.current || exitStartedRef.current) {
      return;
    }

    exitStartedRef.current = true;
    setExiting(true);
    window.setTimeout(complete, EXIT_FADE_S * 1000 + 120);
  }, [complete]);

  useEffect(() => {
    startedAtRef.current = Date.now();
    const wait = reduceMotion ? 400 : holdMs;
    const showSkip = window.setTimeout(() => setCanSkip(true), reduceMotion ? 80 : 500);
    const hide = window.setTimeout(finish, wait);

    const onVisibility = () => {
      if (document.visibilityState === "visible" && Date.now() - startedAtRef.current >= wait) {
        finish();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(showSkip);
      window.clearTimeout(hide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [finish, holdMs, reduceMotion]);

  useEffect(() => {
    if (!skippable) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        finish();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finish, skippable]);

  return (
    <AnimatePresence onExitComplete={complete}>
      {exiting ? null : (
        <motion.div
          key="hakimi-splash"
          role="status"
          aria-live="polite"
          aria-label={HAKIMI_BRAND.name}
          className={cn(
            "hakimi-splash fixed inset-0 z-[2000] cursor-pointer overflow-hidden",
            className,
          )}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_FADE_S, ease: [0.4, 0, 0.2, 1] }}
          onClick={skippable ? finish : undefined}
        >
          <div className="absolute inset-0 bg-[#06080c]" aria-hidden="true" />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 48% 38% at 50% 44%, rgb(21 42 69 / 0.7) 0%, transparent 70%)",
            }}
          />
          <div className="hakimi-splash__vignette pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="hakimi-splash__grain pointer-events-none absolute inset-0" aria-hidden="true" />

          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <div className="flex flex-col items-center">
              <SplashEmblem reduceMotion={reduceMotion} />

              <div className="mt-8 flex flex-col items-center sm:mt-9">
                <p className="flex overflow-hidden font-sans text-[1.15rem] font-semibold uppercase leading-none tracking-[0.16em] text-beige sm:text-[1.5rem]">
                  {letters.map((letter, index) => (
                    <motion.span
                      key={`${letter}-${index}`}
                      initial={reduceMotion ? { y: 0, opacity: 1 } : { y: "120%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.42,
                        delay: reduceMotion ? 0 : 1.18 + index * 0.045,
                        ease: EASE_CINEMA,
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </p>

                <motion.span
                  className="mt-2.5 block h-[1.5px] w-11 rounded-full sm:w-14"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${colors.gold} 22%, ${colors.gold} 78%, transparent 100%)`,
                  }}
                  initial={reduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: reduceMotion ? 0 : 1.52, ease: EASE_CINEMA }}
                />

                <motion.p
                  className="mt-2.5 font-sans text-[0.62rem] font-medium uppercase leading-none text-gold sm:text-[0.72rem]"
                  initial={reduceMotion ? { opacity: 1, letterSpacing: "0.34em" } : { opacity: 0, letterSpacing: "0.52em" }}
                  animate={{ opacity: 1, letterSpacing: "0.34em" }}
                  transition={{ duration: 0.5, delay: reduceMotion ? 0 : 1.66, ease: EASE_CINEMA }}
                >
                  {wordmark.secondary}
                </motion.p>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-x-10 bottom-6 h-px overflow-hidden sm:inset-x-16"
            aria-hidden="true"
          >
            <span className="absolute inset-0 bg-beige/10" />
            <motion.span
              className="absolute inset-y-0 left-0 origin-left bg-gold"
              style={{ boxShadow: "0 0 12px rgb(205 177 118 / 0.55)" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduceMotion ? 0.2 : holdMs / 1000, ease: "linear" }}
            />
          </div>

          {skippable && canSkip ? (
            <motion.button
              type="button"
              className="absolute bottom-5 right-6 z-20 font-sans text-[0.6rem] font-medium uppercase tracking-[0.24em] text-beige/45 transition-colors hover:text-beige sm:right-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(event) => {
                event.stopPropagation();
                finish();
              }}
            >
              Skip
            </motion.button>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
