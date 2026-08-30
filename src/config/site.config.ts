import type { NavItem } from "@/types/navigation";

export const siteConfig = {
  company: {
    name: "Nexquanta Solutions",
    shortName: "Nexquanta",
    tagline: "Nuts, bolts, screws, and nails for site and store.",
    description:
      "Nexquanta Solutions supplies nuts, bolts, screws, and nails for fabrication, construction, and maintenance. Standard sizes, marked grades, and packing you can issue from a bin.",
    foundedYear: 2026,
  },

  leadership: {
    ceo: {
      name: "Abbas Officewala",
      image: "/images/team/ceo-officewala.png",
      email: "enquiries@nexquanta.solutions",
      phone: "+91 9727366046",
    },
    cfo: {
      name: "Femida Officewala",
      image: "/images/team/femida-officewala.png",
      email: "enquiries@nexquanta.solutions",
      phone: "+91 7777919698",
    },
  },

  branding: {
    logo: "/logos/nexquanta-logo.svg",
    logoLight: "/logos/nexquanta-logo-light.svg",
    logoDark: "/logos/nexquanta-logo-dark.svg",
    mobileLogo: "/logos/nexquanta-mobile-logo.svg",
    favicon: "/logos/favicon.svg",
  },

  contact: {
    person: "Abbas Officewala",
    email: "enquiries@nexquanta.solutions",
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
    linkedin: "https://www.linkedin.com/company/nexquanta-solutions",
    instagram: "https://www.instagram.com/nexquanta",
    facebook: "https://www.facebook.com/nexquanta",
    twitter: "https://x.com/nexquanta",
    youtube: "https://www.youtube.com/@nexquanta",
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
    title: "Nexquanta Solutions | Nuts, Bolts, Screws & Nails",
    description:
      "Hex bolts, nuts, screws, and nails for fabrication, construction, electrical work, and plant stores. Grade-marked lots, counted packing.",
    keywords: [
      "Nexquanta Solutions",
      "hex bolts",
      "nuts and bolts",
      "screws",
      "nails",
      "industrial fasteners",
    ],
    ogImage: "/images/og-image.svg",
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
      { key: "years", value: "15+", label: "Years supplying fasteners" },
      { key: "products", value: "400+", label: "Bolt, nut, screw, nail SKUs" },
      { key: "applications", value: "4", label: "Product lines" },
      { key: "countries", value: "18+", label: "States and export lots" },
    ],
  },
} as const;
