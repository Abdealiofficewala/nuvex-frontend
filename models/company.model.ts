import mongoose, { type Document, type Model, Schema } from "mongoose";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface CompanyAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface CompanyPhone {
  key: "mobile" | "whatsapp" | string;
  label: string;
  countryCode?: string;
  number?: string;
  value: string;
}

export interface CompanyLeader {
  name: string;
  role?: string;
  image?: string;
  email?: string;
  phone?: string;
}

export interface CompanyLeadership {
  ceo?: CompanyLeader;
  cfo?: CompanyLeader;
}

export interface CompanySocialLinks {
  linkedin: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
  twitter: string;
  github?: string;
}

export interface CompanySocialVisibility {
  linkedin: boolean;
  whatsapp: boolean;
  instagram: boolean;
  facebook: boolean;
  youtube: boolean;
  twitter: boolean;
}

export interface CompanySocial {
  links: CompanySocialLinks;
  visibility: CompanySocialVisibility;
}

export interface CompanyProfile {
  ticketEyebrow: string;
  ticketTitle: string;
  hqCity: string;
  hqState: string;
  hqCountry: string;
  deskAddress: string;
  productLines: string;
  reach: string;
}

export interface ICompany extends Document {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  foundedYear: number;
  profile: CompanyProfile;
  person: string;
  email: string;
  phone: string;
  phones: CompanyPhone[];
  address: CompanyAddress;
  mapQuery: string;
  social: CompanySocial;
  leadership: CompanyLeadership;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyModel extends Model<ICompany> {
  getActive(): Promise<ICompany | null>;
}

/* -------------------------------------------------------------------------- */
/*                                 Validators                                 */
/* -------------------------------------------------------------------------- */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const YEAR_MIN = 1800;
const YEAR_MAX = 2100;
const DESCRIPTION_MIN_LENGTH = 24;

function validateEmail(value: string): boolean {
  return EMAIL_REGEX.test(value?.trim?.() ?? "");
}

function validateFoundedYear(value: number): boolean {
  return Number.isInteger(value) && value >= YEAR_MIN && value <= YEAR_MAX;
}

function validateDescription(value: string): boolean {
  return (value?.trim?.().length ?? 0) >= DESCRIPTION_MIN_LENGTH;
}

function validateUrl(value: string): boolean {
  if (!value?.trim?.()) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*                              Sub-document schemas                          */
/* -------------------------------------------------------------------------- */

const addressSchema = new Schema<CompanyAddress>(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    postalCode: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const phoneSchema = new Schema<CompanyPhone>(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    countryCode: { type: String, default: "", trim: true },
    number: { type: String, default: "", trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const leaderSchema = new Schema<CompanyLeader>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    email: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator(value: string) {
          return !value || validateEmail(value);
        },
        message: "Invalid leader email address.",
      },
    },
    phone: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const leadershipSchema = new Schema<CompanyLeadership>(
  {
    ceo: { type: leaderSchema, default: undefined },
    cfo: { type: leaderSchema, default: undefined },
  },
  { _id: false },
);

const socialLinksSchema = new Schema<CompanySocialLinks>(
  {
    linkedin: { type: String, default: "", trim: true, validate: validateUrl },
    whatsapp: { type: String, default: "", trim: true },
    instagram: { type: String, default: "", trim: true, validate: validateUrl },
    facebook: { type: String, default: "", trim: true, validate: validateUrl },
    youtube: { type: String, default: "", trim: true, validate: validateUrl },
    twitter: { type: String, default: "", trim: true, validate: validateUrl },
    github: { type: String, default: "", trim: true, validate: validateUrl },
  },
  { _id: false },
);

const socialVisibilitySchema = new Schema<CompanySocialVisibility>(
  {
    linkedin: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
    instagram: { type: Boolean, default: false },
    facebook: { type: Boolean, default: false },
    youtube: { type: Boolean, default: false },
    twitter: { type: Boolean, default: false },
  },
  { _id: false },
);

const socialSchema = new Schema<CompanySocial>(
  {
    links: { type: socialLinksSchema, default: () => ({}) },
    visibility: { type: socialVisibilitySchema, default: () => ({}) },
  },
  { _id: false },
);

const profileSchema = new Schema<CompanyProfile>(
  {
    ticketEyebrow: { type: String, required: true, trim: true },
    ticketTitle: { type: String, required: true, trim: true },
    hqCity: { type: String, required: true, trim: true },
    hqState: { type: String, required: true, trim: true },
    hqCountry: { type: String, required: true, trim: true },
    deskAddress: { type: String, required: true, trim: true },
    productLines: { type: String, required: true, trim: true },
    reach: { type: String, required: true, trim: true },
  },
  { _id: false },
);

/* -------------------------------------------------------------------------- */
/*                               Company schema                               */
/* -------------------------------------------------------------------------- */

const companySchema = new Schema<ICompany, CompanyModel>(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    description: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: validateDescription,
        message: `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters.`,
      },
    },
    foundedYear: {
      type: Number,
      required: true,
      validate: {
        validator: validateFoundedYear,
        message: `Founded year must be between ${YEAR_MIN} and ${YEAR_MAX}.`,
      },
    },
    profile: { type: profileSchema, required: true },
    person: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validateEmail,
        message: "Invalid email address.",
      },
    },
    phone: { type: String, required: true, trim: true },
    phones: { type: [phoneSchema], default: [] },
    address: { type: addressSchema, required: true },
    mapQuery: { type: String, default: "", trim: true },
    social: { type: socialSchema, default: () => ({ links: {}, visibility: {} }) },
    leadership: { type: leadershipSchema, default: () => ({}) },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = String(ret._id);
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = String(ret._id);
        delete ret._id;
        return ret;
      },
    },
  },
);

companySchema.index({ name: 1 });
companySchema.index({ shortName: 1 });

companySchema.statics.getActive = function getActive() {
  return this.findOne({ isActive: true }).sort({ updatedAt: -1 });
};

/* -------------------------------------------------------------------------- */
/*                                    Model                                   */
/* -------------------------------------------------------------------------- */

export const Company =
  (mongoose.models.Company as CompanyModel | undefined) ??
  mongoose.model<ICompany, CompanyModel>("Company", companySchema);

export default Company;
