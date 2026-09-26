"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  getDefaultSizeOption,
  resolveSizeOptionGallery,
} from "@/lib/product-size-options";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

type ProductDetailGalleryProps = {
  product: Product;
};

export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
  const t = useTranslations("products");
  const defaultOption = getDefaultSizeOption(product);
  const [selectedSlug, setSelectedSlug] = useState(defaultOption?.slug ?? "");

  const selectedOption = useMemo(
    () => product.sizeOptions?.find((item) => item.slug === selectedSlug) ?? defaultOption,
    [defaultOption, product.sizeOptions, selectedSlug],
  );

  const shots = useMemo(
    () => resolveSizeOptionGallery(selectedOption, product.gallery),
    [product.gallery, selectedOption],
  );
  const [active, setActive] = useState(shots[0] ?? "");

  const activeImage = shots.includes(active) ? active : shots[0] ?? "";

  return (
    <div className={"gallery"}>
      {product.sizeOptions?.length ? (
        <div className={"product-view__sizes product-view__sizes--selector"}>
          <p className={"t-caption"}>{t("detail.sizes")}</p>
          <div className={"product-view__size-options"}>
            {product.sizeOptions.map((option) => (
              <button
                key={option.slug}
                type="button"
                className={cn(
                  "product-view__size-option",
                  selectedOption?.slug === option.slug && "is-active",
                )}
                onClick={() => {
                  setSelectedSlug(option.slug);
                  const nextShots = resolveSizeOptionGallery(option, product.gallery);
                  setActive(nextShots[0] ?? "");
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className={"gallery__stage"}>
        {activeImage ? (
          <Image
            key={activeImage}
            src={activeImage}
            alt={product?.name ?? ""}
            fill
            sizes="(max-width: 980px) 100vw, 50vw"
            quality={75}
            priority
          />
        ) : null}
      </div>

      {shots.length > 1 ? (
        <div className={"gallery__thumbs"}>
          {shots.map((src) => (
            <button
              key={src}
              type="button"
              className={src === activeImage ? "is-active" : undefined}
              onClick={() => setActive(src)}
              aria-label={product.name}
            >
              <Image src={src} alt="" width={180} height={135} sizes="120px" quality={60} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
