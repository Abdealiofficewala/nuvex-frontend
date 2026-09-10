"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HakimiSplashScreen } from "@/components/brand/HakimiSplashScreen";

const SPLASH_SEEN_KEY = "hakimi-splash-seen-v4";
const FORCE_CLOSE_MS = 7200;

function unlockScroll() {
  document.documentElement.removeAttribute("data-splash");
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.touchAction = "";
}

function markSplashSeen() {
  try {
    window.sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
  } catch {
    /* private mode */
  }
}

function hasSeenSplash() {
  try {
    return window.sessionStorage.getItem(SPLASH_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function SiteSplash() {
  const [open, setOpen] = useState(false);
  const closedRef = useRef(false);

  const close = useCallback(() => {
    if (closedRef.current) {
      return;
    }

    closedRef.current = true;
    markSplashSeen();
    setOpen(false);
    unlockScroll();
  }, []);

  useEffect(() => {
    if (hasSeenSplash()) {
      unlockScroll();
      return;
    }

    setOpen(true);
    document.documentElement.dataset.splash = "1";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const forceClose = window.setTimeout(close, FORCE_CLOSE_MS);

    return () => {
      window.clearTimeout(forceClose);
      unlockScroll();
    };
  }, [close]);

  if (!open) {
    return null;
  }

  return <HakimiSplashScreen skippable onComplete={close} />;
}
