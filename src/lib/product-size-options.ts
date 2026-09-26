import { normalizeSlug } from "@/lib/appearance/slug";
import type { Product, ProductSizeOption } from "@/types/product";

export function createEmptySizeOption(isDefault = false): ProductSizeOption {
  return {
    label: "",
    slug: "",
    image: "",
    gallery: [],
    isDefault,
  };
}

type LegacyProductShape = {
  sizes?: string[];
  sizeOptions?: ProductSizeOption[];
  image?: string;
  gallery?: string[];
};

export function normalizeSizeOptions(
  options: ProductSizeOption[] | undefined,
  fallbackImage = "",
  fallbackGallery: string[] = [],
): ProductSizeOption[] {
  const items: ProductSizeOption[] = [];

  (options ?? []).forEach((item, index) => {
    const label = item.label?.trim() ?? "";
    if (!label) {
      return;
    }

    const slug = normalizeSlug(item.slug || label) || `size-${index + 1}`;
    const image = item.image?.trim() || fallbackImage;
    const gallery = item.gallery?.length ? item.gallery : image ? [image] : fallbackGallery;

    items.push({
      label,
      slug,
      image,
      gallery,
      isDefault: item.isDefault === true,
    });
  });

  if (!items.length) {
    return [];
  }

  const defaultIndex = items.findIndex((item) => item.isDefault);
  const resolvedDefaultIndex = defaultIndex >= 0 ? defaultIndex : 0;

  return items.map((item, index) => ({
    ...item,
    isDefault: index === resolvedDefaultIndex,
  }));
}

export function migrateLegacySizeOptions(product: LegacyProductShape): ProductSizeOption[] {
  if (product.sizeOptions?.length) {
    return normalizeSizeOptions(product.sizeOptions, product.image ?? "", product.gallery ?? []);
  }

  const legacySizes = product.sizes ?? [];
  if (!legacySizes.length) {
    return [];
  }

  return normalizeSizeOptions(
    legacySizes.map((label, index) => ({
      label,
      slug: normalizeSlug(label) || `size-${index + 1}`,
      image: product.image ?? "",
      gallery: index === 0 ? (product.gallery ?? []) : [],
      isDefault: index === 0,
    })),
    product.image ?? "",
    product.gallery ?? [],
  );
}

export function getProductSizeLabels(product: Pick<Product, "sizeOptions">): string[] {
  return product.sizeOptions?.map((item) => item.label) ?? [];
}

export function getDefaultSizeOption(product: Pick<Product, "sizeOptions">): ProductSizeOption | undefined {
  return product.sizeOptions?.find((item) => item.isDefault) ?? product.sizeOptions?.[0];
}

export function findSizeOptionByLabel(
  product: Pick<Product, "sizeOptions">,
  label?: string | null,
): ProductSizeOption | undefined {
  const needle = label?.trim();
  if (!needle) {
    return undefined;
  }

  return product.sizeOptions?.find((item) => item.label === needle || item.slug === needle);
}

export function resolveProductListingImage(
  sizeOptions: ProductSizeOption[] | undefined,
  fallbackImage = "",
): string {
  const defaultOption = sizeOptions?.find((item) => item.isDefault) ?? sizeOptions?.[0];
  return defaultOption?.image?.trim() || fallbackImage.trim();
}

export function resolveSizeOptionGallery(
  option: ProductSizeOption | undefined,
  productGallery: string[] = [],
): string[] {
  if (option?.gallery?.length) {
    return option.gallery;
  }

  if (option?.image) {
    return [option.image];
  }

  if (productGallery.length) {
    return productGallery;
  }

  return [];
}

export function normalizeProductRecord<T extends LegacyProductShape & Record<string, unknown>>(
  product: T,
): T & { sizeOptions: ProductSizeOption[] } {
  const sizeOptions = migrateLegacySizeOptions(product);
  const image = resolveProductListingImage(sizeOptions, product.image ?? "") || product.image || "";

  return {
    ...product,
    sizeOptions,
    image,
  };
}
