import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function apiImagePattern() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

  try {
    const url = new URL(apiUrl);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/**" as const,
    };
  } catch {
    return {
      protocol: "http" as const,
      hostname: "localhost",
      port: "5000",
      pathname: "/**" as const,
    };
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 75, 90],
    remotePatterns: [apiImagePattern()],
  },
  async redirects() {
    return [
      { source: "/quote", destination: "/request-quote", permanent: false },
      { source: "/:locale/quote", destination: "/:locale/request-quote", permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
