import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import { ProductSectionCard } from "@/components/product";
import { fetchSearchResults } from "@/server-actions/services/search-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

import Breadcrumbs from "./breadcrumbs";
import EmptyCard from "./empty-card";
import ItemsListing from "./items-listing";

export async function generateMetadata({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata | null> {
  const data = await fetchTenant();
  const { q } = searchParams;

  if (!data) {
    return null;
  }

  const t = await getTranslations();

  return generateCommonMetadata({
    tenant: data,
    asPath: "/search",
    title: t("common.search_results", {
      query: q as string
    })
  });
}

export default async function Page({
  params,
  searchParams
}: {
  params: AnyObject;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }

  const t = await getTranslations();

  const { q, type } = searchParams;

  const results = await fetchSearchResults({
    q,
    type
  });
  const isEmpty = results?.length === 0;

  return (
    <RootLayout params={params}>
      <BaseLayout
        className="search-results-page"
        renderHeader={() => <Header />}
        renderFooter={() => <Footer />}
        renderMobileNavigation={() => <MobileNavigation />}
      >
        <Container>
          <Breadcrumbs
            title={t("common.search_results", {
              query: q as string
            })}
          />

          {isEmpty ? (
            <EmptyCard title={t("empty_sections.no_search_results")} />
          ) : (
            <ProductSectionCard
              title={t("common.search_results", {
                query: q as string
              })}
              children={<ItemsListing data={results} />}
              icon={undefined}
            />
          )}
        </Container>
      </BaseLayout>
    </RootLayout>
  );
}
