import { ProductCard } from "@/components/website/products/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { ReactNode } from "react";

type ProductGridProps = {
  products?: Product[];
  empty?: ReactNode;
  className?: string;
  leadId?: string | null;
  leadLabel?: string;
  variant?: "default" | "showcase";
};

export function ProductGrid({
  products,
  empty,
  className,
  leadId,
  leadLabel,
  variant = "default",
}: ProductGridProps) {
  if (!products?.length) {
    return empty ?? null;
  }

  const count = products.length;
  const showcaseClass =
    variant === "showcase"
      ? count >= 3
        ? "product-grid--showcase"
        : count === 2
          ? "product-grid--showcase-duo"
          : "product-grid--showcase-single"
      : "";

  return (
    <div className={cn("product-grid", showcaseClass, className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 3}
          lead={Boolean(leadId && product.id === leadId)}
          leadLabel={leadLabel}
          showcase={variant === "showcase"}
        />
      ))}
    </div>
  );
}
