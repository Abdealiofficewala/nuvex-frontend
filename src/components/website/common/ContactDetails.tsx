"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CONTACT_DETAILS_UPDATED_EVENT,
  getDefaultContactDetails,
  getWebsiteContactDetailsState,
} from "@/lib/contact-details";
import { formatPhoneParts } from "@/lib/utils/phone";
import { formatAddress, hasValue, phoneHref } from "@/lib/utils";

type ContactDetailsProps = {
  className?: string;
  showAddress?: boolean;
  showPerson?: boolean;
};

export function ContactDetails({
  className,
  showAddress = false,
  showPerson = false,
}: ContactDetailsProps) {
  const empty = useTranslations("common");
  const [state, setState] = useState(getDefaultContactDetails);

  useEffect(() => {
    setState(getWebsiteContactDetailsState());

    const refresh = () => setState(getWebsiteContactDetailsState());
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
  const uniquePhones = phones.filter(
    (item, index, arr) => arr.findIndex((entry) => entry.value === item.value) === index,
  );

  return (
    <div className={className}>
      {showPerson && hasValue(state.person) ? <p>{state.person}</p> : null}
      {hasValue(state.email) ? (
        <p>
          <a href={`mailto:${state.email}`}>{state.email}</a>
        </p>
      ) : (
        <p className="t-muted">{empty("empty.contact")}</p>
      )}
      {uniquePhones.length ? (
        uniquePhones.map((item) => (
          <p key={item.key}>
            <a href={phoneHref(item.value, item.key)}>{item.value}</a>
          </p>
        ))
      ) : hasValue(state.phone) ? (
        <p>
          <a href={phoneHref(state.phone)}>{state.phone}</a>
        </p>
      ) : null}
      {showAddress && hasValue(address) ? <p className="footer__muted mt-3">{address}</p> : null}
    </div>
  );
}
