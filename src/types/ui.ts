import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "light" | "danger" | "accent";

export type HeroAction = {
  href: string;
  label: ReactNode;
  variant?: ButtonVariant;
  arrow?: boolean;
};

export type FilterOption = {
  slug: string;
  name: string;
  count?: number;
};

export type SelectOption = {
  value: string;
  label: string;
  count?: number;
};

export type FilterChip = {
  key: string;
  label: string;
  clear: () => void;
};
