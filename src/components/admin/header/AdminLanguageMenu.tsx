"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { ChevronDownIcon, GlobeIcon } from "@/components/admin/header/AdminMenuIcons";
import { useAdminDropdown } from "@/components/admin/header/useAdminDropdown";
import { cn } from "@/lib/utils";

const localeShort: Record<Locale, string> = {
  en: "EN",
  hi: "HI",
};

export function AdminLanguageMenu() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");
  const { rootRef, open, toggle, close } = useAdminDropdown();

  const currentLabel = t(`language.${locale}`);

  const switchLocale = (next: Locale) => {
    if (next !== locale) {
      router.replace(pathname, { locale: next });
    }
    close();
  };

  return (
    <div ref={rootRef} className={cn("admin-menu", "admin-menu--lang", open && "is-open")}>
      <button
        type="button"
        className="admin-menu__btn"
        aria-label={t("language.label")}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={toggle}
      >
        <span className="admin-menu__btn-icon admin-menu__btn-icon--lang">
          <GlobeIcon />
        </span>
        <span className="admin-menu__btn-text">{currentLabel}</span>
        <ChevronDownIcon className="admin-menu__btn-chevron" />
      </button>

      {open ? (
        <div className="admin-menu__pop">
          <div className="admin-menu__pop-head">
            <span>{t("language.label")}</span>
          </div>
          <ul className="admin-menu__list" role="listbox" aria-label={t("language.label")}>
            {routing.locales.map((code) => {
              const active = code === locale;
              const label = t(`language.${code}`);

              return (
                <li key={code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={cn("admin-menu__option", active && "is-selected")}
                    onClick={() => switchLocale(code as Locale)}
                  >
                    <span className="admin-menu__radio" aria-hidden="true" />
                    <span className="admin-menu__option-body">
                      <strong>{label}</strong>
                      <span>{localeShort[code as Locale] ?? code.toUpperCase()}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
