"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/buttons";
import type { AdminUserRecord } from "@/lib/admin-users";
import { capitalizeFieldText, cn, hasValue, initials } from "@/lib/utils";

function displayValue(value?: string, format: "text" | "literal" = "text") {
  const raw = value?.trim() ? value.trim() : "—";
  if (raw === "—" || format === "literal") {
    return raw;
  }

  return capitalizeFieldText(raw);
}

function displayLabel(label: string) {
  return capitalizeFieldText(label);
}

function ProfileIcon({ children }: { children: ReactNode }) {
  return (
    <span className="admin-um-profile__metric-icon" aria-hidden="true">
      {children}
    </span>
  );
}

function ProfileMetric({
  icon,
  emoji,
  label,
  value,
  tone = "neutral",
}: {
  icon: ReactNode;
  emoji?: string;
  label: string;
  value: string;
  tone?: "user" | "time" | "calendar" | "neutral";
}) {
  return (
    <article className={cn("admin-um-profile__metric", `admin-um-profile__metric--${tone}`)}>
      <ProfileIcon>{icon}</ProfileIcon>
      <div className="admin-um-profile__metric-copy">
        <p className="admin-um-profile__metric-label">
          {emoji ? (
            <span className="admin-um-profile__metric-emoji" aria-hidden="true">{emoji}</span>
          ) : null}
          {displayLabel(label)}
        </p>
        <p className="admin-um-profile__metric-value">{value}</p>
      </div>
    </article>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  const isEmpty = value === "—";

  return (
    <div className={cn("admin-um-profile__row", isEmpty && "is-empty")}>
      <span className="admin-um-profile__row-label">{displayLabel(label)}</span>
      <span className="admin-um-profile__row-value">{value}</span>
    </div>
  );
}

function ProfileSection({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-um-profile__section">
      <header className="admin-um-profile__section-head">
        <span className="admin-um-profile__section-emoji" aria-hidden="true">{emoji}</span>
        <span className="admin-um-profile__section-mark" aria-hidden="true" />
        <h3 className="admin-um-profile__section-title">{displayLabel(title)}</h3>
      </header>
      <div className="admin-um-profile__rows">{children}</div>
    </section>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.25" r="3.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 19.5c.9-3.1 3.2-5 6.5-5s5.6 1.9 6.5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v4.2l2.6 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M7 5v2M17 5v2M4.5 9.5h15M6 7h12a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 18 20H6a1.5 1.5 0 0 1-1.5-1.5v-10A1.5 1.5 0 0 1 6 7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20h4l10.5-10.5a1.8 1.8 0 0 0 0-2.55l-1.2-1.2a1.8 1.8 0 0 0-2.55 0L4 16v4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5 17.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export type AdminUserProfileLayoutProps = {
  user: AdminUserRecord;
  fullName: string;
  phone: string;
  roleLabel: string;
  lastLogin: string;
  memberSince: string;
  nameHeadingId?: string;
  labels: {
    username: string;
    lastLogin: string;
    memberSince: string;
    activitySection: string;
    personalSection: string;
    addressSection: string;
    firstName: string;
    lastName: string;
    phone: string;
    pincode: string;
    addressLine1: string;
    addressLine2: string;
    village: string;
    city: string;
    state: string;
    active: string;
    inactive: string;
    editAction: string;
  };
  editHref?: string;
  footerBackHref?: string;
  footerBackLabel?: string;
};

export function AdminUserProfileLayout({
  user,
  fullName,
  phone,
  roleLabel,
  lastLogin,
  memberSince,
  nameHeadingId = "admin-user-profile-name",
  labels,
  editHref,
  footerBackHref,
  footerBackLabel,
}: AdminUserProfileLayoutProps) {
  return (
    <section className="admin-um-profile" aria-labelledby={nameHeadingId}>
      <div className="admin-um-profile__card admin-um-profile__card--split">
        <aside className="admin-um-profile__aside">
          <div className="admin-um-profile__aside-mesh" aria-hidden="true" />
          <div className="admin-um-profile__aside-glow" aria-hidden="true" />
          <span
            className={cn(
              "admin-um-profile__avatar-wrap",
              user.active && "admin-um-profile__avatar-wrap--online",
            )}
            aria-hidden="true"
          >
            <span className="admin-um-profile__avatar">
              {hasValue(user.image) ? (
                user.image.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="" className="admin-member-view__native-image" />
                ) : (
                  <Image src={user.image} alt="" fill sizes="128px" />
                )
              ) : (
                <span className="admin-um-profile__avatar-fallback">{initials(fullName)}</span>
              )}
            </span>
          </span>

          <h2 id={nameHeadingId} className="admin-um-profile__name">{fullName}</h2>
          <p className="admin-um-profile__designation">{displayValue(user.designation)}</p>
          <p className="admin-um-profile__aside-email">{user.email}</p>

          <div className="admin-um-profile__chips">
            <span
              className={cn(
                "admin-member-view__status",
                user.active ? "is-visible" : "is-hidden",
              )}
            >
              <span className="admin-member-view__status-dot" aria-hidden="true" />
              {user.active
                ? `✅ ${displayLabel(labels.active)}`
                : `⏸️ ${displayLabel(labels.inactive)}`}
            </span>
            <span className={cn("admin-table-role", `admin-table-role--${user.role}`)}>
              <span className="admin-table-role__dot" aria-hidden="true" />
              <span className="admin-table-role__text">{capitalizeFieldText(roleLabel)}</span>
            </span>
          </div>

          {editHref ? (
            <ButtonLink
              href={editHref}
              variant="accent"
              className="admin-um-profile__edit-btn"
            >
              <EditIcon />
              {labels.editAction}
            </ButtonLink>
          ) : null}
        </aside>

        <div className="admin-um-profile__main">
          <header className="admin-um-profile__main-head">
            <span className="admin-um-profile__main-head-mark" aria-hidden="true" />
            <h3 className="admin-um-profile__main-head-title">
              <span className="admin-um-profile__main-head-emoji" aria-hidden="true">📊</span>
              {displayLabel(labels.activitySection)}
            </h3>
          </header>

          <div className="admin-um-profile__metrics">
            <ProfileMetric
              tone="user"
              emoji="🪪"
              icon={<UserIcon />}
              label={labels.username}
              value={displayValue(user.username)}
            />
            <ProfileMetric
              tone="time"
              emoji="⏱️"
              icon={<ClockIcon />}
              label={labels.lastLogin}
              value={capitalizeFieldText(lastLogin)}
            />
            <ProfileMetric
              tone="calendar"
              emoji="🗓️"
              icon={<CalendarIcon />}
              label={labels.memberSince}
              value={capitalizeFieldText(memberSince)}
            />
          </div>

          <div className="admin-um-profile__details">
            <ProfileSection emoji="👤" title={labels.personalSection}>
              <ProfileRow label={labels.firstName} value={displayValue(user.firstName)} />
              <ProfileRow label={labels.lastName} value={displayValue(user.lastName)} />
              <ProfileRow label={labels.username} value={displayValue(user.username)} />
              <ProfileRow label={labels.phone} value={displayValue(phone, "literal")} />
            </ProfileSection>

            <ProfileSection emoji="📍" title={labels.addressSection}>
              <ProfileRow label={labels.addressLine1} value={displayValue(user.addressLine1)} />
              {user.addressLine2?.trim() ? (
                <ProfileRow
                  label={labels.addressLine2}
                  value={displayValue(user.addressLine2)}
                />
              ) : null}
              <ProfileRow label={labels.village} value={displayValue(user.village)} />
              <ProfileRow label={labels.city} value={displayValue(user.city)} />
              <ProfileRow label={labels.pincode} value={displayValue(user.pincode, "literal")} />
              <ProfileRow label={labels.state} value={displayValue(user.state)} />
            </ProfileSection>
          </div>
        </div>
      </div>

      {footerBackHref && footerBackLabel ? (
        <footer className="admin-um-form__footer">
          <ButtonLink href={footerBackHref} variant="secondary">
            {footerBackLabel}
          </ButtonLink>
        </footer>
      ) : null}
    </section>
  );
}
