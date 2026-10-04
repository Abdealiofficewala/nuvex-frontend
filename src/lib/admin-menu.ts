import { ROUTES } from "@/lib/constants";

export const ADMIN_MENU_ICONS = [
  "dashboard",
  "theme",
  "themeListing",
  "themeLogos",
  "themeColors",
  "companyDetails",
  "topBar",
  "contactDetails",
  "socialMediaLinks",
  "companyProfile",
  "teamMembers",
  "teamRoles",
  "teamsListing",
  "hero",
  "banners",
  "industries",
  "industriesListing",
  "sectors",
  "products",
  "productsListing",
  "productCategories",
  "productTypes",
  "productSizes",
  "productMaterials",
  "productGrades",
  "productStandards",
  "productFinishes",
  "productThreads",
  "productHeadTypes",
  "productDriveTypes",
  "productIndustries",
  "productApplications",
  "productPackaging",
  "productAttributes",
  "users",
  "usersProfile",
  "usersAccess",
] as const;

export type AdminMenuIcon = (typeof ADMIN_MENU_ICONS)[number];

export type AdminMenuNavLabelKey =
  | "overview"
  | "theme"
  | "themeListing"
  | "themeLogos"
  | "themeColors"
  | "companyDetails"
  | "topBar"
  | "contactDetails"
  | "socialMediaLinks"
  | "companyProfile"
  | "teamMembers"
  | "teamRoles"
  | "teamMembersListing"
  | "hero"
  | "banners"
  | "industries"
  | "industriesListing"
  | "sectors"
  | "products"
  | "productsListing"
  | "productCategories"
  | "productTypes"
  | "productSizes"
  | "productMaterials"
  | "productGrades"
  | "productStandards"
  | "productFinishes"
  | "productThreads"
  | "productHeadTypes"
  | "productDriveTypes"
  | "productIndustries"
  | "productApplications"
  | "productPackaging"
  | "productAttributes"
  | "userManagement"
  | "users"
  | "myProfile"
  | "rolesPermissions";

export type AdminMenuGroupLabelKey = Extract<
  AdminMenuNavLabelKey,
  "userManagement" | "theme" | "companyDetails" | "teamMembers" | "hero" | "industries" | "products"
>;

export type AdminMenuHeaderKey =
  | "dashboard"
  | "themeListing"
  | "themeCreate"
  | "themeEdit"
  | "themeView"
  | "themePreview"
  | "themeLogos"
  | "themeLogosCreate"
  | "themeLogosView"
  | "themeLogosEdit"
  | "themeColors"
  | "themeColorsCreate"
  | "themeColorsView"
  | "themeColorsEdit"
  | "topBar"
  | "contactDetails"
  | "socialMediaLinks"
  | "companyProfile"
  | "teamRoles"
  | "teamRolesCreate"
  | "teamRolesView"
  | "teamRolesEdit"
  | "teamsListing"
  | "teamsListingCreate"
  | "teamsListingView"
  | "teamsListingEdit"
  | "banners"
  | "bannersCreate"
  | "bannersView"
  | "bannersEdit"
  | "industriesListing"
  | "industriesListingCreate"
  | "industriesListingView"
  | "industriesListingEdit"
  | "industriesListingSectors"
  | "sectors"
  | "sectorsCreate"
  | "sectorsView"
  | "sectorsEdit"
  | "productsListing"
  | "productsListingCreate"
  | "productsListingView"
  | "productsListingEdit"
  | "productCategories"
  | "productCategoriesCreate"
  | "productCategoriesView"
  | "productCategoriesEdit"
  | "productTypes"
  | "productTypesCreate"
  | "productTypesView"
  | "productTypesEdit"
  | "productSizes"
  | "productSizesCreate"
  | "productSizesView"
  | "productSizesEdit"
  | "productMaterials"
  | "productMaterialsCreate"
  | "productMaterialsView"
  | "productMaterialsEdit"
  | "productGrades"
  | "productGradesCreate"
  | "productGradesView"
  | "productGradesEdit"
  | "productStandards"
  | "productStandardsCreate"
  | "productStandardsView"
  | "productStandardsEdit"
  | "productFinishes"
  | "productFinishesCreate"
  | "productFinishesView"
  | "productFinishesEdit"
  | "productThreads"
  | "productThreadsCreate"
  | "productThreadsView"
  | "productThreadsEdit"
  | "productHeadTypes"
  | "productHeadTypesCreate"
  | "productHeadTypesView"
  | "productHeadTypesEdit"
  | "productDriveTypes"
  | "productDriveTypesCreate"
  | "productDriveTypesView"
  | "productDriveTypesEdit"
  | "productIndustries"
  | "productIndustriesCreate"
  | "productIndustriesView"
  | "productIndustriesEdit"
  | "productApplications"
  | "productApplicationsCreate"
  | "productApplicationsView"
  | "productApplicationsEdit"
  | "productPackaging"
  | "productPackagingCreate"
  | "productPackagingView"
  | "productPackagingEdit"
  | "productAttributes"
  | "productAttributesCreate"
  | "productAttributesView"
  | "productAttributesEdit"
  | "users"
  | "usersListingView"
  | "usersListingEdit"
  | "usersProfile"
  | "usersProfileEdit"
  | "usersAccess"
  | "usersAccessCreate"
  | "usersAccessView"
  | "usersAccessEdit";

export type AdminMenuAccessId =
  | "dashboard"
  | "themeListing"
  | "themeLogos"
  | "themeColors"
  | "topBar"
  | "contactDetails"
  | "socialMediaLinks"
  | "companyProfile"
  | "teamRoles"
  | "teamsListing"
  | "banners"
  | "industriesListing"
  | "sectors"
  | "productsListing"
  | "productCategories"
  | "productTypes"
  | "productSizes"
  | "productMaterials"
  | "productGrades"
  | "productStandards"
  | "productFinishes"
  | "productThreads"
  | "productHeadTypes"
  | "productDriveTypes"
  | "productIndustries"
  | "productApplications"
  | "productPackaging"
  | "productAttributes"
  | "users"
  | "usersProfile"
  | "usersAccess";

export type AdminMenuPage = {
  kind: "page";
  key: string;
  route: string;
  icon: AdminMenuIcon;
  navLabelKey: AdminMenuNavLabelKey;
  headerKey: AdminMenuHeaderKey;
  accessId: AdminMenuAccessId;
};

export type AdminMenuGroup = {
  kind: "group";
  key: string;
  icon: AdminMenuIcon;
  navLabelKey: AdminMenuGroupLabelKey;
  children: readonly AdminMenuPage[];
};

export type AdminMenuEntry = AdminMenuPage | AdminMenuGroup;

export const ADMIN_MENU: readonly AdminMenuEntry[] = [
  {
    kind: "page",
    key: "dashboard",
    route: ROUTES.admin.dashboard,
    icon: "dashboard",
    navLabelKey: "overview",
    headerKey: "dashboard",
    accessId: "dashboard",
  },
  {
    kind: "group",
    key: "userManagement",
    icon: "users",
    navLabelKey: "userManagement",
    children: [
      {
        kind: "page",
        key: "usersProfile",
        route: ROUTES.admin.users.profile,
        icon: "usersProfile",
        navLabelKey: "myProfile",
        headerKey: "usersProfile",
        accessId: "usersProfile",
      },
      {
        kind: "page",
        key: "usersRoles",
        route: ROUTES.admin.users.roles,
        icon: "usersAccess",
        navLabelKey: "rolesPermissions",
        headerKey: "usersAccess",
        accessId: "usersAccess",
      },
      {
        kind: "page",
        key: "users",
        route: ROUTES.admin.users.root,
        icon: "users",
        navLabelKey: "users",
        headerKey: "users",
        accessId: "users",
      },
    ],
  },
  {
    kind: "group",
    key: "theme",
    icon: "theme",
    navLabelKey: "theme",
    children: [
      {
        kind: "page",
        key: "themeListing",
        route: ROUTES.admin.theme.listing,
        icon: "themeListing",
        navLabelKey: "themeListing",
        headerKey: "themeListing",
        accessId: "themeListing",
      },
      {
        kind: "page",
        key: "themeLogos",
        route: ROUTES.admin.theme.logos,
        icon: "themeLogos",
        navLabelKey: "themeLogos",
        headerKey: "themeLogos",
        accessId: "themeLogos",
      },
      {
        kind: "page",
        key: "themeColors",
        route: ROUTES.admin.theme.colors,
        icon: "themeColors",
        navLabelKey: "themeColors",
        headerKey: "themeColors",
        accessId: "themeColors",
      },
    ],
  },
  {
    kind: "group",
    key: "hero",
    icon: "hero",
    navLabelKey: "hero",
    children: [
      {
        kind: "page",
        key: "banners",
        route: ROUTES.admin.banners.listing,
        icon: "banners",
        navLabelKey: "banners",
        headerKey: "banners",
        accessId: "banners",
      },
    ],
  },
  {
    kind: "group",
    key: "industries",
    icon: "industries",
    navLabelKey: "industries",
    children: [
      {
        kind: "page",
        key: "industriesListing",
        route: ROUTES.admin.industries.listing,
        icon: "industriesListing",
        navLabelKey: "industriesListing",
        headerKey: "industriesListing",
        accessId: "industriesListing",
      },
      {
        kind: "page",
        key: "sectors",
        route: ROUTES.admin.industries.sectors,
        icon: "sectors",
        navLabelKey: "sectors",
        headerKey: "sectors",
        accessId: "sectors",
      },
    ],
  },
  {
    kind: "group",
    key: "products",
    icon: "products",
    navLabelKey: "products",
    children: [
      {
        kind: "page",
        key: "productsListing",
        route: ROUTES.admin.products.root,
        icon: "productsListing",
        navLabelKey: "productsListing",
        headerKey: "productsListing",
        accessId: "productsListing",
      },
      {
        kind: "page",
        key: "productCategories",
        route: ROUTES.admin.products.categories,
        icon: "productCategories",
        navLabelKey: "productCategories",
        headerKey: "productCategories",
        accessId: "productCategories",
      },
      {
        kind: "page",
        key: "productTypes",
        route: ROUTES.admin.products.types,
        icon: "productTypes",
        navLabelKey: "productTypes",
        headerKey: "productTypes",
        accessId: "productTypes",
      },
      {
        kind: "page",
        key: "productSizes",
        route: ROUTES.admin.products.sizes,
        icon: "productSizes",
        navLabelKey: "productSizes",
        headerKey: "productSizes",
        accessId: "productSizes",
      },
      {
        kind: "page",
        key: "productMaterials",
        route: ROUTES.admin.products.materials,
        icon: "productMaterials",
        navLabelKey: "productMaterials",
        headerKey: "productMaterials",
        accessId: "productMaterials",
      },
      {
        kind: "page",
        key: "productGrades",
        route: ROUTES.admin.products.grades,
        icon: "productGrades",
        navLabelKey: "productGrades",
        headerKey: "productGrades",
        accessId: "productGrades",
      },
      {
        kind: "page",
        key: "productStandards",
        route: ROUTES.admin.products.standards,
        icon: "productStandards",
        navLabelKey: "productStandards",
        headerKey: "productStandards",
        accessId: "productStandards",
      },
      {
        kind: "page",
        key: "productFinishes",
        route: ROUTES.admin.products.finishes,
        icon: "productFinishes",
        navLabelKey: "productFinishes",
        headerKey: "productFinishes",
        accessId: "productFinishes",
      },
      {
        kind: "page",
        key: "productThreads",
        route: ROUTES.admin.products.threads,
        icon: "productThreads",
        navLabelKey: "productThreads",
        headerKey: "productThreads",
        accessId: "productThreads",
      },
      {
        kind: "page",
        key: "productHeadTypes",
        route: ROUTES.admin.products.headTypes,
        icon: "productHeadTypes",
        navLabelKey: "productHeadTypes",
        headerKey: "productHeadTypes",
        accessId: "productHeadTypes",
      },
      {
        kind: "page",
        key: "productDriveTypes",
        route: ROUTES.admin.products.driveTypes,
        icon: "productDriveTypes",
        navLabelKey: "productDriveTypes",
        headerKey: "productDriveTypes",
        accessId: "productDriveTypes",
      },
      {
        kind: "page",
        key: "productIndustries",
        route: ROUTES.admin.products.industries,
        icon: "productIndustries",
        navLabelKey: "productIndustries",
        headerKey: "productIndustries",
        accessId: "productIndustries",
      },
      {
        kind: "page",
        key: "productApplications",
        route: ROUTES.admin.products.applications,
        icon: "productApplications",
        navLabelKey: "productApplications",
        headerKey: "productApplications",
        accessId: "productApplications",
      },
      {
        kind: "page",
        key: "productPackaging",
        route: ROUTES.admin.products.packaging,
        icon: "productPackaging",
        navLabelKey: "productPackaging",
        headerKey: "productPackaging",
        accessId: "productPackaging",
      },
      {
        kind: "page",
        key: "productAttributes",
        route: ROUTES.admin.products.attributes,
        icon: "productAttributes",
        navLabelKey: "productAttributes",
        headerKey: "productAttributes",
        accessId: "productAttributes",
      },
    ],
  },
  {
    kind: "group",
    key: "companyDetails",
    icon: "companyDetails",
    navLabelKey: "companyDetails",
    children: [
      {
        kind: "page",
        key: "topBar",
        route: ROUTES.admin.company.topBar,
        icon: "topBar",
        navLabelKey: "topBar",
        headerKey: "topBar",
        accessId: "topBar",
      },
      {
        kind: "page",
        key: "companyProfile",
        route: ROUTES.admin.company.profile,
        icon: "companyProfile",
        navLabelKey: "companyProfile",
        headerKey: "companyProfile",
        accessId: "companyProfile",
      },
      {
        kind: "page",
        key: "contactDetails",
        route: ROUTES.admin.company.contact,
        icon: "contactDetails",
        navLabelKey: "contactDetails",
        headerKey: "contactDetails",
        accessId: "contactDetails",
      },
      {
        kind: "page",
        key: "socialMediaLinks",
        route: ROUTES.admin.company.social,
        icon: "socialMediaLinks",
        navLabelKey: "socialMediaLinks",
        headerKey: "socialMediaLinks",
        accessId: "socialMediaLinks",
      },
    ],
  },
  {
    kind: "group",
    key: "teamMembers",
    icon: "teamMembers",
    navLabelKey: "teamMembers",
    children: [
      {
        kind: "page",
        key: "teamRoles",
        route: ROUTES.admin.teamMembers.roles,
        icon: "teamRoles",
        navLabelKey: "teamRoles",
        headerKey: "teamRoles",
        accessId: "teamRoles",
      },
      {
        kind: "page",
        key: "teamsListing",
        route: ROUTES.admin.teamMembers.members,
        icon: "teamsListing",
        navLabelKey: "teamMembersListing",
        headerKey: "teamsListing",
        accessId: "teamsListing",
      },
    ],
  },
] as const;

type AdminHeaderRouteRule = {
  headerKey: AdminMenuHeaderKey;
  test: (pathname: string) => boolean;
};

const ADMIN_HEADER_ROUTE_RULES: readonly AdminHeaderRouteRule[] = [
  {
    headerKey: "themeCreate",
    test: (pathname) => pathname === ROUTES.admin.theme.create,
  },
  {
    headerKey: "themeEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.theme.listing}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "themePreview",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.theme.listing}/`) && pathname.endsWith("/preview"),
  },
  {
    headerKey: "themeView",
    test: (pathname) => {
      const base = `${ROUTES.admin.theme.listing}/`;
      if (!pathname.startsWith(base)) {
        return false;
      }

      const suffix = pathname.slice(base.length);
      return suffix.length > 0 && !suffix.includes("/");
    },
  },
  {
    headerKey: "themeLogosCreate",
    test: (pathname) => pathname === ROUTES.admin.theme.logosCreate,
  },
  {
    headerKey: "themeLogosEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.theme.logos}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "themeLogosView",
    test: (pathname) => {
      const base = `${ROUTES.admin.theme.logos}/`;
      if (!pathname.startsWith(base)) {
        return false;
      }

      const suffix = pathname.slice(base.length);
      return suffix.length > 0 && !suffix.includes("/");
    },
  },
  {
    headerKey: "themeColorsCreate",
    test: (pathname) => pathname === ROUTES.admin.theme.colorsCreate,
  },
  {
    headerKey: "themeColorsEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.theme.colors}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "themeColorsView",
    test: (pathname) => {
      const base = `${ROUTES.admin.theme.colors}/`;
      if (!pathname.startsWith(base)) {
        return false;
      }

      const suffix = pathname.slice(base.length);
      return suffix.length > 0 && !suffix.includes("/");
    },
  },
  {
    headerKey: "bannersCreate",
    test: (pathname) => pathname === ROUTES.admin.banners.create,
  },
  {
    headerKey: "bannersEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.banners.listing}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "bannersView",
    test: (pathname) => {
      const base = `${ROUTES.admin.banners.listing}/`;
      if (!pathname.startsWith(base)) {
        return false;
      }

      const suffix = pathname.slice(base.length);
      return suffix.length > 0 && !suffix.includes("/");
    },
  },
  {
    headerKey: "productsListingCreate",
    test: (pathname) => pathname === ROUTES.admin.products.create,
  },
  {
    headerKey: "productsListingEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.root}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productsListingView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.root}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productCategoriesCreate",
    test: (pathname) => pathname === ROUTES.admin.products.categoriesCreate,
  },
  {
    headerKey: "productCategoriesEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.categories}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productCategoriesView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.categories}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productTypesCreate",
    test: (pathname) => pathname === ROUTES.admin.products.typesCreate,
  },
  {
    headerKey: "productTypesEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.types}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productTypesView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.types}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productSizesCreate",
    test: (pathname) => pathname === ROUTES.admin.products.sizesCreate,
  },
  {
    headerKey: "productSizesEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.sizes}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productSizesView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.sizes}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "industriesListingCreate",
    test: (pathname) => pathname === ROUTES.admin.industries.create,
  },
  {
    headerKey: "industriesListingEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.industries.listing}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "industriesListingSectors",
    test: (pathname) => pathname.endsWith("/sectors") && pathname.startsWith(`${ROUTES.admin.industries.listing}/`),
  },
  {
    headerKey: "industriesListingView",
    test: (pathname) => {
      const base = `${ROUTES.admin.industries.listing}/`;
      if (!pathname.startsWith(base)) {
        return false;
      }

      const suffix = pathname.slice(base.length);
      return suffix.length > 0 && !suffix.includes("/");
    },
  },
  {
    headerKey: "sectorsCreate",
    test: (pathname) => pathname === ROUTES.admin.industries.sectorsCreate,
  },
  {
    headerKey: "sectorsEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.industries.sectors}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "sectorsView",
    test: (pathname) => {
      const base = `${ROUTES.admin.industries.sectors}/`;
      if (!pathname.startsWith(base)) {
        return false;
      }

      const suffix = pathname.slice(base.length);
      return suffix.length > 0 && !suffix.includes("/");
    },
  },
  {
    headerKey: "teamRolesCreate",
    test: (pathname) => pathname === ROUTES.admin.teamMembers.rolesCreate,
  },
  {
    headerKey: "teamRolesEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.teamMembers.roles}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "teamRolesView",
    test: (pathname) => {
      const base = `${ROUTES.admin.teamMembers.roles}/`;
      if (!pathname.startsWith(base)) {
        return false;
      }

      const suffix = pathname.slice(base.length);
      return suffix.length > 0 && !suffix.includes("/");
    },
  },
  {
    headerKey: "teamsListingCreate",
    test: (pathname) => pathname === ROUTES.admin.teamMembers.membersCreate,
  },
  {
    headerKey: "teamsListingEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.teamMembers.members}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "teamsListingView",
    test: (pathname) => {
      const base = `${ROUTES.admin.teamMembers.members}/`;
      if (!pathname.startsWith(base)) {
        return false;
      }

      const suffix = pathname.slice(base.length);
      return suffix.length > 0 && !suffix.includes("/");
    },
  },
  {
    headerKey: "productMaterialsCreate",
    test: (pathname) => pathname === ROUTES.admin.products.materialsCreate,
  },
  {
    headerKey: "productMaterialsEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.materials}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productMaterialsView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.materials}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productGradesCreate",
    test: (pathname) => pathname === ROUTES.admin.products.gradesCreate,
  },
  {
    headerKey: "productGradesEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.grades}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productGradesView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.grades}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productStandardsCreate",
    test: (pathname) => pathname === ROUTES.admin.products.standardsCreate,
  },
  {
    headerKey: "productStandardsEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.standards}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productStandardsView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.standards}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productFinishesCreate",
    test: (pathname) => pathname === ROUTES.admin.products.finishesCreate,
  },
  {
    headerKey: "productFinishesEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.finishes}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productFinishesView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.finishes}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productThreadsCreate",
    test: (pathname) => pathname === ROUTES.admin.products.threadsCreate,
  },
  {
    headerKey: "productThreadsEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.threads}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productThreadsView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.threads}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productHeadTypesCreate",
    test: (pathname) => pathname === ROUTES.admin.products.headTypesCreate,
  },
  {
    headerKey: "productHeadTypesEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.headTypes}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productHeadTypesView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.headTypes}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productDriveTypesCreate",
    test: (pathname) => pathname === ROUTES.admin.products.driveTypesCreate,
  },
  {
    headerKey: "productDriveTypesEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.driveTypes}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productDriveTypesView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.driveTypes}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productIndustriesCreate",
    test: (pathname) => pathname === ROUTES.admin.products.industriesCreate,
  },
  {
    headerKey: "productIndustriesEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.industries}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productIndustriesView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.industries}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productApplicationsCreate",
    test: (pathname) => pathname === ROUTES.admin.products.applicationsCreate,
  },
  {
    headerKey: "productApplicationsEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.applications}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productApplicationsView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.applications}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productPackagingCreate",
    test: (pathname) => pathname === ROUTES.admin.products.packagingCreate,
  },
  {
    headerKey: "productPackagingEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.packaging}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productPackagingView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.packaging}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "productAttributesCreate",
    test: (pathname) => pathname === ROUTES.admin.products.attributesCreate,
  },
  {
    headerKey: "productAttributesEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.attributes}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "productAttributesView",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.products.attributes}/`) && pathname.endsWith("/view"),
  },
  {
    headerKey: "users",
    test: (pathname) => pathname === ROUTES.admin.users.create,
  },
  {
    headerKey: "usersListingEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.users.root}/`) &&
      pathname.endsWith("/edit") &&
      !pathname.startsWith(`${ROUTES.admin.users.profile}`) &&
      !pathname.startsWith(`${ROUTES.admin.users.roles}/`),
  },
  {
    headerKey: "usersProfileEdit",
    test: (pathname) => pathname === ROUTES.admin.users.profileEdit,
  },
  {
    headerKey: "usersAccessCreate",
    test: (pathname) => pathname === ROUTES.admin.users.rolesCreate,
  },
  {
    headerKey: "usersAccessEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.users.roles}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "usersAccessView",
    test: (pathname) => {
      const base = `${ROUTES.admin.users.roles}/`;
      if (!pathname.startsWith(base)) {
        return false;
      }

      const suffix = pathname.slice(base.length);
      return suffix.length > 0 && !suffix.includes("/") && suffix !== "create";
    },
  },
  {
    headerKey: "usersListingView",
    test: (pathname) => {
      const base = `${ROUTES.admin.users.root}/`;
      if (!pathname.startsWith(base)) {
        return false;
      }

      const suffix = pathname.slice(base.length);
      return (
        suffix.length > 0 &&
        !suffix.includes("/") &&
        suffix !== "create" &&
        suffix !== "profile" &&
        suffix !== "roles"
      );
    },
  },
];

export const ADMIN_ACCESS_PAGES = ADMIN_MENU.flatMap((entry) =>
  entry.kind === "page"
    ? [{ id: entry.accessId, route: entry.route, labelKey: `pages.${entry.accessId}` as const }]
    : entry.children.map((child) => ({
        id: child.accessId,
        route: child.route,
        labelKey: `pages.${child.accessId}` as const,
      })),
);

export type AdminAccessPageId = AdminMenuAccessId;

export type AdminAccessMenuModuleId =
  | "dashboard"
  | "userManagement"
  | "theme"
  | "hero"
  | "industries"
  | "products"
  | "companyDetails"
  | "teamMembers";

export type AdminAccessMenuModule = {
  id: AdminAccessMenuModuleId;
  labelKey: AdminMenuNavLabelKey | AdminMenuGroupLabelKey;
  pageIds: readonly AdminAccessPageId[];
};

export const ADMIN_ACCESS_MENU_MODULES: readonly AdminAccessMenuModule[] = ADMIN_MENU.map((entry) =>
  entry.kind === "page"
    ? {
        id: "dashboard" as const,
        labelKey: entry.navLabelKey,
        pageIds: [entry.accessId],
      }
    : {
        id: entry.key as AdminAccessMenuModuleId,
        labelKey: entry.navLabelKey,
        pageIds: entry.children.map((child) => child.accessId),
      },
);

export function getAdminMenuPages(): AdminMenuPage[] {
  return ADMIN_MENU.flatMap((entry) => (entry.kind === "page" ? [entry] : [...entry.children]));
}

export function getAdminMenuGroupChildren(groupKey: string): AdminMenuPage[] {
  const group = ADMIN_MENU.find(
    (entry): entry is AdminMenuGroup => entry.kind === "group" && entry.key === groupKey,
  );

  return group ? [...group.children] : [];
}

export function resolveAdminMenuPage(pathname: string): AdminMenuPage | undefined {
  return getAdminMenuPages().find((page) => page.route === pathname);
}

function resolveAdminHeaderKeyByPrefix(pathname: string): AdminMenuHeaderKey | undefined {
  let bestMatch: AdminMenuPage | undefined;

  for (const page of getAdminMenuPages()) {
    if (pathname === page.route || pathname.startsWith(`${page.route}/`)) {
      if (!bestMatch || page.route.length > bestMatch.route.length) {
        bestMatch = page;
      }
    }
  }

  return bestMatch?.headerKey;
}

export function resolveAdminHeaderKey(pathname: string): AdminMenuHeaderKey {
  const menuPage = resolveAdminMenuPage(pathname);
  if (menuPage) {
    return menuPage.headerKey;
  }

  for (const rule of ADMIN_HEADER_ROUTE_RULES) {
    if (rule.test(pathname)) {
      return rule.headerKey;
    }
  }

  return resolveAdminHeaderKeyByPrefix(pathname) ?? "dashboard";
}

const ADMIN_VIEW_HEADER_KEYS = new Set<AdminMenuHeaderKey>([
  "themeView",
  "themeLogosView",
  "themeColorsView",
  "usersListingView",
  "usersAccessView",
  "teamRolesView",
  "teamsListingView",
  "bannersView",
  "productsListingView",
  "productCategoriesView",
  "productTypesView",
  "industriesListingView",
  "sectorsView",
]);

export function shouldHideAdminHeaderTitle(pageKey: AdminMenuHeaderKey) {
  return ADMIN_VIEW_HEADER_KEYS.has(pageKey);
}

function matchesAdminMenuRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function resolveActiveAdminMenuRoute(pathname: string, routes: readonly string[]) {
  return (
    routes
      .filter((route) => matchesAdminMenuRoute(pathname, route))
      .sort((a, b) => b.length - a.length)[0] ?? null
  );
}

export function isAdminMenuGroupActive(pathname: string, group: AdminMenuGroup) {
  return group.children.some((child) => matchesAdminMenuRoute(pathname, child.route));
}

export function isAdminMenuPageActive(
  pathname: string,
  route: string,
  siblingRoutes?: readonly string[],
) {
  if (siblingRoutes?.length) {
    return resolveActiveAdminMenuRoute(pathname, siblingRoutes) === route;
  }

  return matchesAdminMenuRoute(pathname, route);
}
