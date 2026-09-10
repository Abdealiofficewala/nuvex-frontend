"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { BrandLogo } from "@/components/website/common/BrandLogo";
import { NavList } from "@/components/website/common/NavList";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { siteConfig } from "@/config/site.config";
import { Link, usePathname } from "@/i18n/routing";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 36;
const MOBILE_NAV_BREAKPOINT = 1100;

function isActivePath(pathname: string, href: string) {
  if (href === ROUTES.home) {
    return pathname === ROUTES.home;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollLockRef = useRef(0);
  const items = siteConfig.navigation.main.map((item) => ({
    href: item.href,
    label: t(item.labelKey),
  }));
  const activeNav = items.find((item) => isActivePath(pathname, item.href));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_NAV_BREAKPOINT}px)`);

    if (!open || !media.matches) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.removeProperty("--navbar-open-offset");
      return;
    }

    scrollLockRef.current = window.scrollY;
    document.documentElement.style.setProperty("--navbar-open-offset", `${scrollLockRef.current}px`);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      const scrollY = scrollLockRef.current;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.removeProperty("--navbar-open-offset");
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={cn(
        "navbar",
        open && "is-open",
        scrolled && "is-scrolled",
      )}
    >
      <div className={cn("container", "navbar__inner")}>
        <Link href={ROUTES.home} className={"navbar__brand"} onClick={() => setOpen(false)}>
          <BrandLogo variant="default" className={"navbar__brand--desktop"} height={36} />
          <BrandLogo variant="compact" layout="symbol-only" className={"navbar__brand--mobile"} height={30} />
        </Link>

        {activeNav ? (
          <span className={"navbar__current"} aria-current="page">
            {activeNav.label}
          </span>
        ) : null}

        <NavList
          items={items}
          className={"navbar__links"}
          itemClassName={(href) =>
            cn(
              "navbar__link",
              isActivePath(pathname, href) && "is-active",
            )
          }
        />

        <div className={"navbar__actions"}>
          <LanguageSwitcher className={cn("navbar__lang", "language-switcher--header")} />
          <Link href={ROUTES.quote} className={"navbar__cta"}>
            <span>{t("cta.requestQuote")}</span>
          </Link>
          <button
            type="button"
            className={cn("navbar__toggle", open && "is-open")}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? t("nav.closeMenu") : t("nav.menu")}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <button
        type="button"
        className={cn("navbar__backdrop", open && "is-open")}
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        aria-label={t("nav.closeMenu")}
        onClick={() => setOpen(false)}
      />

      <div
        id="site-menu"
        className={cn("navbar__menu", open && "is-open")}
        aria-hidden={!open}
        inert={open ? undefined : true}
      >
        <div className={cn("container", "navbar__menu-inner")}>
          <div className={"navbar__menu-head"}>
            <div className={"navbar__menu-head-copy"}>
              <span className={"navbar__menu-label"}>{t("nav.menu")}</span>
              {activeNav ? <span className={"navbar__menu-active"}>{activeNav.label}</span> : null}
            </div>
          </div>

          <NavList
            items={items}
            className={"navbar__menu-links"}
            itemClassName={(href) =>
              cn(
                "navbar__menu-link",
                isActivePath(pathname, href) && "is-active",
              )
            }
            onNavigate={() => setOpen(false)}
          />

          <div className={"navbar__menu-foot"}>
            <Link
              href={ROUTES.quote}
              className={cn("navbar__cta", "navbar__cta--menu")}
              onClick={() => setOpen(false)}
            >
              <span>{t("cta.requestQuote")}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
