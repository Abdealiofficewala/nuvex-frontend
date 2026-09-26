"use client";

import { cn } from "@/lib/utils";
import type { CompanyProfileState } from "@/lib/company-profile.config";
import {
  buildCompanyProfileFacts,
  getCompanyProfileTicketSerial,
  type CompanyProfileFactLabels,
} from "@/lib/company-profile";
import "./company-facts-ticket.css";

type CompanyFactsTicketProps = {
  profile: CompanyProfileState;
  factLabels: CompanyProfileFactLabels;
  className?: string;
};

export function CompanyFactsTicket({ profile, factLabels, className }: CompanyFactsTicketProps) {
  const facts = buildCompanyProfileFacts(profile, factLabels);

  return (
    <article className={cn("about-facts__ticket", className)}>
      <header className="about-facts__head">
        <div className="about-facts__head-copy">
          <p className={cn("t-caption", "about-facts__eyebrow")}>{factLabels.eyebrow}</p>
          <h3 className={cn("t-h3", "about-facts__title")}>{factLabels.title}</h3>
        </div>
        <p className="about-facts__serial" aria-hidden="true">
          {getCompanyProfileTicketSerial(profile)}
        </p>
      </header>

      <div className="about-facts__tear" aria-hidden="true" />

      <dl className="about-facts__grid">
        {facts.map((item, index) => (
          <div key={item.label} className="about-facts__row">
            <dt>
              <span className="about-facts__line" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </dt>
            <dd>{item.href ? <a href={item.href}>{item.value}</a> : item.value}</dd>
          </div>
        ))}
      </dl>

      <footer className="about-facts__foot" aria-hidden="true">
        <span className="about-facts__barcode" />
        <span className="about-facts__foot-note">{profile.shortName}</span>
      </footer>
    </article>
  );
}
