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
import { ROUTES, typeEditHref } from "@/lib/constants";
import { formatDate, hasValue } from "@/lib/utils";
import { contentService } from "@/services/content.service";
import type { ProductTypeRecord } from "@/types/content-admin";

type ViewTypeDetailProps = {
  id: string;
};

export function ViewTypeDetail({ id }: ViewTypeDetailProps) {
  const t = useTranslations("admin.products.types.view");
  const locale = useLocale();
  const [productType, setProductType] = useState<ProductTypeRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    contentService
      .getProductType(id)
      .then(setProductType)
      .catch(() => setProductType(null))
      .finally(() => setLoaded(true));
  }, [id]);

  if (loaded && !productType) {
    return (
      <AdminResourceViewEmpty
        title={t("notFound.title")}
        body={t("notFound.body")}
        backHref={ROUTES.admin.products.types}
        backLabel={t("cancelAction")}
      />
    );
  }

  if (!productType) {
    return null;
  }

  return (
    <AdminResourceViewShell>
      <AdminResourceViewHero
        imageSrc={productType.image}
        emptyImageLabel={t("noImage")}
        title={productType.name}
        subtitle={hasValue(productType.summary) ? productType.summary : undefined}
      />

      <AdminResourceViewGrid>
        <AdminResourceViewField label={t("fields.slug")}>
          <code className="admin-table__code">{productType.slug}</code>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.isVisible")}>
          {productType.isVisible ? t("options.yes") : t("options.no")}
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.created")}>
          <time dateTime={productType.createdAt}>{formatDate(productType.createdAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.updated")}>
          <time dateTime={productType.updatedAt}>{formatDate(productType.updatedAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.summary")} wide valueClassName="admin-resource-view__body">
          {productType.summary || "—"}
        </AdminResourceViewField>
      </AdminResourceViewGrid>

      <AdminResourceViewActions
        cancelHref={ROUTES.admin.products.types}
        cancelLabel={t("cancelAction")}
        editHref={typeEditHref(productType.id)}
        editLabel={t("editAction")}
      />
    </AdminResourceViewShell>
  );
}
