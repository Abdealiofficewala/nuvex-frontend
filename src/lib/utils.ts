export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value: string, locale = "en"): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function hasValue(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

export function initials(name?: string | null): string {
  if (!name?.trim()) {
    return "";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatAddress(address?: {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
} | null): string {
  return [
    address?.street,
    address?.city,
    address?.state,
    address?.country,
    address?.postalCode,
  ]
    .filter(hasValue)
    .join(", ");
}

export function phoneHref(value?: string, type?: string): string {
  const digits = value?.replace(/[^\d+]/g, "") ?? "";
  if (!digits) {
    return "#";
  }

  if (type === "whatsapp") {
    return `https://wa.me/${digits.replace("+", "")}`;
  }

  return `tel:${digits}`;
}

export function resolveMediaUrl(src?: string | null): string | undefined {
  const value = src?.trim();
  if (!value) {
    return undefined;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("/images/") ||
    value.startsWith("/logos/")
  ) {
    return value;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
  const origin = apiUrl.replace(/\/api\/?$/, "");
  return value.startsWith("/") ? `${origin}${value}` : `${origin}/${value}`;
}
