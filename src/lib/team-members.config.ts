export const TEAM_MEMBER_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type TeamMember = {
  id: string;
  key: string;
  name: string;
  role: string;
  crunch: string;
  body: string;
  phone: string;
  email: string;
  image: string;
  visible: boolean;
};

export type TeamMemberSeed = {
  key: string;
  role: string;
  crunch: string;
  body: string;
};

export const DEFAULT_TEAM_MEMBER_SEEDS: readonly TeamMemberSeed[] = [
  {
    key: "ceo",
    role: "Founder & CEO",
    crunch: "Sales, standards, and what leaves the gate.",
    body: "Leads product selection, customer lots, and quality calls. Your enquiry lands here first.",
  },
  {
    key: "cfo",
    role: "Chief Financial Officer",
    crunch: "Books, billing, and long-term supply.",
    body: "Handles finance, vendor payments, and the numbers behind every crate.",
  },
] as const;
