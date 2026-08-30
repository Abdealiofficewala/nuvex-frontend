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
      logos: "/admin/theme/logos",
      colors: "/admin/theme/colors",
      typography: "/admin/theme/typography",
    },
    company: {
      root: "/admin/company",
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
    },
    industries: {
      root: "/admin/industries",
      sectors: "/admin/industries/sectors",
    },
    products: {
      root: "/admin/products",
      listing: "/admin/products/listing",
      categories: "/admin/products/categories",
      types: "/admin/products/types",
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

export const ADMIN_SESSION_KEY = "nexquanta.admin";
export const ADMIN_USER_KEY = "nexquanta.admin.user";
export const ADMIN_USERS_STORE_KEY = "nexquanta.admin.users";
export const ADMIN_PAGE_ACCESS_KEY = "nexquanta.admin.page-access";
export const ADMIN_THEME_STORE_KEY = "nexquanta.admin.theme";
export const ADMIN_SOCIAL_STORE_KEY = "nexquanta.admin.social";
export const ADMIN_CONTACT_STORE_KEY = "nexquanta.admin.contact";
export const ADMIN_COMPANY_PROFILE_STORE_KEY = "nexquanta.admin.company-profile";
export const ADMIN_TEAM_STORE_KEY = "nexquanta.admin.team";
export const ADMIN_TEAM_ROLES_STORE_KEY = "nexquanta.admin.team-roles";

export const ADMIN_AUTH = {
  demoEmail: "admin@nexquanta.solutions",
  demoPassword: "nexquanta2026",
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
  desk: "NX-DESK",
  team: "NX-TEAM",
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
    alt: "Packed fastener crates leaving the Nexquanta workshop bay",
  },
] as const;

export function companyTicketSerial(foundedYear: number): string {
  return `NX-${foundedYear}`;
}
