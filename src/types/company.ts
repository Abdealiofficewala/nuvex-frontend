export type CompanyAddress = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export type CompanyPhone = {
  key: string;
  label: string;
  value: string;
};

export type CompanySocial = {
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  github: string;
};

export type CompanyLeader = {
  name: string;
  role?: string;
  image?: string;
  email?: string;
  phone?: string;
};

export type CompanyLeadership = {
  ceo?: CompanyLeader;
  cfo?: CompanyLeader;
};

export type Company = {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  person?: string;
  email: string;
  phone: string;
  phones?: CompanyPhone[];
  address: CompanyAddress;
  mapQuery?: string;
  social: CompanySocial;
  leadership?: CompanyLeadership;
};
