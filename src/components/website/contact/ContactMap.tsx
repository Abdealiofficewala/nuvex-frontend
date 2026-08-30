"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/button/class-names";
import {
  CONTACT_DETAILS_UPDATED_EVENT,
  getContactDetailsState,
  getDefaultContactDetails,
} from "@/lib/contact-details";
import { formatAddress, hasValue } from "@/lib/utils";

export function ContactMap() {
  const t = useTranslations("contact.map");
  const [state, setState] = useState(getDefaultContactDetails);

  useEffect(() => {
    setState(getContactDetailsState());

    const refresh = () => setState(getContactDetailsState());
    window.addEventListener(CONTACT_DETAILS_UPDATED_EVENT, refresh);

    return () => window.removeEventListener(CONTACT_DETAILS_UPDATED_EVENT, refresh);
  }, []);

  const query = state.mapQuery || formatAddress(state.address);
  const address = formatAddress(state.address);

  if (!hasValue(query)) {
    return null;
  }

  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <section className="contact-map">
      <div className="container">
        <div className="contact-map__frame">
          <div className="contact-map__canvas">
            <iframe
              title={t("title")}
              src={embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span className="contact-map__pin" aria-hidden="true" />
            <div className="contact-map__veil" aria-hidden="true" />
          </div>
          <aside className="contact-map__card">
            <div className="contact-map__card-head">
              <p className={cn("t-caption", "contact-map__eyebrow")}>{t("title")}</p>
              <span className="contact-map__chip">{state.address.city || "HQ"}</span>
            </div>
            <h2 className="contact-map__street">{state.address.street}</h2>
            <p className="contact-map__locale">
              {[state.address.city, state.address.state, state.address.country].filter(hasValue).join(", ")}
            </p>
            {hasValue(address) ? (
              <a
                className={cn(buttonClassName("accent", { arrow: true }), "contact-map__cta")}
                href={directionsHref}
                target="_blank"
                rel="noreferrer"
              >
                {t("directions")}
              </a>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
