import { siteConfig } from "@/config/site.config";

function readPublicEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  appName: readPublicEnv("NEXT_PUBLIC_APP_NAME", siteConfig.company.name),
  appUrl: readPublicEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  apiUrl: readPublicEnv("NEXT_PUBLIC_API_URL", "http://localhost:5000/api"),
  defaultLocale: readPublicEnv("NEXT_PUBLIC_DEFAULT_LOCALE", siteConfig.languages.default),
  environment: readPublicEnv("NEXT_PUBLIC_ENV", "development"),
} as const;

export const isDevelopment = env.environment === "development";
export const isProduction = env.environment === "production";
