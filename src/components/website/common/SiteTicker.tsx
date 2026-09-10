import { getTranslations } from "next-intl/server";
import { parseStringArray } from "@/lib/i18n-messages";

export async function SiteTicker() {
  const t = await getTranslations("common");
  const lines = parseStringArray(t.raw("ticker"));

  if (!lines.length) {
    return null;
  }

  return (
    <div className="site-ticker" aria-hidden="true">
      <div className="site-ticker__track">
        {[0, 1].map((copy) => (
          <div key={copy} className="site-ticker__group">
            {lines.map((line) => (
              <span key={`${copy}-${line}`} className="site-ticker__item">
                {line}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
