"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AdminUserProfileLayout } from "@/components/admin/common";
import { ROUTES } from "@/lib/constants";
import {
  ensureAdminUserForEmail,
  getAdminUserFullName,
  getAdminUserPhone,
  getAdminUserRoleLabel,
  type AdminUserRecord,
} from "@/lib/admin-users";
import { getAdminUserEmail } from "@/lib/admin-session";
import { capitalizeFieldText } from "@/lib/utils";

function formatProfileDate(value: string | undefined, locale: string, fallback: string) {
  if (!value?.trim()) {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatMemberSince(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(locale, { dateStyle: "long" });
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7.5 12 12.5 20 7.5M5.5 18h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 18.5 6h-13A1.5 1.5 0 0 0 4 7.5v9A1.5 1.5 0 0 0 5.5 18Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserProfileView() {
  const t = useTranslations("admin.users.profile");
  const locale = useLocale();
  const [user, setUser] = useState<AdminUserRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const email = getAdminUserEmail();
    if (!email) {
      setLoaded(true);
      return;
    }

    setUser(ensureAdminUserForEmail(email) ?? null);
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="admin-um-profile admin-um-profile--loading" aria-busy="true" aria-live="polite">
        <div
          className="admin-um-profile__card admin-um-profile__card--split admin-um-profile__card--skeleton"
          aria-hidden="true"
        >
          <div className="admin-um-profile__skel-aside" />
          <div className="admin-um-profile__skel-main" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-um-profile admin-um-profile--empty">
        <div className="admin-um-profile__empty-card admin-panel">
          <span className="admin-um-profile__empty-icon" aria-hidden="true">
            <MailIcon />
          </span>
          <p className="admin-um-profile__empty-title">{t("notFound.title")}</p>
          <p className="admin-um-profile__empty-body">{t("notFound.body")}</p>
        </div>
      </div>
    );
  }

  const fullNameRaw = getAdminUserFullName(user) || user.email;
  const fullName = fullNameRaw.includes("@") ? fullNameRaw : capitalizeFieldText(fullNameRaw);

  return (
    <AdminUserProfileLayout
      user={user}
      fullName={fullName}
      phone={getAdminUserPhone(user)}
      roleLabel={getAdminUserRoleLabel(user)}
      lastLogin={formatProfileDate(user.lastLoginAt, locale, t("fields.lastLoginNever"))}
      memberSince={formatMemberSince(user.createdAt, locale)}
      nameHeadingId="admin-profile-name"
      labels={{
        username: t("fields.username"),
        lastLogin: t("fields.lastLogin"),
        memberSince: t("fields.memberSince"),
        activitySection: t("sections.activity"),
        personalSection: t("sections.personal"),
        addressSection: t("sections.address"),
        firstName: t("fields.firstName"),
        lastName: t("fields.lastName"),
        phone: t("fields.phone"),
        pincode: t("fields.pincode"),
        addressLine1: t("fields.addressLine1"),
        addressLine2: t("fields.addressLine2"),
        village: t("fields.village"),
        city: t("fields.city"),
        state: t("fields.state"),
        active: t("status.active"),
        inactive: t("status.inactive"),
        editAction: t("editAction"),
      }}
      editHref={ROUTES.admin.users.profileEdit}
    />
  );
}
