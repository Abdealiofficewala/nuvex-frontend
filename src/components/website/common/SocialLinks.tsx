"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { SocialIcon } from "@/components/website/common/SocialIcon";
import {
  buildSocialLinkItems,
  getDefaultSocialLinksState,
  getSocialLinksState,
  SOCIAL_LINKS_UPDATED_EVENT,
} from "@/lib/social-links";

type SocialLinksProps = {
  className?: string;
  variant?: "default" | "footer" | "footer-nav";
  label?: string;
};

export function SocialLinks({ className, variant = "default", label }: SocialLinksProps) {
  const [state, setState] = useState(getDefaultSocialLinksState);

  useEffect(() => {
    setState(getSocialLinksState());

    const refresh = () => setState(getSocialLinksState());
    window.addEventListener(SOCIAL_LINKS_UPDATED_EVENT, refresh);

    return () => window.removeEventListener(SOCIAL_LINKS_UPDATED_EVENT, refresh);
  }, []);

  const items = useMemo(() => buildSocialLinkItems(state), [state]);

  if (!items.length) {
    return null;
  }

  if (variant === "footer-nav") {
    return (
      <nav className={cn("footer__nav", "footer__nav--social", className)} aria-label={label}>
        {items.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className={cn("footer__link", "footer__link--social")}
            target="_blank"
            rel="noreferrer noopener"
          >
            <SocialIcon name={item.icon} className="social-links__icon" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    );
  }

  return (
    <div
      className={cn(
        "social-links",
        variant === "footer" && "social-links--footer",
        className,
      )}
    >
      {label ? <p className="social-links__label">{label}</p> : null}
      <div className="social-links__row">
        {items.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className="social-links__item"
            target="_blank"
            rel="noreferrer noopener"
            aria-label={item.label}
            title={item.label}
          >
            <SocialIcon name={item.icon} className="social-links__icon" />
          </a>
        ))}
      </div>
    </div>
  );
}
