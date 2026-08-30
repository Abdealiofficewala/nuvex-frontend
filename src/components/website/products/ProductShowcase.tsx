import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/website/common/SectionHead";
import { ProductGrid } from "@/components/website/products/ProductGrid";
import { ROUTES } from "@/lib/constants";
import type { Product } from "@/types/product";

type ProductShowcaseProps = {
  products?: Product[];
  leadId?: string | null;
};

export async function ProductShowcase({ products, leadId }: ProductShowcaseProps) {
  const t = await getTranslations("home");
  const cta = await getTranslations("common");

  if (!products?.length) {
    return null;
  }

  return (
    <section className={cn("section", "section--tight", "product-showcase-section")}>
      <div className="container">
        <Reveal>
          <SectionHead
            eyebrow={t("products.eyebrow")}
            title={t("products.title")}
            body={t("products.lede")}
            href={ROUTES.products}
            browseLabel={cta("cta.viewProducts")}
          />
        </Reveal>
        <Reveal delay={70}>
          <div className={cn("product-showcase-rail", "mobile-slider-wrap", "mobile-slider-wrap--swipe")}>
            <ProductGrid
              products={products}
              leadId={leadId}
              leadLabel={t("featured.eyebrow")}
              variant="showcase"
              className="product-showcase-rail__track mobile-slider__track"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
