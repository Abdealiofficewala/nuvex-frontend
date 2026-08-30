import { ROUTES } from "@/lib/constants";

export const ADMIN_MENU_ICONS = [
  "dashboard",
  "theme",
  "themeListing",
  "themeLogos",
  "themeColors",
  "themeTypography",
  "companyDetails",
  "contactDetails",
  "socialMediaLinks",
  "companyProfile",
  "teamMembers",
  "teamRoles",
  "teamsListing",
  "hero",
  "banners",
  "industries",
  "sectors",
  "products",
  "productsListing",
  "productCategories",
  "productTypes",
  "productSizes",
  "users",
  "usersDetails",
  "usersAccess",
] as const;

export type AdminMenuIcon = (typeof ADMIN_MENU_ICONS)[number];

export type AdminMenuNavLabelKey =
  | "overview"
  | "theme"
  | "themeListing"
  | "themeLogos"
  | "themeColors"
  | "themeTypography"
  | "companyDetails"
  | "contactDetails"
  | "socialMediaLinks"
  | "companyProfile"
  | "teamMembers"
  | "teamRoles"
  | "teamMembersListing"
  | "hero"
  | "banners"
  | "industries"
  | "sectors"
  | "products"
  | "productsListing"
  | "productCategories"
  | "productTypes"
  | "productSizes"
  | "userManagement"
  | "users"
  | "userDetails"
  | "pageAccess";

export type AdminMenuGroupLabelKey = Extract<
  AdminMenuNavLabelKey,
  "userManagement" | "theme" | "companyDetails" | "teamMembers" | "hero" | "industries" | "products"
>;

export type AdminMenuHeaderKey =
  | "dashboard"
  | "themeListing"
  | "themeLogos"
  | "themeColors"
  | "themeTypography"
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
  | "sectors"
  | "productsListing"
  | "productCategories"
  | "productTypes"
  | "productSizes"
  | "users"
  | "usersListingView"
  | "usersDetails"
  | "usersAccess"
  | "usersAccessCreate"
  | "usersAccessView"
  | "usersAccessEdit";

export type AdminMenuAccessId =
  | "dashboard"
  | "themeListing"
  | "themeLogos"
  | "themeColors"
  | "themeTypography"
  | "contactDetails"
  | "socialMediaLinks"
  | "companyProfile"
  | "teamRoles"
  | "teamsListing"
  | "banners"
  | "sectors"
  | "productsListing"
  | "productCategories"
  | "productTypes"
  | "productSizes"
  | "users"
  | "usersDetails"
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
        key: "usersDetails",
        route: ROUTES.admin.users.details,
        icon: "usersDetails",
        navLabelKey: "userDetails",
        headerKey: "usersDetails",
        accessId: "usersDetails",
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
      {
        kind: "page",
        key: "usersAccess",
        route: ROUTES.admin.users.access,
        icon: "usersAccess",
        navLabelKey: "pageAccess",
        headerKey: "usersAccess",
        accessId: "usersAccess",
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
      {
        kind: "page",
        key: "themeTypography",
        route: ROUTES.admin.theme.typography,
        icon: "themeTypography",
        navLabelKey: "themeTypography",
        headerKey: "themeTypography",
        accessId: "themeTypography",
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
        route: ROUTES.admin.products.listing,
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
    headerKey: "users",
    test: (pathname) => pathname === ROUTES.admin.users.create,
  },
  {
    headerKey: "usersAccessCreate",
    test: (pathname) => pathname === ROUTES.admin.users.accessCreate,
  },
  {
    headerKey: "usersAccessEdit",
    test: (pathname) =>
      pathname.startsWith(`${ROUTES.admin.users.access}/`) && pathname.endsWith("/edit"),
  },
  {
    headerKey: "usersAccessView",
    test: (pathname) => {
      const base = `${ROUTES.admin.users.access}/`;
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
        suffix !== "details" &&
        suffix !== "access"
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
