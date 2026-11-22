import type {
  CatalogProductInput,
  CatalogStatus,
  ProductMasterKey,
  ProductTypeConfiguration,
  ProductVariant,
} from "@/types/product-catalog";
import { getMasterConfig } from "@/lib/products/master-registry";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type FieldErrors = Record<string, string>;

export function validateSlug(slug: string): boolean {
  return slug.trim().length >= 2 && SLUG_PATTERN.test(slug.trim());
}

export function validateMasterForm(
  key: ProductMasterKey,
  values: Record<string, unknown>,
  isEdit: boolean,
): FieldErrors {
  const config = getMasterConfig(key);
  const errors: FieldErrors = {};

  const name = String(values.name ?? "").trim();
  if (name.length < 2) {
    errors.name = "required";
  }

  const slug = String(values.slug ?? "").trim();
  if (!validateSlug(slug)) {
    errors.slug = "invalidSlug";
  }

  if (config.hasCode) {
    const code = String(values.code ?? "").trim();
    if (!code) {
      errors.code = "required";
    }
  }

  if (config.hasDimensionFields) {
    const display = String(values.display ?? "").trim();
    if (!display) {
      errors.display = "required";
    }
    const dimension = String(values.dimension ?? "").trim();
    if (!dimension) {
      errors.dimension = "required";
    }
    const unit = String(values.unit ?? "").trim();
    if (!unit) {
      errors.unit = "required";
    }
  }

  if (config.hasAttributeType) {
    const valueType = String(values.valueType ?? "").trim();
    if (!valueType) {
      errors.valueType = "required";
    }
  }

  const status = values.status as CatalogStatus | undefined;
  if (!status) {
    errors.status = "required";
  }

  return errors;
}

export function isMasterFormValid(errors: FieldErrors): boolean {
  return Object.keys(errors).length === 0;
}

function variantCombinationKey(
  variant: ProductVariant,
  typeConfig?: ProductTypeConfiguration,
): string {
  const attrs = typeConfig?.variantAttributes ?? [];
  const parts: string[] = [];
  if (attrs.includes("size")) {
    parts.push(variant.sizeId);
  }
  if (attrs.includes("material")) {
    parts.push(variant.materialId);
  }
  if (attrs.includes("grade")) {
    parts.push(variant.gradeId);
  }
  if (attrs.includes("standard")) {
    parts.push(variant.standardId);
  }
  if (attrs.includes("finish")) {
    parts.push(variant.finishId);
  }
  if (attrs.includes("thread")) {
    parts.push(variant.threadId);
  }
  if (attrs.includes("packaging")) {
    parts.push(variant.packagingId);
  }
  return parts.join("|");
}

export function validateProductForm(
  values: CatalogProductInput,
  typeConfig?: ProductTypeConfiguration,
): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name?.trim()) {
    errors.name = "required";
  }

  if (!values.productCode?.trim()) {
    errors.productCode = "required";
  }

  if (!validateSlug(values.slug ?? "")) {
    errors.slug = "invalidSlug";
  }

  if (!values.category?.id) {
    errors.category = "required";
  }

  if (!values.type?.id) {
    errors.type = "required";
  }

  if (!values.status) {
    errors.status = "required";
  }

  if (values.seo.metaTitle && values.seo.metaTitle.length > 70) {
    errors.metaTitle = "tooLong";
  }

  if (values.seo.metaDescription && values.seo.metaDescription.length > 160) {
    errors.metaDescription = "tooLong";
  }

  const skus = new Set<string>();
  const combinations = new Set<string>();
  for (const variant of values.variants) {
    if (!variant.sku.trim()) {
      errors.variants = "invalidVariants";
      break;
    }
    if (skus.has(variant.sku)) {
      errors.variants = "duplicateSku";
      break;
    }
    skus.add(variant.sku);

    const combo = variantCombinationKey(variant, typeConfig);
    if (combo.replace(/\|/g, "").length > 0) {
      if (combinations.has(combo)) {
        errors.variants = "duplicateVariant";
        break;
      }
      combinations.add(combo);
    }
  }

  return errors;
}

export function isProductFormValid(errors: FieldErrors): boolean {
  return Object.keys(errors).length === 0;
}
