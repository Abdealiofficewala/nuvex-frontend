import { getTranslations } from "next-intl/server";
import { MediaFill } from "@/components/ui/media-fill";
import { Reveal } from "@/components/ui/reveal";
import { HeroActions } from "@/components/website/common/HeroActions";
import { productHref, quoteHref } from "@/lib/constants";
import type { Product } from "@/types/product";

type FeaturedProductProps = {
  product: Product;
};

export async function FeaturedProduct({ product }: FeaturedProductProps) {
  const t = await getTranslations("home");
  const cta = await getTranslations("common");

  return (
    <section className={"featured"}>
      <MediaFill src={product?.image} alt={product?.name} className={"featured__media"} sizes="50vw" />
      <Reveal className={"featured__copy"}>
        <p className="t-caption">{t("featured.eyebrow")}</p>
        <h2 className="t-h1">{product?.name}</h2>
        {product?.description ? <p>{product.description}</p> : null}
        {product?.keySpec ? <p className="t-caption">{product.keySpec}</p> : null}
        {product?.id ? (
          <HeroActions
            className="hero__actions"
            actions={[
              { href: productHref(product.id), label: cta("cta.viewProduct"), variant: "light" },
              { href: quoteHref(product.id), label: cta("cta.requestQuote"), variant: "accent" },
            ]}
          />
        ) : null}
      </Reveal>
    </section>
  );
}
