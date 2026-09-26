import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { IndustryDetail } from "@/components/website/industries/IndustryDetail";
import { IndustryGroupDetail } from "@/components/website/industries/IndustryGroupDetail";
import { industriesService } from "@/services/industries.service";

type IndustryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const [sectors, groups] = await Promise.all([
    industriesService.getSectors(),
    industriesService.getIndustryGroups(),
  ]);

  return [
    ...(sectors ?? []).map((sector) => ({ slug: sector.slug })),
    ...(groups ?? []).map((group) => ({ slug: group.slug })),
  ];
}

export async function generateMetadata({ params }: IndustryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [sector, group] = await Promise.all([
    industriesService.getSectorBySlug(slug),
    industriesService.getIndustryGroupBySlug(slug),
  ]);
  const record = sector ?? group;

  if (!record) {
    return {};
  }

  return {
    title: record.name,
    description: record.summary,
    openGraph: {
      title: record.name,
      description: record.summary,
      images: record.image ? [record.image] : undefined,
    },
  };
}

export default async function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  const { slug } = await params;
  const sector = await industriesService.getSectorBySlug(slug);

  if (sector?.slug) {
    const [related, groups] = await Promise.all([
      industriesService.getRelatedSectors(slug),
      industriesService.getIndustryGroups(),
    ]);
    const parent = groups.find((group) => group.id === sector.industryId);
    const messages = await getMessages();
    const sectors =
      (messages.industries?.sectors as Record<
        string,
        { body?: string; highlights?: string[]; requirements?: string[] }
      >) ?? {};
    const sectorCopy = sectors[sector.slug] ?? {};

    return (
      <IndustryDetail
        industry={sector}
        related={related}
        sector={sectorCopy}
        parentIndustry={parent}
      />
    );
  }

  const group = await industriesService.getIndustryGroupBySlug(slug);
  if (!group?.slug) {
    notFound();
  }

  const sectors = await industriesService.getSectorsByIndustrySlug(group.slug);

  return <IndustryGroupDetail industry={group} sectors={sectors} />;
}
