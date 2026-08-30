import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button";
import { BrandLogo } from "@/components/website/common/BrandLogo";
import { ContactDetails } from "@/components/website/common/ContactDetails";
import { NavList } from "@/components/website/common/NavList";
import { SocialLinks } from "@/components/website/common/SocialLinks";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { FooterCta } from "@/components/website/footer/FooterCta";
import { siteConfig } from "@/config/site.config";
import { Link } from "@/i18n/routing";
import { ROUTES } from "@/lib/constants";
import { productsService } from "@/services/products.service";

type FooterProps = {
  showCta?: boolean;
};

export async function Footer({ showCta = true }: FooterProps) {
  const t = await getTranslations("common");
  const categories = await productsService.getCategories();
  const year = new Date().getFullYear();
  const companyLinks = siteConfig.navigation.footer.map((item) => ({
    href: item.href,
    label: t(item.labelKey),
  }));

  return (
    <footer className={"footer"}>
      {showCta ? (
        <FooterCta>
          <div className={"footer__cta"}>
            <div className={cn("container", "footer__cta-inner")}>
              <div className={"footer__cta-copy"}>
                <p className={"footer__cta-eyebrow"}>{t("footer.ctaEyebrow")}</p>
                <h2 className={"footer__cta-title"}>{t("footer.ctaTitle")}</h2>
                <p className={"footer__cta-body"}>{t("footer.ctaBody")}</p>
              </div>
              <ButtonLink href={ROUTES.quote} variant="accent" arrow className={"footer__cta-btn"}>
                {t("cta.requestQuote")}
              </ButtonLink>
            </div>
          </div>
        </FooterCta>
      ) : null}

      <div className={"footer__body"}>
        <div className={cn("container", "footer__main")}>
          <div className={"footer__brand"}>
            <BrandLogo variant="light" className={"footer__logo"} height={28} />
            <p className={"footer__tagline"}>{siteConfig.company.tagline}</p>
            <div className={cn("footer__social", "footer__social--desktop")}>
              <h3 className={"footer__label"}>{t("footer.social")}</h3>
              <SocialLinks variant="footer" />
            </div>
          </div>

          <div className={cn("footer__col", "footer__col--products")}>
            <h3 className={"footer__label"}>{t("footer.products")}</h3>
            <nav className={"footer__nav"} aria-label={t("footer.products")}>
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className={"footer__link"}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className={cn("footer__col", "footer__col--social", "footer__col--social-mobile")}>
            <h3 className={"footer__label"}>{t("footer.social")}</h3>
            <SocialLinks variant="footer-nav" label={t("footer.social")} />
          </div>

          <div className={cn("footer__col", "footer__col--company")}>
            <h3 className={"footer__label"}>{t("footer.company")}</h3>
            <NavList
              items={companyLinks}
              className={"footer__nav"}
              itemClassName={() => "footer__link"}
            />
          </div>

          <div className={cn("footer__col", "footer__col--contact")}>
            <h3 className={"footer__label"}>{t("footer.connect")}</h3>
            <ContactDetails showPerson showAddress className={"footer__contact"} />
          </div>
        </div>
      </div>

      <div className={"footer__bar"}>
        <div className={cn("container", "footer__bar-inner")}>
          <p className={"footer__copy"}>
            © {year} {siteConfig.company.name}. {t("footer.rights")}
          </p>
          <LanguageSwitcher className="language-switcher--footer" />
        </div>
      </div>
    </footer>
  );
}
