import type { CreateContactMessageInput } from "@/types/message";
import {
  isFormValid,
  validateMinLength,
  validateRequiredEmail,
  validateRequiredText,
} from "@/lib/validations/common";

export type QuoteErrorKey =
  | "errors.nameRequired"
  | "errors.emailInvalid"
  | "errors.productRequired"
  | "errors.sizeRequired"
  | "errors.quantityRequired"
  | "errors.noteRequired";

export type QuoteFormErrors = Partial<
  Record<"name" | "email" | "productSlug" | "size" | "quantity" | "message", QuoteErrorKey>
>;

type QuoteValidationInput = CreateContactMessageInput & {
  isCustom?: boolean;
  requiresSize?: boolean;
};

export function validateQuoteForm(values: QuoteValidationInput): QuoteFormErrors {
  const errors: QuoteFormErrors = {};

  if (validateRequiredText(values.name ?? "")) {
    errors.name = "errors.nameRequired";
  }

  const emailError = validateRequiredEmail(values.email ?? "");
  if (emailError === "required" || emailError === "invalidEmail") {
    errors.email = "errors.emailInvalid";
  }

  if (validateRequiredText(values.productSlug ?? "")) {
    errors.productSlug = "errors.productRequired";
  }

  if (values.requiresSize && validateRequiredText(values.size ?? "")) {
    errors.size = "errors.sizeRequired";
  }

  if (validateRequiredText(values.quantity ?? "")) {
    errors.quantity = "errors.quantityRequired";
  }

  if (values.isCustom && (validateRequiredText(values.message ?? "") || validateMinLength(values.message ?? "", 5))) {
    errors.message = "errors.noteRequired";
  }

  return errors;
}

export function isQuoteFormValid(errors: QuoteFormErrors): boolean {
  return isFormValid(errors);
}

export function buildQuoteMessage(input: {
  productName?: string;
  productSlug?: string;
  keySpec?: string;
  size?: string;
  specs?: Array<{ label: string; value: string }>;
  quantity?: string;
  note?: string;
}): string {
  if (input.productSlug === "custom") {
    return input.note?.trim() ?? "";
  }

  const specLine = input.specs
    ?.slice(0, 4)
    .map((item) => `${item.label}: ${item.value}`)
    .join("; ");

  return [
    input.productName ? `Quotation for ${input.productName}.` : "",
    input.productSlug && input.productSlug !== "custom" ? `Product ID: ${input.productSlug}.` : "",
    input.size?.trim() ? `Size: ${input.size.trim()}.` : "",
    input.keySpec ? `Catalogue spec: ${input.keySpec}.` : "",
    specLine ? specLine + "." : "",
    input.quantity?.trim() ? `Quantity: ${input.quantity.trim()}.` : "",
    input.note?.trim() ? `Note: ${input.note.trim()}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}
