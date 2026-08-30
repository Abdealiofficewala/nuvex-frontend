"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/product";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const shots = product.gallery?.length ? product.gallery : product.image ? [product.image] : [];
  const [active, setActive] = useState(shots[0] ?? "");

  return (
    <div className={"gallery"}>
      <div className={"gallery__stage"}>
        {active ? (
          <Image
            key={active}
            src={active}
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
              className={src === active ? "is-active" : undefined}
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
