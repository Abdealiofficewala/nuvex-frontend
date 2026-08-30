"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { productHref } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  lead?: boolean;
  leadLabel?: string;
  showcase?: boolean;
};

export function ProductCard({
  product,
  priority = false,
  lead = false,
  leadLabel,
  showcase = false,
}: ProductCardProps) {
  const t = useTranslations("common");

  if (!product?.id) {
    return null;
  }

  if (showcase) {
    return (
      <article
        className={cn(
          "product-card product-card--showcase",
          lead && "product-card--showcase-lead",
        )}
      >
        <Link href={productHref(product.id)} className={"product-card__link"}>
          <div className={"product-card__media"}>
            {product?.image ? (
              <Image
                src={product.image}
                alt={product?.name ?? ""}
                fill
                sizes={lead ? "(max-width: 980px) 100vw, 50vw" : "(max-width: 980px) 100vw, 24vw"}
                quality={75}
                priority={priority}
              />
            ) : null}
            {lead && leadLabel ? <span className={"product-card__badge"}>{leadLabel}</span> : null}
            {product?.category ? <span className={"product-card__chip"}>{product.category}</span> : null}
            <div className={cn("product-card__overlay", !lead && "product-card__overlay--compact")}>
              {product?.keySpec ? <p className={"product-card__spec"}>{product.keySpec}</p> : null}
              <h3 className={"product-card__title"}>{product?.name}</h3>
              {product?.shortDescription ? (
                <p className={"product-card__overlay-copy"}>{product.shortDescription}</p>
              ) : null}
              <span className={cn("product-card__cta", "product-card__cta--light")}>{t("cta.viewProduct")}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={"product-card"}>
      <Link href={productHref(product.id)} className={"product-card__link"}>
        <div className={"product-card__media"}>
          {product?.image ? (
            <Image
              src={product.image}
              alt={product?.name ?? ""}
              fill
              sizes="(max-width: 720px) 50vw, (max-width: 1100px) 50vw, 33vw"
              quality={75}
              priority={priority}
            />
          ) : null}
          {product?.category ? <span className={"product-card__chip"}>{product.category}</span> : null}
        </div>
        <div className={"product-card__body"}>
          {product?.keySpec ? <p className={"product-card__spec"}>{product.keySpec}</p> : null}
          <h3 className={"product-card__title"}>{product?.name}</h3>
          <span className={"product-card__cta"}>{t("cta.viewProduct")}</span>
        </div>
      </Link>
    </article>
  );
}
