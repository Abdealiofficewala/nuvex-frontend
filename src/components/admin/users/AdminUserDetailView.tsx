"use client";

import { useLocale, useTranslations } from "next-intl";
import { AdminUserProfileLayout } from "@/components/admin/common";
import { getAdminUserFullName, getAdminUserPhone, getAdminUserRoleLabel, type AdminUserRecord } from "@/lib/admin-users";
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

type AdminUserDetailViewProps = {
  user: AdminUserRecord;
  backHref?: string;
  backLabel?: string;
  editHref?: string;
  editLabel?: string;
};

export function AdminUserDetailView({
  user,
  backHref,
  backLabel,
  editHref,
  editLabel,
}: AdminUserDetailViewProps) {
  const t = useTranslations("admin.users.profile");
  const tView = useTranslations("admin.users.view");
  const locale = useLocale();

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
      nameHeadingId="admin-user-detail-name"
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
        editAction: editLabel ?? tView("editAction"),
      }}
      editHref={editHref}
      footerBackHref={backHref}
      footerBackLabel={backLabel}
    />
  );
}
