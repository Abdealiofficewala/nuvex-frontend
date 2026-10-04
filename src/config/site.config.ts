import type { NavItem } from "@/types/navigation";

export const siteConfig = {
  company: {
    name: "Hakimi Fastners",
    shortName: "Hakimi",
    tagline: "Nuts, bolts, screws, and nails for site and store.",
    description:
      "Hakimi Fastners supplies nuts, bolts, screws, and nails for fabrication, construction, and maintenance. Standard sizes, marked grades, and packing you can issue from a bin.",
    foundedYear: 2026,
  },

  leadership: {
    ceo: {
      name: "Abbas Officewala",
      image: "/images/team/ceo-officewala.png",
      email: "enquiries@hakimifastners.com",
      phone: "+91 9727366046",
    },
    cfo: {
      name: "Femida Officewala",
      image: "/images/team/femida-officewala.png",
      email: "enquiries@hakimifastners.com",
      phone: "+91 7777919698",
    },
  },

  branding: {
    logo: "/logos/hakimi-hi-mark.png",
    logoLight: "/logos/hakimi-hi-mark.png",
    logoDark: "/logos/hakimi-hi-mark.png",
    logoCompact: "/logos/hakimi-hi-mark.png",
    mobileLogo: "/logos/hakimi-hi-mark.png",
    favicon: "/logos/favicon.png",
  },

  contact: {
    person: "Abbas Officewala",
    email: "enquiries@hakimifastners.com",
    phone: "+91 9727366046",
    phones: [
      { key: "mobile", label: "Mobile", value: "+91 9727366046" },
      { key: "whatsapp", label: "WhatsApp", value: "+91 9727366046" },
    ],
    address: {
      street: "Aavkar Avenue, Dawoodi Bohra Community Center",
      city: "Gandhinagar",
      state: "Gujarat",
      country: "India",
      postalCode: "",
    },
    mapQuery: "Aavkar Avenue Dawoodi Bohra Community Center Gandhinagar",
  },

  social: {
    linkedin: "https://www.linkedin.com/company/hakimi-fastners",
    instagram: "https://www.instagram.com/hakimifastners",
    facebook: "https://www.facebook.com/hakimifastners",
    twitter: "https://x.com/hakimifastners",
    youtube: "https://www.youtube.com/@hakimifastners",
    github: "",
  },

  navigation: {
    main: [
      { href: "/", labelKey: "nav.home" },
      { href: "/products", labelKey: "nav.products" },
      { href: "/industries", labelKey: "nav.industries" },
      { href: "/about", labelKey: "nav.about" },
      { href: "/contact", labelKey: "nav.contact" },
    ] satisfies NavItem[],
    footer: [
      { href: "/products", labelKey: "nav.products" },
      { href: "/industries", labelKey: "nav.industries" },
      { href: "/about", labelKey: "nav.about" },
      { href: "/contact", labelKey: "nav.contact" },
      { href: "/request-quote", labelKey: "nav.quote" },
    ] satisfies NavItem[],
  },

  seo: {
    title: "Hakimi Fastners | Nuts, Bolts, Screws & Nails",
    description:
      "Hex bolts, nuts, screws, and nails for fabrication, construction, electrical work, and plant stores. Grade-marked lots, counted packing.",
    keywords: [
      "Hakimi Fastners",
      "hex bolts",
      "nuts and bolts",
      "screws",
      "nails",
      "industrial fasteners",
    ],
    ogImage: "/images/og-image.png",
  },

  theme: {
    colors: {
      primary: "#1E3A5F",
      primaryDark: "#152A45",
      secondary: "#141A22",
      accent: "#C17A3A",
      background: "#F3F1EC",
      surface: "#FFFFFF",
      text: "#141A22",
      muted: "#5C6570",
      steel: "#7B8490",
      graphite: "#0D1117",
      line: "#D4CFC4",
    },
    fonts: {
      heading: "Poppins",
      body: "Inter",
    },
    radius: {
      sm: "4px",
      md: "8px",
      lg: "12px",
    },
  },

  languages: {
    default: "en",
    supported: ["en", "hi"],
  },

  business: {
    stats: [
      {
        key: "years",
        value: "15+",
        title: "Years",
        description: "Supplying Fasteners",
      },
      {
        key: "products",
        value: "400+",
        title: "SKUs",
        description: "Bolts, Nuts, Screws & Nails",
      },
      {
        key: "applications",
        value: "4",
        title: "Product Lines",
        description: "Industrial catalogue families",
      },
      {
        key: "countries",
        value: "18+",
        title: "States & Export Markets",
        description: "Pan-India and overseas supply",
      },
    ],
  },
} as const;
