"use client";

import type { FormEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AdminUmFormLayoutMode = "split" | "single";

type AdminUmFormLayoutProps = {
  layout: AdminUmFormLayoutMode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  aside?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  /** Extra class on `<form>` (e.g. `admin-um-role-form`). */
  formClassName?: string;
  className?: string;
};

/**
 * Shared admin form shell: `split` (roles — aside + main) or `single` (users, profile — one card).
 * Put fields in `children`; only pass `aside` for split layout.
 */
export function AdminUmFormLayout({
  layout,
  onSubmit,
  aside,
  children,
  footer,
  formClassName,
  className,
}: AdminUmFormLayoutProps) {
  const isSplit = layout === "split";

  return (
    <form
      className={cn(
        isSplit ? "admin-um-role-form" : "admin-um-form admin-um-form--single admin-create-form",
        formClassName,
        className,
      )}
      onSubmit={onSubmit}
      noValidate
    >
      {isSplit ? (
        <div className="admin-um-role-form__card">
          <aside className="admin-um-role-form__aside">{aside}</aside>
          <div className="admin-um-role-form__main">{children}</div>
        </div>
      ) : (
        <div className="admin-um-form__card">
          <div className="admin-um-form__body">{children}</div>
        </div>
      )}

      <footer className={isSplit ? "admin-um-role-form__footer" : "admin-um-form__footer"}>
        {footer}
      </footer>
    </form>
  );
}

export function AdminUmFormSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("admin-um-form__section", className)}>
      <header className="admin-um-form__section-head">
        <h3 className="admin-um-form__section-title">{title}</h3>
        <span className="admin-um-form__section-mark" aria-hidden="true" />
      </header>
      <div className="admin-um-form__section-fields admin-form-grid admin-form-grid--2">
        {children}
      </div>
    </section>
  );
}
