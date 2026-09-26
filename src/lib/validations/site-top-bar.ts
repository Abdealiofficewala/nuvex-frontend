import {
  SITE_TOP_BAR_MESSAGE_LIMIT,
  SITE_TOP_BAR_MESSAGE_MAX_LENGTH,
  type SiteTopBarContactField,
  type SiteTopBarState,
} from "@/lib/site-top-bar.config";
import { assignFieldError, isFormValid, validateRequiredEmail, validateRequiredText } from "@/lib/validations/common";

export type SiteTopBarErrorKey = "required" | "tooLong" | "invalidEmail" | "noContent";

export type SiteTopBarFormErrors = {
  form?: SiteTopBarErrorKey;
  phone?: SiteTopBarErrorKey;
  email?: SiteTopBarErrorKey;
  location?: SiteTopBarErrorKey;
  messages?: Partial<Record<number, SiteTopBarErrorKey>>;
};

function validateMessageLine(value: string): SiteTopBarErrorKey | undefined {
  const requiredError = validateRequiredText(value);
  if (requiredError) {
    return requiredError;
  }

  if (value.trim().length > SITE_TOP_BAR_MESSAGE_MAX_LENGTH) {
    return "tooLong";
  }

  return undefined;
}

function hasVisibleContent(state: SiteTopBarState) {
  const hasDetail =
    (state.showPhone && state.phone.trim()) ||
    (state.showEmail && state.email.trim()) ||
    (state.showLocation && state.location.trim());
  const hasMessages = state.showMessages && state.messages.some((line) => line.trim());

  return hasDetail || hasMessages;
}

export function validateSiteTopBarForm(state: SiteTopBarState): SiteTopBarFormErrors {
  const errors: SiteTopBarFormErrors = {};

  if (!state.visible) {
    return errors;
  }

  if (!hasVisibleContent(state)) {
    errors.form = "noContent";
  }

  if (state.showPhone) {
    assignFieldError(errors, "phone", validateRequiredText(state.phone));
  }

  if (state.showEmail) {
    assignFieldError(errors, "email", validateRequiredEmail(state.email));
  }

  if (state.showLocation) {
    assignFieldError(errors, "location", validateRequiredText(state.location));
  }

  if (state.showMessages) {
    const messageErrors: Partial<Record<number, SiteTopBarErrorKey>> = {};

    state.messages.slice(0, SITE_TOP_BAR_MESSAGE_LIMIT).forEach((line, index) => {
      if (!line.trim()) {
        return;
      }

      assignFieldError(messageErrors, index, validateMessageLine(line));
    });

    if (Object.keys(messageErrors).length) {
      errors.messages = messageErrors;
    }
  }

  return errors;
}

export function isSiteTopBarFormValid(errors: SiteTopBarFormErrors) {
  if (errors.form) {
    return false;
  }

  const { form: _form, messages, ...fieldErrors } = errors;
  return isFormValid(fieldErrors) && isFormValid(messages ?? {});
}

export type SiteTopBarField = SiteTopBarContactField | "messages";
