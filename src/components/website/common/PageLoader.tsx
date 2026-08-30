import Image from "next/image";
import { BrandLogo } from "@/components/website/common/BrandLogo";
import { LOADER_MEDIA } from "@/lib/loader.config";
import { cn } from "@/lib/utils";

type PageLoaderProps = {
  variant?: "page" | "catalog" | "admin";
};

function LoaderBeam() {
  return <div className="page-loader__beam" aria-hidden="true" />;
}

function LoaderRing() {
  return <span className="page-loader__ring" />;
}

function LoaderBrandHero({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("page-loader__brand", compact && "page-loader__brand--compact")}>
      <Image
        src={LOADER_MEDIA.websiteBanner}
        alt=""
        fill
        sizes={compact ? "720px" : "1200px"}
        className="page-loader__brand-image"
        priority
      />
      <span className="page-loader__brand-overlay" aria-hidden="true" />
      <div className="page-loader__brand-content">
        <BrandLogo variant="light" height={compact ? 28 : 34} className="page-loader__brand-logo" />
        <div className="page-loader__status" aria-hidden="true">
          <LoaderRing />
        </div>
      </div>
    </div>
  );
}

export function PageLoader({ variant = "page" }: PageLoaderProps) {
  if (variant === "admin") {
    return (
      <div className={cn("page-loader", "page-loader--admin")} aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading</span>
        <LoaderBeam />
        <LoaderBrandHero compact />
        <div className={cn("skel", "skel--line")} />
        <div className={cn("skel", "skel--panel")} />
      </div>
    );
  }

  if (variant === "catalog") {
    return (
      <div className={cn("container", "page-pad", "page-loader", "page-loader--catalog")} aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading</span>
        <LoaderBeam />
        <LoaderBrandHero compact />
        <div className={cn("skel", "skel--lede")} />
        <div className={cn("skel", "skel--chips")} />
        <div className="page-loader__grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className={cn("skel", "skel--card")}
              style={{ animationDelay: `${index * 80}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("container", "page-pad", "page-loader", "page-loader--default")} aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <LoaderBeam />
      <LoaderBrandHero />
      <div className="page-loader__intro">
        <div className="page-loader__intro-copy">
          <div className={cn("skel", "skel--title")} />
          <div className={cn("skel", "skel--lede")} />
        </div>
      </div>
      <div className="page-loader__rows">
        <div className={cn("skel", "skel--block")} />
        <div className={cn("skel", "skel--block")} />
      </div>
    </div>
  );
}
