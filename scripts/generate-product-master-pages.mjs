import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "src/app/[locale]/admin/(panel)/products");

const masters = [
  ["categories", "productCategories", "categories"],
  ["types", "productTypes", "types"],
  ["sizes", "productSizes", "sizes"],
  ["materials", "productMaterials", "materials"],
  ["grades", "productGrades", "grades"],
  ["standards", "productStandards", "standards"],
  ["finishes", "productFinishes", "finishes"],
  ["threads", "productThreads", "threads"],
  ["head-types", "productHeadTypes", "head-types"],
  ["drive-types", "productDriveTypes", "drive-types"],
  ["industries", "productIndustries", "industries"],
  ["applications", "productApplications", "applications"],
  ["packaging", "productPackaging", "packaging"],
  ["attributes", "productAttributes", "attributes"],
];

function write(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

for (const [segment, pageKey, masterKey] of masters) {
  const base = path.join(root, segment);
  const formImport =
    masterKey === "types"
      ? `import { TypeMasterForm } from "@/components/admin/products/master/TypeMasterForm";`
      : `import { MasterEntityForm } from "@/components/admin/products/master/MasterEntityForm";`;
  const formComponent =
    masterKey === "types"
      ? `<TypeMasterForm />`
      : `<MasterEntityForm masterKey="${masterKey}" />`;
  const editFormComponent =
    masterKey === "types"
      ? `<TypeMasterForm editId={id} />`
      : `<MasterEntityForm masterKey="${masterKey}" editId={id} />`;

  write(
    path.join(base, "page.tsx"),
    `import { AdminPage } from "@/components/admin/common/AdminPage";
import { MasterEntityListing } from "@/components/admin/products/master/MasterEntityListing";

export default function Page() {
  return (
    <AdminPage pageKey="${pageKey}" wide>
      <MasterEntityListing masterKey="${masterKey}" />
    </AdminPage>
  );
}
`,
  );

  write(
    path.join(base, "create/page.tsx"),
    `import { AdminPage } from "@/components/admin/common/AdminPage";
${formImport}

export default function Page() {
  return (
    <AdminPage pageKey="${pageKey}Create" wide hideDescription>
      ${formComponent}
    </AdminPage>
  );
}
`,
  );

  write(
    path.join(base, "[id]/view/page.tsx"),
    `import { AdminPage } from "@/components/admin/common/AdminPage";
import { MasterEntityView } from "@/components/admin/products/master/MasterEntityView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="${pageKey}View" wide hideDescription>
      <MasterEntityView masterKey="${masterKey}" id={id} />
    </AdminPage>
  );
}
`,
  );

  write(
    path.join(base, "[id]/edit/page.tsx"),
    `import { AdminPage } from "@/components/admin/common/AdminPage";
${formImport}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="${pageKey}Edit" wide hideDescription>
      ${editFormComponent}
    </AdminPage>
  );
}
`,
  );
}

write(
  path.join(root, "page.tsx"),
  `import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductCatalogListing } from "@/components/admin/products/catalog/ProductCatalogListing";

export default function Page() {
  return (
    <AdminPage pageKey="productsListing" wide>
      <ProductCatalogListing />
    </AdminPage>
  );
}
`,
);

write(
  path.join(root, "create/page.tsx"),
  `import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductCatalogForm } from "@/components/admin/products/catalog/ProductCatalogForm";

export default function Page() {
  return (
    <AdminPage pageKey="productsListingCreate" wide hideDescription>
      <ProductCatalogForm />
    </AdminPage>
  );
}
`,
);

write(
  path.join(root, "[id]/view/page.tsx"),
  `import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductCatalogView } from "@/components/admin/products/catalog/ProductCatalogView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productsListingView" wide hideDescription>
      <ProductCatalogView id={id} />
    </AdminPage>
  );
}
`,
);

write(
  path.join(root, "[id]/edit/page.tsx"),
  `import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductCatalogForm } from "@/components/admin/products/catalog/ProductCatalogForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productsListingEdit" wide hideDescription>
      <ProductCatalogForm editId={id} />
    </AdminPage>
  );
}
`,
);

console.log("Generated product admin pages.");
