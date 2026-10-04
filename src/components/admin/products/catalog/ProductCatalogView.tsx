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
import { ROUTES, productCatalogEditHref } from "@/lib/constants";
import { productCatalogData } from "@/lib/products/catalog-data";
import { formatDate } from "@/lib/utils";
import type { CatalogProduct } from "@/types/product-catalog";

type ProductCatalogViewProps = {
  id: string;
};

export function ProductCatalogView({ id }: ProductCatalogViewProps) {
  const t = useTranslations("admin.products.catalog.view");
  const locale = useLocale();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    productCatalogData
      .getProduct(id)
      .then((record) => setProduct(record ?? null))
      .finally(() => setLoaded(true));
  }, [id]);

  if (loaded && !product) {
    return (
      <AdminResourceViewEmpty
        title={t("notFound.title")}
        body={t("notFound.body")}
        backHref={ROUTES.admin.products.root}
        backLabel={t("cancelAction")}
      />
    );
  }

  if (!product) {
    return null;
  }

  return (
    <AdminResourceViewShell>
      <AdminResourceViewHero
        imageSrc={product.media.thumbnail?.url}
        emptyImageLabel={t("noImage")}
        title={product.name}
        subtitle={product.shortDescription}
      />

      <AdminResourceViewGrid>
        <AdminResourceViewField label={t("fields.productCode")}>{product.productCode}</AdminResourceViewField>
        <AdminResourceViewField label={t("fields.slug")}>
          <code className="admin-table__code">{product.slug}</code>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.category")}>{product.category.name}</AdminResourceViewField>
        <AdminResourceViewField label={t("fields.type")}>{product.type.name}</AdminResourceViewField>
        <AdminResourceViewField label={t("fields.status")}>{product.status}</AdminResourceViewField>
        <AdminResourceViewField label={t("fields.featured")}>{product.featured ? t("options.yes") : t("options.no")}</AdminResourceViewField>
        <AdminResourceViewField label={t("fields.variants")}>{product.variants.length}</AdminResourceViewField>
        <AdminResourceViewField label={t("fields.description")}>{product.description}</AdminResourceViewField>
        <AdminResourceViewField label={t("fields.created")}>
          <time dateTime={product.createdAt}>{formatDate(product.createdAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.updated")}>
          <time dateTime={product.updatedAt}>{formatDate(product.updatedAt, locale)}</time>
        </AdminResourceViewField>
      </AdminResourceViewGrid>

      <AdminResourceViewActions
        cancelHref={ROUTES.admin.products.root}
        cancelLabel={t("cancelAction")}
        editHref={productCatalogEditHref(id)}
        editLabel={t("editAction")}
      />
    </AdminResourceViewShell>
  );
}
