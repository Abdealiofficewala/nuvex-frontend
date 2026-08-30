export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getUrlHostname(value: string): string | null {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function matchesHostnamePatterns(hostname: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(hostname));
}

export function matchesUrlHostname(value: string, patterns: RegExp[]): boolean {
  const hostname = getUrlHostname(value);
  if (!hostname) {
    return false;
  }

  return matchesHostnamePatterns(hostname, patterns);
}
