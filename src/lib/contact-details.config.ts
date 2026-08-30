export const CONTACT_PHONE_KEYS = ["mobile", "whatsapp"] as const;

export type ContactPhoneKey = (typeof CONTACT_PHONE_KEYS)[number];

export type ContactPhone = {
  key: ContactPhoneKey;
  label: string;
  countryCode: string;
  number: string;
  value: string;
};

export type ContactAddress = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export type ContactDetailsState = {
  person: string;
  email: string;
  phone: string;
  phones: ContactPhone[];
  address: ContactAddress;
  mapQuery: string;
};

export const CONTACT_ADDRESS_FIELDS = [
  { key: "street", label: "Street" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "postalCode", label: "Postal code" },
] as const satisfies ReadonlyArray<{ key: keyof ContactAddress; label: string }>;

export type ContactAccordionSection = "contact" | "office";
