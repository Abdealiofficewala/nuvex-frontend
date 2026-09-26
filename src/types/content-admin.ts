import type { Industry, Sector } from "@/types/industry";
import type { Product, ProductCategory, ProductSizeOption, ProductStatus, ProductType } from "@/types/product";

export type ContentStatus = "active" | "draft";

export type ContentRecordMeta = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type BannerRecord = ContentRecordMeta & {
  slug: string;
  title: string;
  eyebrow: string;
  body: string;
  image: string;
  pageRoute: string;
  status: ContentStatus;
};

export type BannerInput = Omit<BannerRecord, keyof ContentRecordMeta>;

export type ProductRecord = Product & ContentRecordMeta;

export type ProductInput = Omit<Product, "id">;

export type CategoryRecord = ProductCategory & ContentRecordMeta;

export type CategoryInput = Omit<ProductCategory, "id">;

export type ProductTypeRecord = ProductType & ContentRecordMeta;

export type ProductTypeInput = Omit<ProductType, "id">;

export type IndustryRecord = Industry & ContentRecordMeta;

export type IndustryInput = Omit<Industry, "id">;

export type SectorRecord = Sector & ContentRecordMeta;

export type SectorInput = Omit<Sector, "id">;

export type ContentStore = {
  banners: BannerRecord[];
  products: ProductRecord[];
  categories: CategoryRecord[];
  productTypes: ProductTypeRecord[];
  industries: IndustryRecord[];
  sectors: SectorRecord[];
};

export type ContentResource = keyof ContentStore;

export { type ProductSizeOption, type ProductStatus, type ProductType };
