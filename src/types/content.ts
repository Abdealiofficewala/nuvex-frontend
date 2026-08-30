export type ProcessStep = {
  n: string;
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
};

export type ContentBlock = {
  title: string;
  body: string;
};

export type AboutPersonSeed = {
  key: string;
  role: string;
  crunch: string;
  body: string;
};

export type DeskPerson = AboutPersonSeed & {
  name: string;
  phone?: string;
  email?: string;
  image?: string;
};

export type ContactIconName = "phone" | "whatsapp" | "email" | "pin";

export type ContactInfoRow = {
  key: string;
  label: string;
  icon: ContactIconName;
  href?: string;
  lines: string[];
  muted?: string;
};

export type CompanyFactRow = {
  label: string;
  value?: string;
  href?: string;
};
