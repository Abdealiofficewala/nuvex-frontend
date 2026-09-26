import { siteConfig } from "@/config/site.config";
import { ADMIN_SOCIAL_STORE_KEY } from "@/lib/constants";
import {
  SOCIAL_LINK_FIELDS,
  SOCIAL_LINK_KEYS,
  type SocialLinkKey,
  type SocialLinksMap,
  type SocialLinksState,
  type SocialLinksVisibilityMap,
} from "@/lib/social-links.config";
import { hasValue, phoneHref } from "@/lib/utils";

export const SOCIAL_LINKS_UPDATED_EVENT = "hakimi:social-links-updated";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function getDefaultSocialLinks(): SocialLinksMap {
  const whatsappPhone = siteConfig.contact.phones?.find((item) => item.key === "whatsapp");

  return {
    linkedin: siteConfig.social.linkedin,
    whatsapp: whatsappPhone?.value ? phoneHref(whatsappPhone.value, "whatsapp") : "",
    instagram: siteConfig.social.instagram,
    facebook: siteConfig.social.facebook,
    youtube: siteConfig.social.youtube,
    twitter: siteConfig.social.twitter,
  };
}

export function getDefaultSocialLinksVisibility(links: SocialLinksMap): SocialLinksVisibilityMap {
  return SOCIAL_LINK_KEYS.reduce((acc, key) => {
    acc[key] = hasValue(links[key]);
    return acc;
  }, {} as SocialLinksVisibilityMap);
}

export function getDefaultSocialLinksState(): SocialLinksState {
  const links = getDefaultSocialLinks();

  return {
    links,
    visibility: getDefaultSocialLinksVisibility(links),
  };
}

function isSocialLinksMap(value: unknown): value is Partial<SocialLinksMap> {
  return Boolean(value && typeof value === "object" && !("links" in value));
}

function readStoredSocialRaw(): unknown | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const raw = window.sessionStorage.getItem(ADMIN_SOCIAL_STORE_KEY);
    if (raw === null) {
      return undefined;
    }

    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
}

function parseStoredSocialState(raw: unknown): SocialLinksState {
  if (raw && typeof raw === "object" && "links" in raw) {
    const record = raw as Partial<SocialLinksState>;
    const links = sanitizeSocialLinks(record.links ?? {});
    const visibility = SOCIAL_LINK_KEYS.reduce((acc, key) => {
      acc[key] = record.visibility?.[key] ?? hasValue(links[key]);
      return acc;
    }, {} as SocialLinksVisibilityMap);

    return { links, visibility };
  }

  if (isSocialLinksMap(raw)) {
    const links = sanitizeSocialLinks(raw);
    return {
      links,
      visibility: getDefaultSocialLinksVisibility(links),
    };
  }

  return getEmptySocialLinksState();
}

export function getSocialLinksState(): SocialLinksState {
  const stored = readStoredSocialRaw();
  if (stored === undefined) {
    return getEmptySocialLinksState();
  }

  return parseStoredSocialState(stored);
}

export function getWebsiteSocialLinksState(): SocialLinksState {
  const stored = readStoredSocialRaw();
  if (stored === undefined) {
    return getDefaultSocialLinksState();
  }

  return parseStoredSocialState(stored);
}

export function getSocialLinks(): SocialLinksMap {
  return getWebsiteSocialLinksState().links;
}

export function saveSocialLinksState(state: SocialLinksState) {
  const nextState: SocialLinksState = {
    links: sanitizeSocialLinks(state.links),
    visibility: SOCIAL_LINK_KEYS.reduce((acc, key) => {
      acc[key] = Boolean(state.visibility[key]);
      return acc;
    }, {} as SocialLinksVisibilityMap),
  };

  writeJson(ADMIN_SOCIAL_STORE_KEY, nextState);
  window.dispatchEvent(new CustomEvent(SOCIAL_LINKS_UPDATED_EVENT));
}

export function saveSocialLinks(links: SocialLinksMap) {
  const current = getSocialLinksState();
  saveSocialLinksState({ ...current, links: sanitizeSocialLinks(links) });
}

export function getEmptySocialLinksState(): SocialLinksState {
  const links = SOCIAL_LINK_KEYS.reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {} as SocialLinksMap);

  const visibility = SOCIAL_LINK_KEYS.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {} as SocialLinksVisibilityMap);

  return { links, visibility };
}

export function resetSocialLinksState(): SocialLinksState {
  const cleared = getEmptySocialLinksState();
  saveSocialLinksState(cleared);
  return cleared;
}

export function resetSocialLinks(): SocialLinksMap {
  return resetSocialLinksState().links;
}

export function normalizeSocialLinkValue(key: SocialLinkKey, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (key === "whatsapp") {
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    return phoneHref(trimmed, "whatsapp");
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function buildSocialLinkItems(state: SocialLinksState) {
  return SOCIAL_LINK_FIELDS.map((field) => ({
    key: field.key,
    label: field.label,
    icon: field.icon,
    href: normalizeSocialLinkValue(field.key, state.links[field.key]),
  })).filter((item) => state.visibility[item.key] && hasValue(item.href));
}

export function sanitizeSocialLinks(input: Partial<SocialLinksMap>): SocialLinksMap {
  return SOCIAL_LINK_KEYS.reduce((acc, key) => {
    acc[key] = normalizeSocialLinkValue(key, input[key] ?? "");
    return acc;
  }, {} as SocialLinksMap);
}
