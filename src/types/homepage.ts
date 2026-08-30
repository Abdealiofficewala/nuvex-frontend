export type HomepageHero = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  primaryHref: string;
  secondaryHref: string;
};

export type HomepageStat = {
  key: string;
  value: string;
  label: string;
};

export type HomepageBenefit = {
  key: string;
  title: string;
  body: string;
};

export type HomepageInfrastructure = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
};

export type HomepageContent = {
  hero: HomepageHero;
  featuredProductId: string;
  featuredProductSlug?: string;
  stats: HomepageStat[];
  benefits: HomepageBenefit[];
  infrastructure: HomepageInfrastructure;
};
