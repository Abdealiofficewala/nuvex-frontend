"use client";

import { cn } from "@/lib/utils";
import type { SiteTopBarDisplay } from "@/lib/site-top-bar";

type SiteTopBarContentProps = {
  display: SiteTopBarDisplay;
  className?: string;
  preview?: boolean;
};

export function SiteTopBarContent({ display, className, preview = false }: SiteTopBarContentProps) {
  if (!display.visible) {
    return null;
  }

  const hasDetails = display.detailItems.length > 0;
  const hasMessages = display.messages.length > 0;

  if (!hasDetails && !hasMessages) {
    return null;
  }

  return (
    <div className={cn("site-top-bar", preview && "site-top-bar--preview", className)}>
      {hasDetails ? (
        <div className="site-top-bar__details" aria-label="Top bar contact details">
          {display.detailItems.map((item) => (
            <div key={item.key} className="site-top-bar__detail">
              <span className="site-top-bar__detail-label">{item.label}</span>
              {item.href ? (
                <a href={item.href} className="site-top-bar__detail-value">
                  {item.value}
                </a>
              ) : (
                <span className="site-top-bar__detail-value">{item.value}</span>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {hasMessages ? (
        <div className={cn("site-top-bar__ticker", !hasDetails && "site-top-bar__ticker--solo")}>
          <div className="site-top-bar__track">
            {[0, 1].map((copy) => (
              <div key={copy} className="site-top-bar__group">
                {display.messages.map((line) => (
                  <span key={`${copy}-${line}`} className="site-top-bar__item">
                    {line}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
