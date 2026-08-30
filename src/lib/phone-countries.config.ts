export type PhoneCountryOption = {
  code: string;
  dial: string;
  label: string;
};

export const PHONE_COUNTRY_OPTIONS: readonly PhoneCountryOption[] = [
  { code: "IN", dial: "+91", label: "India" },
  { code: "US", dial: "+1", label: "United States" },
  { code: "GB", dial: "+44", label: "United Kingdom" },
  { code: "AE", dial: "+971", label: "United Arab Emirates" },
  { code: "AU", dial: "+61", label: "Australia" },
  { code: "CA", dial: "+1", label: "Canada" },
  { code: "SG", dial: "+65", label: "Singapore" },
  { code: "DE", dial: "+49", label: "Germany" },
  { code: "FR", dial: "+33", label: "France" },
  { code: "SA", dial: "+966", label: "Saudi Arabia" },
  { code: "QA", dial: "+974", label: "Qatar" },
  { code: "OM", dial: "+968", label: "Oman" },
  { code: "KW", dial: "+965", label: "Kuwait" },
  { code: "BH", dial: "+973", label: "Bahrain" },
  { code: "CN", dial: "+86", label: "China" },
  { code: "JP", dial: "+81", label: "Japan" },
] as const;

export const DEFAULT_PHONE_COUNTRY_CODE = "+91";

export function findPhoneCountryByDial(dial: string): PhoneCountryOption | undefined {
  return PHONE_COUNTRY_OPTIONS.find((item) => item.dial === dial);
}

export function findPhoneCountryByCode(code: string): PhoneCountryOption | undefined {
  return PHONE_COUNTRY_OPTIONS.find((item) => item.code === code);
}
