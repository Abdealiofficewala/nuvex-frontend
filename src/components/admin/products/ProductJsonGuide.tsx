"use client";

import { useTranslations } from "next-intl";
import productRecordExample from "@/data/examples/product-record.example.json";
import productsListExample from "@/data/examples/products-list.example.json";

export function ProductJsonGuide() {
  const t = useTranslations("admin.products.guide");

  const endpoints = [
    { label: t("endpoints.publicList"), value: "GET /api/content/products" },
    { label: t("endpoints.publicOne"), value: "GET /api/content/products/{id}" },
    { label: t("endpoints.publicFeatured"), value: "GET /api/content/products?featured=true" },
    { label: t("endpoints.adminList"), value: "GET /api/admin/content/products" },
    { label: t("endpoints.adminOne"), value: "GET /api/admin/content/products/{id}" },
    { label: t("endpoints.storeFile"), value: "data/content-store.json (server, after first save)" },
  ];

  return (
    <section className="admin-product-guide admin-panel">
      <div className="admin-product-guide__head">
        <h2 className="admin-product-guide__title">{t("title")}</h2>
        <p className="admin-product-guide__lede">{t("lede")}</p>
      </div>

      <div className="admin-product-guide__grid">
        <div className="admin-product-guide__block">
          <h3 className="admin-product-guide__subtitle">{t("endpointsTitle")}</h3>
          <ul className="admin-product-guide__endpoints">
            {endpoints.map((item) => (
              <li key={item.value}>
                <span className="admin-product-guide__endpoint-label">{item.label}</span>
                <code className="admin-table__code">{item.value}</code>
              </li>
            ))}
          </ul>
          <p className="admin-field-hint">{t("responseHint")}</p>
        </div>

        <div className="admin-product-guide__block">
          <h3 className="admin-product-guide__subtitle">{t("fetchTitle")}</h3>
          <pre className="admin-product-guide__code">
            <code>{`// Browser or client (public catalogue)
const response = await fetch("/api/content/products");
const { data } = await response.json();
// data = ProductRecord[]

const one = await fetch("/api/content/products/prd-hex-bolt");
const { data: product } = await one.json();`}</code>
          </pre>
        </div>

        <div className="admin-product-guide__block admin-product-guide__block--wide">
          <h3 className="admin-product-guide__subtitle">{t("listExampleTitle")}</h3>
          <pre className="admin-product-guide__code">
            <code>{JSON.stringify(productsListExample, null, 2)}</code>
          </pre>
        </div>

        <div className="admin-product-guide__block admin-product-guide__block--wide">
          <h3 className="admin-product-guide__subtitle">{t("recordExampleTitle")}</h3>
          <pre className="admin-product-guide__code">
            <code>{JSON.stringify(productRecordExample, null, 2)}</code>
          </pre>
          <p className="admin-field-hint">{t("sizeOptionsHint")}</p>
        </div>
      </div>
    </section>
  );
}
