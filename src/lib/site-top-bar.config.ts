export const SITE_TOP_BAR_CONTACT_FIELDS = ["phone", "email", "location"] as const;

export type SiteTopBarContactField = (typeof SITE_TOP_BAR_CONTACT_FIELDS)[number];

export type SiteTopBarState = {
  visible: boolean;
  phone: string;
  email: string;
  location: string;
  showPhone: boolean;
  showEmail: boolean;
  showLocation: boolean;
  showMessages: boolean;
  messages: string[];
};

export const SITE_TOP_BAR_MESSAGE_LIMIT = 8;
export const SITE_TOP_BAR_MESSAGE_MAX_LENGTH = 120;
