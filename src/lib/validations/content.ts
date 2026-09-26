import { isValidSlug, normalizeSlug } from "@/lib/appearance/slug";
import { categoryHasType } from "@/lib/product-type-utils";
import { isValidWebsiteModuleRoute } from "@/lib/website-modules";
import {
  assignFieldError,
  isFormValid,
  validateMinLength,
  validateRequiredText,
} from "@/lib/validations/common";
import type {
  BannerInput,
  CategoryInput,
  IndustryInput,
  ProductInput,
  ProductTypeInput,
  SectorInput,
} from "@/types/content-admin";
import { normalizeSizeOptions } from "@/lib/product-size-options";
import type { ProductCategory, ProductSizeOption, ProductType } from "@/types/product";

export type ContentErrorKey =
  | "required"
  | "tooShort"
  | "invalidSlug"
  | "invalidCategory"
  | "invalidType"
  | "invalidIndustry"
  | "invalidPageRoute"
  | "duplicatePageRoute"
  | "invalidSizeOptions";

function validateNameField(value: string | undefined) {
  const text = value ?? "";
  const required = validateRequiredText(text);
  if (required) {
    return required;
  }

  return validateMinLength(text, 2);
}

function validateSlugField(value: string | undefined) {
  const text = value ?? "";
  const required = validateRequiredText(text);
  if (required) {
    return required;
  }

  const normalized = normalizeSlug(text);
  if (!isValidSlug(normalized)) {
    return "invalidSlug" as const;
  }

  return undefined;
}

function validateImageField(value: string | undefined) {
  return validateRequiredText(value ?? "");
}

type BannerValidationOptions = {
  existingPageRoutes?: readonly string[];
  excludePageRoute?: string;
};

export function validateBannerInput(input: BannerInput, options: BannerValidationOptions = {}) {
  const errors: Partial<Record<keyof BannerInput, ContentErrorKey>> = {};

  assignFieldError(errors, "title", validateNameField(input.title));
  assignFieldError(errors, "slug", validateSlugField(input.slug));
  assignFieldError(errors, "body", validateRequiredText(input.body ?? ""));
  assignFieldError(errors, "image", validateImageField(input.image));

  const pageRoute = input.pageRoute?.trim();
  if (!pageRoute) {
    assignFieldError(errors, "pageRoute", "required");
  } else if (!isValidWebsiteModuleRoute(pageRoute)) {
    assignFieldError(errors, "pageRoute", "invalidPageRoute");
  } else if (
    options.existingPageRoutes?.some(
      (route) => route === pageRoute && route !== options.excludePageRoute,
    )
  ) {
    assignFieldError(errors, "pageRoute", "duplicatePageRoute");
  }

  return errors;
}

export function isBannerFormValid(errors: Partial<Record<keyof BannerInput, ContentErrorKey>>) {
  return isFormValid(errors);
}

export function validateCategoryInput(
  input: CategoryInput,
  productTypes: readonly ProductType[] = [],
) {
  const errors: Partial<Record<keyof CategoryInput, ContentErrorKey>> = {};

  assignFieldError(errors, "name", validateNameField(input.name));
  assignFieldError(errors, "slug", validateSlugField(input.slug));
  assignFieldError(errors, "summary", validateRequiredText(input.summary));
  assignFieldError(errors, "image", validateImageField(input.image));

  const typeSlugs = input.typeSlugs?.map((slug) => slug.trim()).filter(Boolean) ?? [];
  if (!typeSlugs.length) {
    assignFieldError(errors, "typeSlugs", "required");
  } else if (typeSlugs.some((slug) => !productTypes.some((item) => item.slug === slug))) {
    assignFieldError(errors, "typeSlugs", "invalidType");
  }

  return errors;
}

export function isCategoryFormValid(errors: Partial<Record<keyof CategoryInput, ContentErrorKey>>) {
  return isFormValid(errors);
}

export function validateIndustryInput(input: IndustryInput) {
  const errors: Partial<Record<keyof IndustryInput, ContentErrorKey>> = {};

  assignFieldError(errors, "name", validateNameField(input.name));
  assignFieldError(errors, "slug", validateSlugField(input.slug));
  assignFieldError(errors, "image", validateImageField(input.image));

  return errors;
}

export function isIndustryFormValid(errors: Partial<Record<keyof IndustryInput, ContentErrorKey>>) {
  return isFormValid(errors);
}

export function validateSectorInput(
  input: SectorInput,
  industries: readonly { id: string }[],
) {
  const errors: Partial<Record<keyof SectorInput, ContentErrorKey>> = {};

  assignFieldError(errors, "name", validateNameField(input.name));
  assignFieldError(errors, "slug", validateSlugField(input.slug));
  assignFieldError(errors, "image", validateImageField(input.image));

  const industryId = input.industryId?.trim();
  if (!industryId) {
    assignFieldError(errors, "industryId", "required");
  } else if (!industries.some((item) => item.id === industryId)) {
    assignFieldError(errors, "industryId", "invalidIndustry");
  }

  return errors;
}

export function isSectorFormValid(errors: Partial<Record<keyof SectorInput, ContentErrorKey>>) {
  return isFormValid(errors);
}

function validateSizeOptionsField(
  sizeOptions: ProductSizeOption[] | undefined,
  fallbackImage: string,
): ContentErrorKey | undefined {
  const normalized = normalizeSizeOptions(sizeOptions, fallbackImage);
  if (!normalized.length) {
    return "required";
  }

  const hasMissingImage = normalized.some((item) => !item.image?.trim() && !fallbackImage.trim());
  if (hasMissingImage) {
    return "invalidSizeOptions";
  }

  return undefined;
}

export function validateProductTypeInput(input: ProductTypeInput) {
  const errors: Partial<Record<keyof ProductTypeInput, ContentErrorKey>> = {};

  assignFieldError(errors, "name", validateNameField(input.name));
  assignFieldError(errors, "slug", validateSlugField(input.slug));
  assignFieldError(errors, "image", validateImageField(input.image));

  return errors;
}

export function isProductTypeFormValid(
  errors: Partial<Record<keyof ProductTypeInput, ContentErrorKey>>,
) {
  return isFormValid(errors);
}

export function validateProductInput(
  input: ProductInput,
  categories: readonly ProductCategory[],
  productTypes: readonly ProductType[] = [],
) {
  const errors: Partial<Record<keyof ProductInput, ContentErrorKey>> = {};

  assignFieldError(errors, "name", validateNameField(input.name));
  assignFieldError(errors, "slug", validateSlugField(input.slug));
  assignFieldError(errors, "shortDescription", validateRequiredText(input.shortDescription));
  assignFieldError(errors, "sizeOptions", validateSizeOptionsField(input.sizeOptions, input.image));
  assignFieldError(
    errors,
    "image",
    validateImageField(input.image || normalizeSizeOptions(input.sizeOptions, input.image)[0]?.image || ""),
  );

  const categorySlug = input.categorySlug?.trim();
  const category = categories.find((item) => item.slug === categorySlug);
  if (!categorySlug) {
    assignFieldError(errors, "categorySlug", "required");
  } else if (!category) {
    assignFieldError(errors, "categorySlug", "invalidCategory");
  }

  const typeSlug = input.subcategorySlug?.trim();
  if (typeSlug) {
    const typeExists = productTypes.some((item) => item.slug === typeSlug);
    const linkedToCategory = category ? categoryHasType(category, typeSlug) : false;
    if (!typeExists || !linkedToCategory) {
      assignFieldError(errors, "subcategorySlug", "invalidType");
    }
  }

  return errors;
}

export function isProductFormValid(errors: Partial<Record<keyof ProductInput, ContentErrorKey>>) {
  return isFormValid(errors);
}

export function parseLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function joinLines(values: string[] | undefined): string {
  return values?.join("\n") ?? "";
}
