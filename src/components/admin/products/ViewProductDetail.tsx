"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AdminStatusBadge } from "@/components/admin/common/AdminStatusBadge";
import {
  AdminResourceViewActions,
  AdminResourceViewEmpty,
  AdminResourceViewField,
  AdminResourceViewGrid,
  AdminResourceViewHero,
  AdminResourceViewShell,
} from "@/components/admin/common/AdminResourceViewDetail";
import { ROUTES, productEditHref } from "@/lib/constants";
import { formatDate, hasValue } from "@/lib/utils";
import { contentService } from "@/services/content.service";
import type { ProductRecord } from "@/types/content-admin";

type ViewProductDetailProps = {
  id: string;
};

export function ViewProductDetail({ id }: ViewProductDetailProps) {
  const t = useTranslations("admin.products.listing.view");
  const locale = useLocale();
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    contentService
      .getProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoaded(true));
  }, [id]);

  if (loaded && !product) {
    return (
      <AdminResourceViewEmpty
        title={t("notFound.title")}
        body={t("notFound.body")}
        backHref={ROUTES.admin.products.listing}
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
        imageSrc={product.image}
        emptyImageLabel={t("noImage")}
        title={product.name}
        subtitle={hasValue(product.shortDescription) ? product.shortDescription : undefined}
        badges={
          <AdminStatusBadge
            active={product.status === "active"}
            activeLabel={t("status.active")}
            inactiveLabel={t(`status.${product.status}`)}
          />
        }
      />

      <AdminResourceViewGrid>
        <AdminResourceViewField label={t("fields.slug")}>
          <code className="admin-table__code">{product.slug}</code>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.category")}>
          {product.category}
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.created")}>
          <time dateTime={product.createdAt}>{formatDate(product.createdAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.updated")}>
          <time dateTime={product.updatedAt}>{formatDate(product.updatedAt, locale)}</time>
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.description")} wide valueClassName="admin-resource-view__body">
          {product.description || "—"}
        </AdminResourceViewField>
        <AdminResourceViewField label={t("fields.sizeOptions")} wide>
          {product.sizeOptions?.length ? (
            <ul className="admin-product-size-options-view">
              {product.sizeOptions.map((option) => (
                <li key={option.slug} className="admin-product-size-options-view__item">
                  {option.image ? (
                    <span className="admin-product-size-options-view__thumb">
                      <Image src={option.image} alt="" width={40} height={40} unoptimized />
                    </span>
                  ) : null}
                  <span className="admin-product-size-options-view__label">{option.label}</span>
                  {option.isDefault ? (
                    <span className="admin-product-size-options-view__badge">{t("sizeDefault")}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            "—"
          )}
        </AdminResourceViewField>
      </AdminResourceViewGrid>

      <AdminResourceViewActions
        cancelHref={ROUTES.admin.products.listing}
        cancelLabel={t("cancelAction")}
        editHref={productEditHref(product.id)}
        editLabel={t("editAction")}
      />
    </AdminResourceViewShell>
  );
}
