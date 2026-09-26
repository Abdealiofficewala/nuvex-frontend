export const ROUTES = {
  home: "/",
  about: "/about",
  products: "/products",
  industries: "/industries",
  contact: "/contact",
  quote: "/request-quote",
  quoteSuccess: "/request-quote/success",
  admin: {
    login: "/admin/login",
    dashboard: "/admin/dashboard",
    users: {
      root: "/admin/users",
      create: "/admin/users/create",
      details: "/admin/users/details",
      access: "/admin/users/access",
      accessCreate: "/admin/users/access/create",
    },
    theme: {
      root: "/admin/theme",
      listing: "/admin/theme/listing",
      create: "/admin/theme/listing/create",
      logos: "/admin/theme/logos",
      logosCreate: "/admin/theme/logos/create",
      colors: "/admin/theme/colors",
      colorsCreate: "/admin/theme/colors/create",
      typography: "/admin/theme/typography",
    },
    company: {
      root: "/admin/company",
      topBar: "/admin/company/top-bar",
      contact: "/admin/company/contact",
      social: "/admin/company/social",
      profile: "/admin/company/profile",
    },
    teamMembers: {
      root: "/admin/team-members",
      roles: "/admin/team-members/roles",
      rolesCreate: "/admin/team-members/roles/create",
      members: "/admin/team-members/members",
      membersCreate: "/admin/team-members/members/create",
    },
    banners: {
      root: "/admin/banners",
      listing: "/admin/banners/listing",
      create: "/admin/banners/listing/create",
    },
    industries: {
      root: "/admin/industries",
      listing: "/admin/industries/listing",
      create: "/admin/industries/listing/create",
      sectors: "/admin/industries/sectors",
      sectorsCreate: "/admin/industries/sectors/create",
    },
    products: {
      root: "/admin/products",
      listing: "/admin/products/listing",
      create: "/admin/products/listing/create",
      categories: "/admin/products/categories",
      categoriesCreate: "/admin/products/categories/create",
      types: "/admin/products/types",
      typesCreate: "/admin/products/types/create",
      sizes: "/admin/products/sizes",
    },
  },
} as const;

export function adminUserViewHref(id: string) {
  return `${ROUTES.admin.users.root}/${encodeURIComponent(id)}`;
}

export function adminPageAccessViewHref(userId: string) {
  return `${ROUTES.admin.users.access}/${encodeURIComponent(userId)}`;
}

export function adminPageAccessEditHref(userId: string) {
  return `${ROUTES.admin.users.access}/${encodeURIComponent(userId)}/edit`;
}

export function teamRoleViewHref(value: string) {
  return `${ROUTES.admin.teamMembers.roles}/${encodeURIComponent(value)}`;
}

export function teamRoleEditHref(value: string) {
  return `${ROUTES.admin.teamMembers.roles}/${encodeURIComponent(value)}/edit`;
}

export function teamMemberViewHref(id: string) {
  return `${ROUTES.admin.teamMembers.members}/${encodeURIComponent(id)}`;
}

export function teamMemberEditHref(id: string) {
  return `${ROUTES.admin.teamMembers.members}/${encodeURIComponent(id)}/edit`;
}

export function themeViewHref(id: string) {
  return `${ROUTES.admin.theme.listing}/${encodeURIComponent(id)}`;
}

export function themeEditHref(id: string) {
  return `${ROUTES.admin.theme.listing}/${encodeURIComponent(id)}/edit`;
}

export function themePreviewHref(id: string) {
  return `${ROUTES.admin.theme.listing}/${encodeURIComponent(id)}/preview`;
}

export function brandingViewHref(id: string) {
  return `${ROUTES.admin.theme.logos}/${encodeURIComponent(id)}`;
}

export function brandingEditHref(id: string) {
  return `${ROUTES.admin.theme.logos}/${encodeURIComponent(id)}/edit`;
}

export function colorPaletteViewHref(id: string) {
  return `${ROUTES.admin.theme.colors}/${encodeURIComponent(id)}`;
}

export function colorPaletteEditHref(id: string) {
  return `${ROUTES.admin.theme.colors}/${encodeURIComponent(id)}/edit`;
}

export function bannerViewHref(id: string) {
  return `${ROUTES.admin.banners.listing}/${encodeURIComponent(id)}`;
}

export function bannerEditHref(id: string) {
  return `${ROUTES.admin.banners.listing}/${encodeURIComponent(id)}/edit`;
}

export function productViewHref(id: string) {
  return `${ROUTES.admin.products.listing}/${encodeURIComponent(id)}`;
}

export function productEditHref(id: string) {
  return `${ROUTES.admin.products.listing}/${encodeURIComponent(id)}/edit`;
}

export function categoryViewHref(id: string) {
  return `${ROUTES.admin.products.categories}/${encodeURIComponent(id)}`;
}

export function categoryEditHref(id: string) {
  return `${ROUTES.admin.products.categories}/${encodeURIComponent(id)}/edit`;
}

export function typeViewHref(id: string) {
  return `${ROUTES.admin.products.types}/${encodeURIComponent(id)}`;
}

export function typeEditHref(id: string) {
  return `${ROUTES.admin.products.types}/${encodeURIComponent(id)}/edit`;
}

export function industryViewHref(id: string) {
  return `${ROUTES.admin.industries.listing}/${encodeURIComponent(id)}`;
}

export function industryEditHref(id: string) {
  return `${ROUTES.admin.industries.listing}/${encodeURIComponent(id)}/edit`;
}

export function industryManageSectorsHref(id: string) {
  return `${ROUTES.admin.industries.listing}/${encodeURIComponent(id)}/sectors`;
}

export function sectorViewHref(id: string) {
  return `${ROUTES.admin.industries.sectors}/${encodeURIComponent(id)}`;
}

export function sectorEditHref(id: string) {
  return `${ROUTES.admin.industries.sectors}/${encodeURIComponent(id)}/edit`;
}

export function sectorCreateHref(industryId?: string) {
  const base = ROUTES.admin.industries.sectorsCreate;
  const key = industryId?.trim();
  return key ? `${base}?industryId=${encodeURIComponent(key)}` : base;
}

export function sectorHref(industrySlug: string, sectorSlug: string) {
  return `${ROUTES.industries}/${encodeURIComponent(industrySlug)}/${encodeURIComponent(sectorSlug)}`;
}

export function productHref(id?: string | null) {
  const key = id?.trim();
  return key ? `/products/${encodeURIComponent(key)}` : ROUTES.products;
}

export function industryHref(slug?: string | null) {
  const key = slug?.trim();
  return key ? `${ROUTES.industries}/${encodeURIComponent(key)}` : ROUTES.industries;
}

export function quoteHref(productId?: string | null) {
  const key = productId?.trim();
  return key ? `${ROUTES.quote}?product=${encodeURIComponent(key)}` : ROUTES.quote;
}

export const ADMIN_SESSION_KEY = "hakimi.admin";
export const ADMIN_USER_KEY = "hakimi.admin.user";
export const ADMIN_SESSION_COOKIE = "hakimi_admin";
export const ADMIN_USER_COOKIE = "hakimi_admin_user";
export const ADMIN_USERS_STORE_KEY = "hakimi.admin.users";
export const ADMIN_PAGE_ACCESS_KEY = "hakimi.admin.page-access";
export const ADMIN_THEME_STORE_KEY = "hakimi.admin.theme";
export const ADMIN_SOCIAL_STORE_KEY = "hakimi.admin.social";
export const ADMIN_CONTACT_STORE_KEY = "hakimi.admin.contact";
export const ADMIN_COMPANY_PROFILE_STORE_KEY = "hakimi.admin.company-profile";
export const ADMIN_SITE_TOP_BAR_STORE_KEY = "hakimi.admin.site-top-bar";
export const ADMIN_TEAM_STORE_KEY = "hakimi.admin.team";
export const ADMIN_TEAM_ROLES_STORE_KEY = "hakimi.admin.team-roles";

export const APPEARANCE_UPDATED_EVENT = "hakimi:appearance-updated";
export const CONTENT_UPDATED_EVENT = "hakimi:content-updated";

export const ADMIN_AUTH = {
  demoEmail: "admin@hakimifastners.com",
  demoPassword: "hakimi2026",
  minPasswordLength: 6,
  signInDelayMs: 480,
  mockSignIn: true,
  successRedirectMs: 520,
} as const;

export const ADMIN_LOGIN_MEDIA = {
  src: "/images/infrastructure/workshop.jpg",
} as const;

export const BREAKPOINTS = {
  mobile: 720,
  tablet: 980,
} as const;

export const LEADERSHIP_KEYS = {
  ceo: "ceo",
  cfo: "cfo",
} as const;

export const TICKET_SERIAL = {
  desk: "HF-DESK",
  team: "HF-TEAM",
} as const;

export const MAX_PROCESS_STEPS = 4;

export const PROCESS_STEP_IMAGES = [
  {
    src: "/images/hero/hero-assembly.jpg",
    alt: "Assorted fasteners sorted by size for a packing list enquiry",
  },
  {
    src: "/images/products/nx-hex-bolt.jpg",
    alt: "Hex bolt and matching nut gauged as a pair with grade on the head",
  },
  {
    src: "/images/company/about-workers.jpg",
    alt: "Workers counting and labelling fastener bags in the packing bay",
  },
  {
    src: "/images/infrastructure/workshop.jpg",
    alt: "Packed fastener crates leaving the Hakimi Fastners workshop bay",
  },
] as const;

export function companyTicketSerial(foundedYear: number): string {
  return `HF-${foundedYear}`;
}
