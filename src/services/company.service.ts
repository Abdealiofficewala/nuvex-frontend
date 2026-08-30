import { mockCompany, mockLeadership } from "@/data/mock/company";
import { resolveMediaUrl } from "@/lib/utils";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import { endpoints } from "@/services/api/endpoints";
import { asRecord, pickString, unwrapApiData, unwrapApiList } from "@/services/api/unwrap";
import type { Company, CompanyLeader, CompanyLeadership } from "@/types/company";

function normalizeLeader(raw: unknown): CompanyLeader | undefined {
  const record = asRecord(raw);
  if (!record) {
    return undefined;
  }

  const name = pickString(record, ["name", "fullName", "full_name", "person", "contactPerson", "contact_person"]);
  if (!name) {
    return undefined;
  }

  return {
    name,
    email: pickString(record, ["email"]) || undefined,
    phone: pickString(record, ["phone", "mobile", "contactNumber", "contact_number"]) || undefined,
    image: resolveMediaUrl(
      pickString(record, ["image", "photo", "avatar", "imageUrl", "image_url", "profileImage", "profile_image"]),
    ),
    role: pickString(record, ["role", "designation", "title", "position", "key"]) || undefined,
  };
}

function roleText(raw: unknown): string {
  const record = asRecord(raw);
  return pickString(record, ["key", "role", "designation", "title", "position", "type"]).toLowerCase();
}

function isLeaderRow(raw: unknown): boolean {
  const role = roleText(raw);
  return Boolean(
    role &&
      (role.includes("ceo") ||
        role.includes("cfo") ||
        role.includes("founder") ||
        role.includes("finance") ||
        role.includes("director")),
  );
}

function leaderFromList(list: unknown[], key: "ceo" | "cfo"): unknown {
  return list.find((item) => {
    const haystack = roleText(item);
    if (key === "ceo") {
      return haystack.includes("ceo") || haystack.includes("founder");
    }
    return haystack.includes("cfo") || haystack.includes("finance");
  });
}

function nestedPeople(raw: unknown): unknown[] {
  const record = asRecord(raw);
  if (!record) {
    return [];
  }

  const nested = record.leadership ?? record.leaders ?? record.team ?? record.people ?? record.members ?? record.employees;
  if (Array.isArray(nested)) {
    return nested;
  }

  const object = asRecord(nested);
  if (!object) {
    return [];
  }

  return [object.ceo, object.CEO, object.cfo, object.CFO, object.founder].filter(Boolean);
}

function normalizeLeadership(raw: unknown): CompanyLeadership {
  if (Array.isArray(raw)) {
    return {
      ceo: normalizeLeader(leaderFromList(raw, "ceo")),
      cfo: normalizeLeader(leaderFromList(raw, "cfo")),
    };
  }

  const record = asRecord(raw);
  if (!record) {
    return {};
  }

  return {
    ceo: normalizeLeader(record.ceo ?? record.CEO ?? record.founder),
    cfo: normalizeLeader(record.cfo ?? record.CFO),
  };
}

function normalizeAddress(raw: unknown): Company["address"] {
  const record = asRecord(raw);
  const fallback = mockCompany.address;
  return {
    street: pickString(record, ["street", "line1", "addressLine1", "address"]) || fallback.street,
    city: pickString(record, ["city"]) || fallback.city,
    state: pickString(record, ["state", "region"]) || fallback.state,
    country: pickString(record, ["country"]) || fallback.country,
    postalCode: pickString(record, ["postalCode", "postal_code", "zip", "pincode"]) || fallback.postalCode,
  };
}

function normalizeCompany(raw: unknown): Company {
  const record = asRecord(raw) ?? {};
  const fallback = mockCompany;
  const people = nestedPeople(record);
  const leadershipSource = people.length
    ? people
    : (record.leadership ?? record.leaders ?? record.team ?? {
        ceo: record.ceo,
        cfo: record.cfo,
      });

  return {
    id: pickString(record, ["id", "_id"]) || fallback.id,
    name: pickString(record, ["name", "legalName", "legal_name", "companyName", "company_name"]) || fallback.name,
    shortName: pickString(record, ["shortName", "short_name"]) || fallback.shortName,
    tagline: pickString(record, ["tagline"]) || fallback.tagline,
    description: pickString(record, ["description"]) || fallback.description,
    person: pickString(record, ["person", "contactPerson", "contact_person"]) || fallback.person,
    email: pickString(record, ["email"]) || fallback.email,
    phone: pickString(record, ["phone", "mobile"]) || fallback.phone,
    phones:
      Array.isArray(record.phones) && record.phones.length ? (record.phones as Company["phones"]) : fallback.phones,
    address: normalizeAddress(record.address ?? record),
    mapQuery: pickString(record, ["mapQuery", "map_query"]) || fallback.mapQuery,
    social: {
      ...fallback.social,
      ...(asRecord(record.social) as Company["social"] | null),
    },
    leadership: normalizeLeadership(leadershipSource),
  };
}

function companyFromListing(items: unknown[]): Company | null {
  if (!items.length) {
    return null;
  }

  const leaderItems = items.filter(isLeaderRow);
  const companyItems = items.filter((item) => asRecord(item) && !isLeaderRow(item));
  const baseRaw = companyItems[0] ?? (leaderItems.length === items.length ? null : items[0]);
  const base = baseRaw ? normalizeCompany(baseRaw) : { ...mockCompany, leadership: {} };
  const leadership = leaderItems.length ? normalizeLeadership(leaderItems) : base.leadership;
  const ceo = leadership?.ceo;

  return {
    ...base,
    person: ceo?.name || base.person,
    email: ceo?.email || base.email,
    phone: ceo?.phone || base.phone,
    leadership,
  };
}

function payloadToCompany(payload: unknown): Company | null {
  const list = unwrapApiList(payload);
  if (list.length) {
    return companyFromListing(list);
  }

  const record = asRecord(unwrapApiData(payload));
  return record ? normalizeCompany(record) : null;
}

async function requestLeadership(): Promise<CompanyLeadership> {
  const { data } = await axiosClient.get<unknown>(endpoints.leadership);
  const list = unwrapApiList(data);
  return list.length ? normalizeLeadership(list) : normalizeLeadership(unwrapApiData(data));
}

export const companyService = {
  getCompanies() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get<unknown>(endpoints.company);
      const list = unwrapApiList(data);
      const companies = list.map((item) => companyFromListing([item])).filter((item): item is Company => Boolean(item));
      return companies.length ? companies : [mockCompany];
    }, [mockCompany]);
  },

  getCompany() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get<unknown>(endpoints.company);
      const company = payloadToCompany(data);
      if (!company) {
        return mockCompany;
      }

      const hasLeaders = Boolean(company.leadership?.ceo?.name || company.leadership?.cfo?.name);
      if (hasLeaders) {
        return company;
      }

      try {
        return {
          ...company,
          leadership: await requestLeadership(),
        };
      } catch {
        return company;
      }
    }, mockCompany);
  },

  getLeadership() {
    return withMockFallback(async () => {
      try {
        const leadership = await requestLeadership();
        if (leadership.ceo?.name || leadership.cfo?.name) {
          return leadership;
        }
      } catch {
        /* use company listing */
      }

      const company = await companyService.getCompany();
      return company.leadership ?? {};
    }, mockLeadership);
  },
};
