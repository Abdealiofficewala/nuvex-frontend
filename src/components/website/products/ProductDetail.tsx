import { cn } from "@/lib/utils";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/buttons";
import { Reveal } from "@/components/ui/reveal";
import { HeroActions } from "@/components/website/common/HeroActions";
import { ProductDetailGallery } from "./ProductDetailGallery";
import { ProductGrid } from "./ProductGrid";
import { ProductSpecifications } from "./ProductSpecifications";
import { Link } from "@/i18n/routing";
import { quoteHref, ROUTES } from "@/lib/constants";
import type { Product } from "@/types/product";

type ProductDetailProps = {
  product: Product;
  related?: Product[];
};

export async function ProductDetail({ product, related }: ProductDetailProps) {
  const t = await getTranslations("products");
  const cta = await getTranslations("common");
  const quoteLink = quoteHref(product.id);

  return (
    <div className={"product-view"}>
      <div className="container">
        <Reveal className={"product-view__nav"}>
          <Link href={ROUTES.products} className={"product-view__back"}>
            {t("detail.back")}
          </Link>
          <span className={"product-view__nav-sep"} aria-hidden="true">
            /
          </span>
          <span className={"product-view__nav-crumb"}>{product.category}</span>
        </Reveal>

        <div className={"product-view__hero"}>
          <Reveal>
            <ProductDetailGallery product={product} />
          </Reveal>
          <Reveal className={"product-view__copy"} delay={80}>
            <div className={"product-view__head"}>
              {product.category ? (
                <p className={"product-view__eyebrow"}>{product.category}</p>
              ) : null}
              <p className={"product-view__id"}>
                {t("detail.id")} <strong>{product.id}</strong>
              </p>
              <h1 className={"product-view__title"}>{product.name}</h1>
            </div>
            <div className={"product-view__pills"}>
              {product.subcategory ? <span>{product.subcategory}</span> : null}
              {product.keySpec ? <span className={"is-accent"}>{product.keySpec}</span> : null}
              {product.status ? <span className={"is-muted"}>{product.status}</span> : null}
            </div>
            {product.description ? <p className={"product-view__lede"}>{product.description}</p> : null}
            <HeroActions
              className={"product-detail__actions"}
              actions={[
                { href: quoteLink, label: cta("cta.requestQuote"), variant: "accent" },
                { href: ROUTES.contact, label: cta("cta.enquire"), variant: "secondary" },
              ]}
            />
          </Reveal>
        </div>

        <div className={"product-view__panels"}>
          <Reveal className={"product-panel"}>
            <ProductSpecifications product={product} />
          </Reveal>
          <Reveal className={"product-panel"} delay={70}>
            {product.features?.length ? (
              <div>
                <h3 className={"t-h3"}>{t("detail.features")}</h3>
                <ul className={cn("product-view__list", "mt-4")}>
                  {product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {product.applications?.length ? (
              <div className="mt-6">
                <h3 className={"t-h3"}>{t("detail.applications")}</h3>
                <ul className={cn("product-view__list", "mt-3")}>
                  {product.applications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {product.materials?.length ? (
              <div className="mt-6">
                <h3 className={"t-h3"}>{t("detail.materials")}</h3>
                <p className="t-muted mt-3">{product.materials.join(", ")}</p>
              </div>
            ) : null}
          </Reveal>
        </div>
      </div>

      {related?.length ? (
        <section className={"related-rail"}>
          <div className="container">
            <Reveal className={"related-rail__head"}>
              <div>
                <p className={"t-caption"}>{t("detail.relatedEyebrow")}</p>
                <h2 className="t-h2">{t("detail.related")}</h2>
                <p className={cn("t-muted", "related-rail__lede")}>{t("detail.relatedLede")}</p>
              </div>
              <Link href={ROUTES.products} className={"related-rail__browse"}>
                {t("detail.relatedBrowse")}
              </Link>
            </Reveal>
            <div className={"related-rail__scroller"}>
              <ProductGrid products={related} className={"related-rail__grid"} />
            </div>
          </div>
        </section>
      ) : null}

      <section className={"quote-select"}>
        <div className="container">
          <Reveal className={"quote-select__card"}>
            <div className={"quote-select__product"}>
              {product.image ? (
                <Link href={quoteLink} className={"quote-select__media"}>
                  <Image
                    src={product.image}
                    alt={product.name ?? ""}
                    fill
                    sizes="120px"
                    quality={70}
                  />
                </Link>
              ) : null}
              <div className={"quote-select__copy"}>
                <p className={cn("t-caption", "quote-select__eyebrow")}>{t("detail.quoteEyebrow")}</p>
                <h2 className={"quote-select__title"}>{t("detail.quoteTitle")}</h2>
                <p className={"quote-select__part"}>
                  <strong>{product.name}</strong>
                  {product.id ? <span>{product.id}</span> : null}
                  {product.keySpec ? <span>{product.keySpec}</span> : null}
                </p>
                <p className={"quote-select__body"}>{t("detail.quoteBody")}</p>
              </div>
            </div>
            <ButtonLink href={quoteLink} variant="accent" arrow className={"quote-select__cta"}>
              {cta("cta.requestQuote")}
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
