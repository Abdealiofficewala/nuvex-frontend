import { normalizeSocialLinkValue } from "@/lib/social-links";
import { SOCIAL_LINK_KEYS, type SocialLinkKey, type SocialLinksState } from "@/lib/social-links.config";
import {
  assignFieldError,
  isFormValid,
  validateOptionalUrl,
  validateRequiredText,
} from "@/lib/validations/common";

export type SocialLinkErrorKey = "invalidUrl" | "required";

export type SocialLinksFormErrors = Partial<Record<SocialLinkKey, SocialLinkErrorKey>>;

export function validateSocialLinkField(
  key: SocialLinkKey,
  value: string,
  visible: boolean,
): SocialLinkErrorKey | undefined {
  const normalized = normalizeSocialLinkValue(key, value ?? "");

  if (visible) {
    const requiredError = validateRequiredText(normalized);
    if (requiredError) {
      return "required";
    }
  }

  if (!normalized) {
    return undefined;
  }

  const urlError = validateOptionalUrl(normalized);
  return urlError ?? undefined;
}

export function validateSocialLinksForm(state: SocialLinksState): SocialLinksFormErrors {
  const errors: SocialLinksFormErrors = {};

  for (const key of SOCIAL_LINK_KEYS) {
    assignFieldError(
      errors,
      key,
      validateSocialLinkField(key, state.links[key], state.visibility[key]),
    );
  }

  return errors;
}

export function isSocialLinksFormValid(errors: SocialLinksFormErrors) {
  return isFormValid(errors);
}

export function touchAllSocialLinkFields(): Partial<Record<SocialLinkKey, boolean>> {
  return SOCIAL_LINK_KEYS.reduce(
    (acc, key) => {
      acc[key] = true;
      return acc;
    },
    {} as Partial<Record<SocialLinkKey, boolean>>,
  );
}
