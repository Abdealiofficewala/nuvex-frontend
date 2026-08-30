"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/website/common/Icons";
import { TICKET_SERIAL } from "@/lib/constants";
import {
  CONTACT_DETAILS_UPDATED_EVENT,
  getContactDetailsState,
  getDefaultContactDetails,
} from "@/lib/contact-details";
import { formatPhoneParts } from "@/lib/utils/phone";
import { formatAddress, hasValue, initials, phoneHref } from "@/lib/utils";
import type { ContactIconName, ContactInfoRow } from "@/types/content";

type ContactInfoProps = {
  nested?: boolean;
};

export function ContactInfo({ nested }: ContactInfoProps) {
  const info = useTranslations("contact.info");
  const [state, setState] = useState(getDefaultContactDetails);

  useEffect(() => {
    setState(getContactDetailsState());

    const refresh = () => setState(getContactDetailsState());
    window.addEventListener(CONTACT_DETAILS_UPDATED_EVENT, refresh);

    return () => window.removeEventListener(CONTACT_DETAILS_UPDATED_EVENT, refresh);
  }, []);

  const address = formatAddress(state.address);
  const phones = state.phones
    .map((item) => ({
      ...item,
      value: item.value || formatPhoneParts(item.countryCode, item.number),
    }))
    .filter((item) => hasValue(item.value));
  const Wrapper = nested ? "div" : "aside";

  const rows: ContactInfoRow[] = useMemo(
    () => [
      ...phones.map((item) => ({
        key: item.key,
        label: item.key === "whatsapp" ? info("whatsapp") : info("mobile"),
        icon: (item.key === "whatsapp" ? "whatsapp" : "phone") as ContactIconName,
        href: phoneHref(item.value, item.key),
        lines: [item.value],
      })),
      ...(hasValue(state.email)
        ? [
            {
              key: "email",
              label: info("email"),
              icon: "email" as const,
              href: `mailto:${state.email}`,
              lines: [state.email],
            },
          ]
        : []),
      ...(hasValue(address)
        ? [
            {
              key: "address",
              label: info("address"),
              icon: "pin" as const,
              lines: [state.address.street].filter(hasValue),
              muted: [state.address.city, state.address.state, state.address.country]
                .filter(hasValue)
                .join(", "),
            },
          ]
        : []),
    ],
    [address, info, phones, state.address.city, state.address.country, state.address.state, state.address.street, state.email],
  );

  return (
    <Wrapper className={cn("contact-info", nested && "contact-info--nested")}>
      <article className="contact-info__ticket">
        <div className="contact-info__ticket-top" aria-hidden="true" />

        {hasValue(state.person) ? (
          <header className="contact-info__head">
            <span className="contact-info__mark" aria-hidden="true">
              {initials(state.person)}
            </span>
            <div className="contact-info__head-copy">
              <p className={cn("t-caption", "contact-info__eyebrow")}>{info("person")}</p>
              <h2 className="contact-info__name">{state.person}</h2>
              <p className="contact-info__lede">{info("personBody")}</p>
            </div>
            <p className="contact-info__serial" aria-hidden="true">
              {TICKET_SERIAL.desk}
            </p>
          </header>
        ) : (
          <div className={cn("contact-info__head", "contact-info__head--serial-only")}>
            <p className="contact-info__serial" aria-hidden="true">
              {TICKET_SERIAL.desk}
            </p>
          </div>
        )}

        {hasValue(state.person) && rows.length ? <div className="contact-info__tear" aria-hidden="true" /> : null}

        {rows.length ? (
          <ul className="contact-info__rows">
            {rows.map((row) => (
              <li key={row.key} className="contact-info__row">
                <span className="contact-info__icon" aria-hidden="true">
                  <Icon name={row.icon} />
                </span>
                <div className="contact-info__copy">
                  <p className="contact-info__label">{row.label}</p>
                  {row.lines.map((line) =>
                    row.href ? (
                      <a key={line} href={row.href} className="contact-info__value">
                        <span>{line}</span>
                      </a>
                    ) : (
                      <p key={line} className="contact-info__value">
                        {line}
                      </p>
                    ),
                  )}
                  {row.muted ? <p className="contact-info__muted">{row.muted}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    </Wrapper>
  );
}
