"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/buttons";
import { cn, hasValue } from "@/lib/utils";

type AdminResourceViewEmptyProps = {
  title: string;
  body: string;
  backHref: string;
  backLabel: string;
};

export function AdminResourceViewEmpty({
  title,
  body,
  backHref,
  backLabel,
}: AdminResourceViewEmptyProps) {
  return (
    <div className="admin-role-view admin-role-view--empty">
      <p className="admin-role-view__empty-title">{title}</p>
      <p className="admin-role-view__empty-body">{body}</p>
      <ButtonLink href={backHref} variant="secondary">
        {backLabel}
      </ButtonLink>
    </div>
  );
}

type AdminResourceViewShellProps = {
  className?: string;
  children: ReactNode;
};

export function AdminResourceViewShell({ className, children }: AdminResourceViewShellProps) {
  return (
    <section className={cn("admin-role-view admin-resource-view", className)}>
      <div className="admin-panel admin-role-view__panel">{children}</div>
    </section>
  );
}

type AdminResourceViewPreviewVariant = "square" | "banner";

type AdminResourceViewHeroProps = {
  imageSrc?: string;
  previewVariant?: AdminResourceViewPreviewVariant;
  emptyImageLabel?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badges?: ReactNode;
};

export function AdminResourceViewHero({
  imageSrc,
  previewVariant = "square",
  emptyImageLabel = "No image uploaded",
  eyebrow,
  title,
  subtitle,
  badges,
}: AdminResourceViewHeroProps) {
  const previewImage = hasValue(imageSrc) ? imageSrc : null;

  return (
    <div className="admin-resource-view__hero">
      <div
        className={cn(
          "admin-resource-view__preview",
          previewVariant === "banner" && "admin-resource-view__preview--banner",
        )}
      >
        {previewImage ? (
          previewImage.startsWith("data:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewImage} alt="" className="admin-resource-view__preview-image" />
          ) : (
            <Image
              src={previewImage}
              alt=""
              fill
              sizes={previewVariant === "banner" ? "280px" : "96px"}
              unoptimized
              className="admin-resource-view__preview-image"
            />
          )
        ) : (
          <span className="admin-resource-view__preview-empty">{emptyImageLabel}</span>
        )}
      </div>

      <div className="admin-resource-view__intro">
        {hasValue(eyebrow) ? <p className="admin-resource-view__eyebrow">{eyebrow}</p> : null}
        <h2 className="admin-resource-view__title">{title}</h2>
        {hasValue(subtitle) ? <p className="admin-resource-view__subtitle">{subtitle}</p> : null}
        {badges ? <div className="admin-resource-view__badges">{badges}</div> : null}
      </div>
    </div>
  );
}

type AdminResourceViewGridProps = {
  className?: string;
  children: ReactNode;
};

export function AdminResourceViewGrid({ className, children }: AdminResourceViewGridProps) {
  return (
    <dl className={cn("admin-role-view__grid admin-resource-view__grid", className)}>{children}</dl>
  );
}

type AdminResourceViewFieldProps = {
  label: string;
  wide?: boolean;
  className?: string;
  valueClassName?: string;
  children: ReactNode;
};

export function AdminResourceViewField({
  label,
  wide = false,
  className,
  valueClassName,
  children,
}: AdminResourceViewFieldProps) {
  return (
    <div
      className={cn(
        "admin-role-view__item",
        wide && "admin-role-view__item--wide",
        className,
      )}
    >
      <dt>{label}</dt>
      <dd className={valueClassName}>{children}</dd>
    </div>
  );
}

type AdminResourceViewTagsProps = {
  items: string[];
};

export function AdminResourceViewTags({ items }: AdminResourceViewTagsProps) {
  if (!items.length) {
    return <>—</>;
  }

  return (
    <ul className="admin-resource-view__tags">
      {items.map((item) => (
        <li key={item} className="admin-resource-view__tag">
          {item}
        </li>
      ))}
    </ul>
  );
}

type AdminResourceViewActionsProps = {
  cancelHref: string;
  cancelLabel: string;
  editHref: string;
  editLabel: string;
};

export function AdminResourceViewActions({
  cancelHref,
  cancelLabel,
  editHref,
  editLabel,
}: AdminResourceViewActionsProps) {
  return (
    <div className="admin-page-actions admin-page-actions--form">
      <ButtonLink
        href={cancelHref}
        variant="secondary"
        className="admin-page-actions__btn admin-page-actions__btn--reset"
      >
        {cancelLabel}
      </ButtonLink>
      <ButtonLink
        href={editHref}
        variant="accent"
        className="admin-page-actions__btn admin-page-actions__btn--save"
      >
        {editLabel}
      </ButtonLink>
    </div>
  );
}
