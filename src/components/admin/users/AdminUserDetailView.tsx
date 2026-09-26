"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/buttons";
import { getAdminUserFullName, type AdminUserRecord } from "@/lib/admin-users";
import { formatPhoneParts } from "@/lib/utils/phone";
import { cn, hasValue } from "@/lib/utils";

function displayValue(value?: string) {
  return value?.trim() ? value.trim() : "—";
}

type AdminUserDetailViewProps = {
  user: AdminUserRecord;
  backHref?: string;
  backLabel?: string;
};

export function AdminUserDetailView({ user, backHref, backLabel }: AdminUserDetailViewProps) {
  const t = useTranslations("admin.users.details");
  const fullName = getAdminUserFullName(user) || t("fallbackName");
  const phone = formatPhoneParts(user.phoneCountryCode, user.phoneNumber);
  const roleLabel = t(`roles.${user.role}`);

  return (
    <section className="admin-role-view admin-user-view">
      <div className="admin-panel admin-role-view__panel">
        <div className="admin-member-view__hero admin-user-view__hero">
          <span className="admin-member-view__avatar admin-user-view__avatar" aria-hidden="true">
            {hasValue(user.image) ? (
              user.image.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="admin-member-view__native-image" />
              ) : (
                <Image src={user.image} alt="" fill sizes="96px" />
              )
            ) : null}
          </span>

          <div className="admin-member-view__intro admin-user-view__intro">
            <h2 className="admin-member-view__name">{fullName}</h2>
            <p className="admin-member-view__role">{displayValue(user.designation)}</p>
            <div className="admin-user-view__meta">
              <span className={cn("admin-table-badge", user.active ? "is-visible" : "is-hidden")}>
                {user.active ? t("status.active") : t("status.inactive")}
              </span>
              <span className={cn("admin-table-role", `admin-table-role--${user.role}`)}>
                <span className="admin-table-role__dot" aria-hidden="true" />
                <span className="admin-table-role__text">{roleLabel}</span>
              </span>
            </div>
          </div>
        </div>

        <dl className="admin-role-view__grid admin-user-view__grid">
          <div className="admin-role-view__item">
            <dt>{t("fields.firstName")}</dt>
            <dd>{displayValue(user.firstName)}</dd>
          </div>
          <div className="admin-role-view__item">
            <dt>{t("fields.lastName")}</dt>
            <dd>{displayValue(user.lastName)}</dd>
          </div>
          <div className="admin-role-view__item">
            <dt>{t("fields.email")}</dt>
            <dd>{displayValue(user.email)}</dd>
          </div>
          <div className="admin-role-view__item">
            <dt>{t("fields.phone")}</dt>
            <dd>{displayValue(phone)}</dd>
          </div>
          <div className="admin-role-view__item">
            <dt>{t("fields.designation")}</dt>
            <dd>{displayValue(user.designation)}</dd>
          </div>
          <div className="admin-role-view__item">
            <dt>{t("fields.role")}</dt>
            <dd>
              <span className={cn("admin-table-role", `admin-table-role--${user.role}`)}>
                <span className="admin-table-role__dot" aria-hidden="true" />
                <span className="admin-table-role__text">{roleLabel}</span>
              </span>
            </dd>
          </div>
        </dl>

        <div className="admin-user-view__section">
          <h3 className="admin-user-view__section-title">{t("address.title")}</h3>
          <dl className="admin-role-view__grid admin-user-view__grid admin-user-view__address-grid">
            <div className="admin-role-view__item admin-role-view__item--wide">
              <dt>{t("fields.addressLine1")}</dt>
              <dd>{displayValue(user.addressLine1)}</dd>
            </div>
            {user.addressLine2?.trim() ? (
              <div className="admin-role-view__item admin-role-view__item--wide">
                <dt>{t("fields.addressLine2")}</dt>
                <dd>{user.addressLine2.trim()}</dd>
              </div>
            ) : null}
            <div className="admin-role-view__item">
              <dt>{t("fields.village")}</dt>
              <dd>{displayValue(user.village)}</dd>
            </div>
            <div className="admin-role-view__item">
              <dt>{t("fields.city")}</dt>
              <dd>{displayValue(user.city)}</dd>
            </div>
            <div className="admin-role-view__item">
              <dt>{t("fields.pincode")}</dt>
              <dd>{displayValue(user.pincode)}</dd>
            </div>
            <div className="admin-role-view__item">
              <dt>{t("fields.state")}</dt>
              <dd>{displayValue(user.state)}</dd>
            </div>
          </dl>
        </div>

        {backHref ? (
          <div className="admin-page-actions admin-page-actions--form">
            <ButtonLink
              href={backHref}
              variant="secondary"
              className="admin-page-actions__btn admin-page-actions__btn--reset"
            >
              {backLabel}
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
