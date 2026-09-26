"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AdminResourceViewActions,
  AdminResourceViewEmpty,
  AdminResourceViewField,
  AdminResourceViewGrid,
  AdminResourceViewHero,
  AdminResourceViewShell,
} from "@/components/admin/common/AdminResourceViewDetail";
import { ROUTES, categoryEditHref } from "@/lib/constants";
import { formatDate, hasValue } from "@/lib/utils";
import { formatCategoryTypeDependencies } from "@/lib/product-type-utils";
import { contentService } from "@/services/content.service";
import type { CategoryRecord } from "@/types/content-admin";

type ViewCategoryDetailProps = {
  id: string;
};

export function ViewCategoryDetail({ id }: ViewCategoryDetailProps) {
  const t = useTranslations("admin.products.categories.view");
  const tNav = useTranslations("admin.nav");
  const typeLabel = tNav("productTypes");
  const locale = useLocale();
  const [category, setCategory] = useState<CategoryRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    contentService
      .getCategory(id)
      .then(setCategory)
      .catch(() => setCategory(null))
      .finally(() => setLoaded(true));
  }, [id]);

  if (loaded && !category) {
    return (
      <AdminResourceViewEmpty
        title={t("notFound.title")}
        body={t("notFound.body")}
        backHref={ROUTES.admin.products.categories}
        backLabel={t("cancelAction")}
      />
    );
  }

  if (!category) {
    return null;
  }

  return (
    <AdminResourceViewShell>
      <AdminResourceViewHero
        imageSrc={category.image}
        emptyImageLabel={t("noImage")}
        title={category.name}
        subtitle={hasValue(category.summary) ? category.summary : undefined}
      />

      <AdminResourceViewGrid>
        <AdminResourceViewField label={t("fields.slug")}>
          <code className="admin-table__code">{category.slug}</code>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.dependencies", { typeLabel })}>
          {formatCategoryTypeDependencies(category)}
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.isVisible")}>
          {category.isVisible ? t("options.yes") : t("options.no")}
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.isNew")}>
          {category.isNew ? t("options.yes") : t("options.no")}
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.created")}>
          <time dateTime={category.createdAt}>{formatDate(category.createdAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.updated")}>
          <time dateTime={category.updatedAt}>{formatDate(category.updatedAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.summary")} wide valueClassName="admin-resource-view__body">
          {category.summary || "—"}
        </AdminResourceViewField>
      </AdminResourceViewGrid>

      <AdminResourceViewActions
        cancelHref={ROUTES.admin.products.categories}
        cancelLabel={t("cancelAction")}
        editHref={categoryEditHref(category.id)}
        editLabel={t("editAction")}
      />
    </AdminResourceViewShell>
  );
}
