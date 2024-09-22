import { Metadata } from "next";

import { Academy } from "@/types";

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string | null;
  asPath: string;
  tenant: Academy;
}

export default function generateCommonMetadata({
  title,
  description,
  keywords,
  image,
  asPath,
  tenant
}: MetadataProps): Metadata {
  if (!tenant) {
    return {};
  }

  const metaTitle = title ? `${title} - ${tenant.title}` : tenant.title;
  const metaName = tenant.title;

  const metaDescription = description ?? tenant.meta_description;
  const metaKeywords = (keywords ?? tenant.meta_keywords ?? []).join(", ");

  const metaOgImage = image ?? tenant.meta_image;
  const metaUrl = `https://${tenant.domain}${asPath}`;

  return {
    title: metaTitle,
    applicationName: metaName,
    generator: "msaaq.com",
    robots: {
      index: true,
      follow: true
    },
    icons: tenant.favicon ? [tenant.favicon] : [],
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      url: metaUrl,
      type: "website",
      siteName: metaName,
      description: metaDescription,
      title: metaTitle,
      locale: tenant.locale,
      images: metaOgImage ? [metaOgImage] : []
    },
    twitter: {
      card: "summary_large_image",
      site: "@msaaqcom",
      title: metaTitle,
      description: metaDescription,
      images: metaOgImage ? [metaOgImage] : []
    }
  };
}
