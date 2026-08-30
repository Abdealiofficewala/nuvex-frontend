import { getTranslations } from "next-intl/server";
import type { Product } from "@/types/product";

type ProductSpecificationsProps = {
  product: Product;
};

export async function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const t = await getTranslations("products");

  if (!product?.specifications?.length) {
    return null;
  }

  return (
    <div className={"spec-table-wrap"}>
      <h3 className="t-h3">{t("detail.specifications")}</h3>
      <table className={"spec-table"}>
        <caption className="sr-only">{t("detail.specifications")}</caption>
        <tbody>
          {product.specifications.map((spec) => (
            <tr key={spec.label}>
              <th>{spec.label}</th>
              <td>{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
