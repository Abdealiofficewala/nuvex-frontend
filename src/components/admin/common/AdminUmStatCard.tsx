"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AdminUmStatTone = "total" | "active" | "inactive" | "assigned";

function AdminUmStatIcon({ tone }: { tone: AdminUmStatTone }) {
  if (tone === "active") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M8.2 12.2 10.8 14.8 16 9.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (tone === "inactive") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (tone === "assigned") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.5" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M4.5 18.5c.8-2.6 2.8-4 4.5-4s3.7 1.4 4.5 4M13 17.5c.5-1.6 1.6-2.5 3-2.5s2.5.9 3 2.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="4" y="5" width="16" height="14" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function AdminUmStatCard({
  tone,
  label,
  value,
  meta,
}: {
  tone: AdminUmStatTone;
  label: string;
  value: number;
  meta?: string;
}) {
  return (
    <article className={cn("admin-um-stat-card", `admin-um-stat-card--${tone}`)}>
      <span className="admin-um-stat-card__icon" aria-hidden="true">
        <AdminUmStatIcon tone={tone} />
      </span>
      <div className="admin-um-stat-card__body">
        <p className="admin-um-stat-card__label">{label}</p>
        <p className="admin-um-stat-card__value">{value}</p>
        {meta ? <p className="admin-um-stat-card__meta">{meta}</p> : null}
      </div>
    </article>
  );
}

export function AdminUmStatsGrid({ children }: { children: ReactNode }) {
  return <div className="admin-um-stats admin-um-stats--roles">{children}</div>;
}
