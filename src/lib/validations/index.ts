export {
  EMAIL_PATTERN,
  PHONE_MAX_DIGITS,
  PHONE_MIN_DIGITS,
  assignFieldError,
  hasValidationErrors,
  hasValue,
  isFormValid,
  isValidEmail,
  isValidPhoneNumber,
  isValidUrl,
  validateMinLength,
  validateOptionalEmail,
  validateOptionalPhone,
  validateOptionalUrl,
  validateRequiredEmail,
  validateRequiredPhone,
  validateRequiredText,
  validateRequiredUrl,
  type CommonValidationError,
} from "./common";
export {
  validateAdminLoginForm,
  isAdminLoginFormValid,
  type AdminLoginFormErrors,
  type AdminLoginErrorKey,
} from "./admin-login";
export {
  validateSocialLinkField,
  validateSocialLinksForm,
  isSocialLinksFormValid,
  type SocialLinkErrorKey,
  type SocialLinksFormErrors,
} from "./social-links";
export {
  validateCreateUserForm,
  isCreateUserFormValid,
  type CreateUserFormErrors,
  type CreateUserField,
} from "./admin-user";
export {
  validateContactDetailsForm,
  isContactDetailsFormValid,
  type ContactDetailsErrorKey,
  type ContactDetailsField,
  type ContactDetailsFormErrors,
} from "./contact-details";
export { validateContactForm, isContactFormValid, type ContactFormErrors, type ContactErrorKey } from "./contact";
export {
  validateCompanyProfileForm,
  isCompanyProfileFormValid,
  type CompanyProfileFormErrors,
  type CompanyProfileErrorKey,
} from "./company-profile";
export { validateQuoteForm, isQuoteFormValid, buildQuoteMessage, type QuoteFormErrors, type QuoteErrorKey } from "./quote";
