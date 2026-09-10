import type { CSSProperties } from "react";
import { HakimiLogoMark } from "@/components/brand/HakimiLogoMark";
import { resolveWordmarkColors } from "@/components/brand/mark.colors";
import type { HakimiLogoProps } from "@/components/brand/types";
import { HAKIMI_BRAND } from "@/config/brand.config";
import { cn } from "@/lib/utils";

export function HakimiLogo({
  layout = "horizontal",
  variant = "duo",
  scheme = "light",
  size = 48,
  compact = false,
  className,
}: HakimiLogoProps) {
  const wordmark = resolveWordmarkColors(variant, scheme);
  const isStacked = layout === "stacked";
  const isSymbol = layout === "symbol-only";
  const primarySize = isStacked ? size * 0.46 : compact ? size * 0.32 : size * 0.56;
  const secondarySize = isStacked ? size * 0.2 : compact ? size * 0.14 : size * 0.22;
  const nameToRuleGap = isStacked ? 4 : compact ? 2 : 2;
  const ruleToLineGap = isStacked ? 5 : compact ? 3 : 3;
  const markGap = isStacked ? size * 0.28 : compact ? size * 0.18 : size * 0.32;

  return (
    <span
      className={cn(
        "inline-flex min-w-0 max-w-full font-sans",
        scheme === "dark" && "dark",
        isStacked ? "flex-col items-center" : "items-center",
        isSymbol && "gap-0",
        className,
      )}
      style={
        {
          "--brand-logo-height": `${size}px`,
          gap: isSymbol ? 0 : markGap,
        } as CSSProperties
      }
      role="img"
      aria-label={HAKIMI_BRAND.ariaLabel}
    >
      <HakimiLogoMark size={size} decorative />

      {isSymbol ? (
        <span className="sr-only">{HAKIMI_BRAND.name}</span>
      ) : (
        <span
          className={cn(
            "flex min-w-0 max-w-full flex-col justify-center",
            isStacked ? "items-center text-center" : "items-stretch",
          )}
          aria-hidden="true"
        >
          <span
            className="whitespace-nowrap font-sans font-semibold uppercase leading-none tracking-[0.02em]"
            style={{ fontSize: primarySize, color: wordmark.primary, marginBottom: nameToRuleGap }}
          >
            {HAKIMI_BRAND.wordmark.primary}
          </span>
          <span
            className="mx-auto block h-[1.5px] rounded-full"
            style={{
              width: compact ? "34%" : isStacked ? "40%" : "38%",
              marginBottom: ruleToLineGap,
              background: `linear-gradient(90deg, transparent 0%, ${wordmark.rule} 22%, ${wordmark.rule} 78%, transparent 100%)`,
            }}
          />
          <span
            className="whitespace-nowrap font-sans font-medium uppercase leading-none tracking-[0.18em]"
            style={{ fontSize: secondarySize, color: wordmark.secondary }}
          >
            {HAKIMI_BRAND.wordmark.secondary}
          </span>
        </span>
      )}
    </span>
  );
}
