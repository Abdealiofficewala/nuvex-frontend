import { ADMIN_SITE_TOP_BAR_STORE_KEY } from "@/lib/constants";
import {
  SITE_TOP_BAR_CONTACT_FIELDS,
  SITE_TOP_BAR_MESSAGE_LIMIT,
  SITE_TOP_BAR_MESSAGE_MAX_LENGTH,
  type SiteTopBarContactField,
  type SiteTopBarState,
} from "@/lib/site-top-bar.config";

export const SITE_TOP_BAR_UPDATED_EVENT = "hakimi:site-top-bar-updated";

export type SiteTopBarDetailItem = {
  key: SiteTopBarContactField;
  label: string;
  value: string;
  href?: string;
};

export type SiteTopBarDisplay = {
  visible: boolean;
  detailItems: SiteTopBarDetailItem[];
  messages: string[];
};

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

function normalizeMessages(messages: unknown): string[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, SITE_TOP_BAR_MESSAGE_LIMIT)
    .map((item) => item.slice(0, SITE_TOP_BAR_MESSAGE_MAX_LENGTH));
}

function readBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function migrateLegacyState(raw: Record<string, unknown>): Partial<SiteTopBarState> {
  const legacyEnabled = raw.enabled;
  const legacyVisible = raw.visible;
  const legacyDetails = raw.details;
  const detailsRecord =
    legacyDetails && typeof legacyDetails === "object"
      ? (legacyDetails as Record<string, unknown>)
      : undefined;

  return {
    visible:
      typeof legacyVisible === "boolean"
        ? legacyVisible
        : typeof legacyEnabled === "boolean"
          ? legacyEnabled
          : undefined,
    showPhone:
      typeof raw.showPhone === "boolean"
        ? raw.showPhone
        : detailsRecord && typeof detailsRecord.phone === "boolean"
          ? detailsRecord.phone
          : undefined,
    showEmail:
      typeof raw.showEmail === "boolean"
        ? raw.showEmail
        : detailsRecord && typeof detailsRecord.email === "boolean"
          ? detailsRecord.email
          : undefined,
    showLocation:
      typeof raw.showLocation === "boolean"
        ? raw.showLocation
        : detailsRecord && typeof detailsRecord.location === "boolean"
          ? detailsRecord.location
          : undefined,
    showMessages:
      typeof raw.showMessages === "boolean"
        ? raw.showMessages
        : typeof raw.showDetails === "boolean"
          ? raw.showDetails
          : undefined,
  };
}

function sanitizeState(
  input: Partial<SiteTopBarState> | Record<string, unknown> | null | undefined,
  defaults = getEmptySiteTopBarState(),
): SiteTopBarState {
  const record = (input ?? {}) as Record<string, unknown>;
  const legacy = migrateLegacyState(record);
  const merged = { ...record, ...legacy } as Partial<SiteTopBarState>;

  return {
    visible: readBoolean(merged.visible, defaults.visible),
    phone: readText(merged.phone),
    email: readText(merged.email),
    location: readText(merged.location),
    showPhone: readBoolean(merged.showPhone, defaults.showPhone),
    showEmail: readBoolean(merged.showEmail, defaults.showEmail),
    showLocation: readBoolean(merged.showLocation, defaults.showLocation),
    showMessages: readBoolean(merged.showMessages, defaults.showMessages),
    messages: normalizeMessages(merged.messages),
  };
}

export function getEmptySiteTopBarState(): SiteTopBarState {
  return {
    visible: true,
    phone: "",
    email: "",
    location: "",
    showPhone: true,
    showEmail: true,
    showLocation: true,
    showMessages: true,
    messages: [],
  };
}

function readStoredSiteTopBarRaw(): unknown | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const raw = window.sessionStorage.getItem(ADMIN_SITE_TOP_BAR_STORE_KEY);
    if (raw === null) {
      return undefined;
    }

    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
}

export function getSiteTopBarState(): SiteTopBarState {
  const stored = readStoredSiteTopBarRaw();
  if (stored === undefined) {
    return getEmptySiteTopBarState();
  }

  return sanitizeState(stored as Partial<SiteTopBarState>);
}

export function getWebsiteSiteTopBarState(): SiteTopBarState {
  const stored = readStoredSiteTopBarRaw();
  if (stored === undefined) {
    return getEmptySiteTopBarState();
  }

  return sanitizeState(stored as Partial<SiteTopBarState>);
}

export function saveSiteTopBarState(state: SiteTopBarState) {
  const nextState = sanitizeState(state);
  writeJson(ADMIN_SITE_TOP_BAR_STORE_KEY, nextState);
  window.dispatchEvent(new CustomEvent(SITE_TOP_BAR_UPDATED_EVENT));
}

export function resetSiteTopBarState(): SiteTopBarState {
  const cleared = getEmptySiteTopBarState();
  saveSiteTopBarState(cleared);
  return cleared;
}

export function buildSiteTopBarDetailItems(
  config: SiteTopBarState,
  labels: Record<SiteTopBarContactField, string>,
): SiteTopBarDetailItem[] {
  const items: SiteTopBarDetailItem[] = [];

  if (config.showPhone && config.phone) {
    items.push({
      key: "phone",
      label: labels.phone,
      value: config.phone,
      href: `tel:${config.phone.replace(/\s+/g, "")}`,
    });
  }

  if (config.showEmail && config.email) {
    items.push({
      key: "email",
      label: labels.email,
      value: config.email,
      href: `mailto:${config.email}`,
    });
  }

  if (config.showLocation && config.location) {
    items.push({
      key: "location",
      label: labels.location,
      value: config.location,
    });
  }

  return items;
}

export function resolveSiteTopBarDisplay(
  config: SiteTopBarState,
  detailLabels: Record<SiteTopBarContactField, string>,
): SiteTopBarDisplay {
  const detailItems = config.visible ? buildSiteTopBarDetailItems(config, detailLabels) : [];
  const messages = config.visible && config.showMessages ? config.messages : [];
  const hasContent = detailItems.length > 0 || messages.length > 0;

  return {
    visible: config.visible && hasContent,
    detailItems,
    messages,
  };
}

export function touchAllSiteTopBarFields(): Partial<Record<SiteTopBarContactField | "messages", boolean>> {
  return SITE_TOP_BAR_CONTACT_FIELDS.reduce(
    (acc, field) => {
      acc[field] = true;
      return acc;
    },
    { messages: true } as Partial<Record<SiteTopBarContactField | "messages", boolean>>,
  );
}
