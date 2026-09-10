export const SOCIAL_LINK_KEYS = [
  "linkedin",
  "whatsapp",
  "instagram",
  "facebook",
  "youtube",
  "twitter",
] as const;

export type SocialLinkKey = (typeof SOCIAL_LINK_KEYS)[number];

export type SocialIconName =
  | "linkedin"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "youtube"
  | "x";

export type SocialLinkField = {
  key: SocialLinkKey;
  icon: SocialIconName;
  label: string;
  accent: string;
  placeholder: string;
};

export const SOCIAL_LINK_FIELDS: readonly SocialLinkField[] = [
  {
    key: "linkedin",
    icon: "linkedin",
    label: "LinkedIn",
    accent: "#0A66C2",
    placeholder: "https://www.linkedin.com/company/hakimi-fastners",
  },
  {
    key: "whatsapp",
    icon: "whatsapp",
    label: "WhatsApp",
    accent: "#25D366",
    placeholder: "https://wa.me/919727366046",
  },
  {
    key: "instagram",
    icon: "instagram",
    label: "Instagram",
    accent: "#E4405F",
    placeholder: "https://www.instagram.com/hakimifastners",
  },
  {
    key: "facebook",
    icon: "facebook",
    label: "Facebook",
    accent: "#1877F2",
    placeholder: "https://www.facebook.com/hakimifastners",
  },
  {
    key: "youtube",
    icon: "youtube",
    label: "YouTube",
    accent: "#FF0000",
    placeholder: "https://www.youtube.com/@hakimifastners",
  },
  {
    key: "twitter",
    icon: "x",
    label: "X",
    accent: "#141A22",
    placeholder: "https://x.com/hakimifastners",
  },
] as const;

export type SocialLinksMap = Record<SocialLinkKey, string>;

export type SocialLinksVisibilityMap = Record<SocialLinkKey, boolean>;

export type SocialLinksState = {
  links: SocialLinksMap;
  visibility: SocialLinksVisibilityMap;
};
