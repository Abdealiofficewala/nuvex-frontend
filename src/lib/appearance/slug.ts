const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlug(value: string): boolean {
  return Boolean(value) && SLUG_PATTERN.test(value);
}

export function uniqueSlug(base: string, existing: readonly string[]): string {
  const normalized = normalizeSlug(base) || "item";
  if (!existing.includes(normalized)) {
    return normalized;
  }

  let index = 2;
  while (existing.includes(`${normalized}-${index}`)) {
    index += 1;
  }

  return `${normalized}-${index}`;
}
