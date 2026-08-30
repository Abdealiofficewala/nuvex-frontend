export type NavLabelKey =
  | "nav.home"
  | "nav.about"
  | "nav.products"
  | "nav.industries"
  | "nav.contact"
  | "nav.quote";

export type NavItem = {
  href: string;
  labelKey: NavLabelKey;
};

export type SocialPlatform =
  | "linkedin"
  | "instagram"
  | "facebook"
  | "twitter"
  | "youtube"
  | "github";
