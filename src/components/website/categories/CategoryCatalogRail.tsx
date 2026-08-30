import { cn } from "@/lib/utils";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/routing";
import type { ProductCategory } from "@/types/product";

type CategoryCatalogRailProps = {
  categories: ProductCategory[];
};

export function CategoryCatalogRail({ categories }: CategoryCatalogRailProps) {
  if (!categories.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "catalog-rail-wrap",
        "mobile-slider-wrap",
      )}
    >
      <div className={cn("catalog-rail__track", "mobile-slider__track")}>
        {categories.map((category, index) => (
          <Reveal
            key={category.id}
            className={cn("catalog-rail__item", "mobile-slider__item")}
            delay={index * 70}
          >
            <Link href={`/products?category=${category.slug}`} className={"category-tile"}>
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name ?? ""}
                  fill
                  sizes="(max-width: 720px) 78vw, 25vw"
                  quality={75}
                />
              ) : null}
              <div className={"category-tile__copy"}>
                <h3 className="t-h3">{category.name}</h3>
                {category.summary ? <p className="t-small">{category.summary}</p> : null}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
