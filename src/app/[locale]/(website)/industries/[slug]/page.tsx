import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { IndustryDetail } from "@/components/website/industries/IndustryDetail";
import { industriesService } from "@/services/industries.service";

type IndustryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const industries = await industriesService.getIndustries();
  return (industries ?? []).map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = await industriesService.getIndustryBySlug(slug);

  if (!industry) {
    return {};
  }

  return {
    title: industry.name,
    description: industry.summary,
    openGraph: {
      title: industry.name,
      description: industry.summary,
      images: industry.image ? [industry.image] : undefined,
    },
  };
}

export default async function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  const { slug } = await params;
  const [industry, related] = await Promise.all([
    industriesService.getIndustryBySlug(slug),
    industriesService.getRelatedIndustries(slug),
  ]);

  if (!industry?.slug) {
    notFound();
  }

  const messages = await getMessages();
  const sectors =
    (messages.industries?.sectors as Record<
      string,
      { body?: string; highlights?: string[]; requirements?: string[] }
    >) ?? {};
  const sector = sectors[industry.slug] ?? {};

  return <IndustryDetail industry={industry} related={related} sector={sector} />;
}
