import { getCatalogStore } from "@/lib/products/store";
import type { ProductMasterKey } from "@/types/product-catalog";

export type DependencyUsage = {
  count: number;
  message: string;
};

function usage(count: number, singular: string, plural: string): DependencyUsage | null {
  if (count <= 0) {
    return null;
  }

  return {
    count,
    message: count === 1 ? singular : plural.replace("{count}", String(count)),
  };
}

export function getMasterDeleteBlock(
  master: ProductMasterKey,
  id: string,
): DependencyUsage | null {
  const store = getCatalogStore();

  switch (master) {
    case "categories": {
      const products = store.products.filter((p) => p.category.id === id).length;
      return usage(
        products,
        'Cannot delete this category. It is used by 1 product.',
        `Cannot delete this category. It is used by {count} products.`,
      );
    }
    case "types": {
      const products = store.products.filter((p) => p.type.id === id).length;
      return usage(
        products,
        'Cannot delete this product type. It is used by 1 product.',
        `Cannot delete this product type. It is used by {count} products.`,
      );
    }
    case "sizes": {
      const variants = store.products.reduce(
        (acc, p) => acc + p.variants.filter((v) => v.sizeId === id).length,
        0,
      );
      return usage(
        variants,
        'Cannot delete this size. It is used by 1 product variant.',
        `Cannot delete this size. It is used by {count} product variants.`,
      );
    }
    case "materials": {
      const variants = store.products.reduce(
        (acc, p) => acc + p.variants.filter((v) => v.materialId === id).length,
        0,
      );
      const types = store.types.filter((t) => t.configuration.allowedMaterialIds.includes(id)).length;
      const total = variants + types;
      return usage(
        total,
        'Cannot delete this material. It is referenced by another record.',
        `Cannot delete this material. It is referenced by {count} records.`,
      );
    }
    case "grades": {
      const variants = store.products.reduce(
        (acc, p) => acc + p.variants.filter((v) => v.gradeId === id).length,
        0,
      );
      const materials = store.materials.filter((m) => m.allowedGradeIds.includes(id)).length;
      const total = variants + materials;
      return usage(
        total,
        'Cannot delete this grade. It is referenced by another record.',
        `Cannot delete this grade. It is referenced by {count} records.`,
      );
    }
    case "standards": {
      const variants = store.products.reduce(
        (acc, p) => acc + p.variants.filter((v) => v.standardId === id).length,
        0,
      );
      return usage(
        variants,
        'Cannot delete this standard. It is used by 1 product variant.',
        `Cannot delete this standard. It is used by {count} product variants.`,
      );
    }
    case "finishes": {
      const variants = store.products.reduce(
        (acc, p) => acc + p.variants.filter((v) => v.finishId === id).length,
        0,
      );
      return usage(
        variants,
        'Cannot delete this finish. It is used by 1 product variant.',
        `Cannot delete this finish. It is used by {count} product variants.`,
      );
    }
    case "threads": {
      const variants = store.products.reduce(
        (acc, p) => acc + p.variants.filter((v) => v.threadId === id).length,
        0,
      );
      return usage(
        variants,
        'Cannot delete this thread. It is used by 1 product variant.',
        `Cannot delete this thread. It is used by {count} product variants.`,
      );
    }
    case "head-types": {
      const types = store.types.filter((t) => t.configuration.allowedHeadTypeIds.includes(id)).length;
      return usage(
        types,
        'Cannot delete this head type. It is used by 1 product type configuration.',
        `Cannot delete this head type. It is used by {count} product type configurations.`,
      );
    }
    case "drive-types": {
      const types = store.types.filter((t) => t.configuration.allowedDriveTypeIds.includes(id)).length;
      return usage(
        types,
        'Cannot delete this drive type. It is used by 1 product type configuration.',
        `Cannot delete this drive type. It is used by {count} product type configurations.`,
      );
    }
    case "industries": {
      const products = store.products.filter((p) => p.industries.some((i) => i.id === id)).length;
      return usage(
        products,
        'Cannot delete this industry. It is used by 1 product.',
        `Cannot delete this industry. It is used by {count} products.`,
      );
    }
    case "applications": {
      const products = store.products.filter((p) => p.applications.some((a) => a.id === id)).length;
      return usage(
        products,
        'Cannot delete this application. It is used by 1 product.',
        `Cannot delete this application. It is used by {count} products.`,
      );
    }
    case "packaging": {
      const variants = store.products.reduce(
        (acc, p) => acc + p.variants.filter((v) => v.packagingId === id).length,
        0,
      );
      return usage(
        variants,
        'Cannot delete this packaging option. It is used by 1 product variant.',
        `Cannot delete this packaging option. It is used by {count} product variants.`,
      );
    }
    case "attributes": {
      const attrs = store.products.reduce(
        (acc, p) =>
          acc + p.specifications.productAttributes.filter((a) => a.attributeId === id).length,
        0,
      );
      return usage(
        attrs,
        'Cannot delete this attribute. It is used by 1 product specification.',
        `Cannot delete this attribute. It is used by {count} product specifications.`,
      );
    }
    default:
      return null;
  }
}
