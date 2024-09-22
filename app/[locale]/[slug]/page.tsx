import { Metadata } from "next";

import PageLayout from "@/components/blocks/page-layout";
import { fetchPage } from "@/server-actions/services/page-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata | null> {
  const data = await fetchTenant();
  const page = await fetchPage(slug);

  if (!data || !page) {
    return null;
  }

  return generateCommonMetadata({
    tenant: data,
    asPath: `/${slug}`,
    title: page.title,
    description: page.meta_description,
    keywords: page.meta_keywords
  });
}

export default async function Page({ params }: { params: AnyObject }) {
  return <PageLayout params={params} />;
}
