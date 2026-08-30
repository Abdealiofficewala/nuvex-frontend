export const endpoints = {
  company: "/company",
  leadership: "/company/leadership",
  theme: "/theme",
  homepage: "/homepage",
  products: "/products",
  product: (id: string) => `/products/${id}`,
  categories: "/categories",
  industries: "/industries",
  testimonials: "/testimonials",
  faq: "/faq",
  messages: "/messages",
} as const;
