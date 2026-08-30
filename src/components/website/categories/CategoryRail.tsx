import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { CategoryCatalogRail } from "@/components/website/categories/CategoryCatalogRail";
import { SectionIntro } from "@/components/website/common/SectionIntro";
import type { ProductCategory } from "@/types/product";

type CategoryRailProps = {
  categories?: ProductCategory[];
};

export async function CategoryRail({ categories }: CategoryRailProps) {
  const t = await getTranslations("home.categories");

  if (!categories?.length) {
    return null;
  }

  return (
    <section className="section home-catalog">
      <div className="container">
        <Reveal>
          <SectionIntro eyebrow={t("eyebrow")} title={t("title")} body={t("lede")} />
        </Reveal>
        <CategoryCatalogRail categories={categories} />
      </div>
    </section>
  );
}
