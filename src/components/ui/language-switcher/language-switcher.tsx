"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import "../ui.css";

const localeShort: Record<Locale, string> = {
  en: "EN",
  hi: "HI",
};

type LanguageSwitcherProps = {
  className?: string;
};

function LanguageIcon() {
  return (
    <svg className="language-switcher__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.8 2.5 14.2 0 18M12 3c-2.5 2.8-2.5 14.2 0 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const switchLocale = (next: Locale) => {
    if (next !== locale) {
      router.replace(pathname, { locale: next });
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("language-switcher", className)}>
      <button
        type="button"
        className="language-switcher__trigger"
        aria-label={t("language.label")}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
      >
        <LanguageIcon />
        <span className="language-switcher__current">{localeShort[locale] ?? locale.toUpperCase()}</span>
        <span className={cn("language-switcher__chevron", open && "is-open")} aria-hidden="true" />
      </button>

      {open ? (
        <ul className="language-switcher__menu" role="listbox" aria-label={t("language.label")}>
          {routing.locales.map((code) => {
            const active = code === locale;

            return (
              <li key={code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={cn("language-switcher__option", active && "is-active")}
                  onClick={() => switchLocale(code as Locale)}
                >
                  <span className="language-switcher__option-code">
                    {localeShort[code as Locale] ?? code.toUpperCase()}
                  </span>
                  <span className="language-switcher__option-label">{t(`language.${code}`)}</span>
                  {active ? <span className="language-switcher__check" aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
