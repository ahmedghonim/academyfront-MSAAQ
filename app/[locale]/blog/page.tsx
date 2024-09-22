import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { fetchArticles } from "@/server-actions/services/article-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { articleJsonLd, breadcrumbListJsonLd } from "@/utils/jsonLd";

import ArticlesListing from "./articles-listing";
import Breadcrumbs from "./breadcrumbs";

export async function generateMetadata(): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations("common");

  return generateCommonMetadata({
    tenant: data,
    asPath: "/blog",
    title: t("section_titles_blog")
  });
}

export default async function Page() {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }

  const articles = await fetchArticles({ page: 1, limit: 9 });

  const t = await getTranslations("common");

  return (
    <BaseLayout
      className="blog blog-index"
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
      renderMobileNavigation={() => <MobileNavigation />}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              breadcrumbListJsonLd([
                {
                  name: t("section_titles_home_page"),
                  id: `https://${tenant?.domain}`
                },
                {
                  name: t("section_titles_blog"),
                  id: `https://${tenant?.domain}/blog`
                }
              ]),
              ...[
                articles?.data && articles.data.length > 0
                  ? {
                      "@type": "ItemList",
                      itemListElement: articles.data?.map((article, i) => ({
                        "@type": "ListItem",
                        position: i + 1,
                        item: articleJsonLd(article, tenant)
                      }))
                    }
                  : {}
              ]
            ]
          })
        }}
      />
      <Container>
        <Breadcrumbs />
        <h1 className="mb-8 mt-6 text-4xl font-semibold text-black">{t("section_titles_blog")}</h1>
        <ArticlesListing
          initialArticles={articles}
          initialFilters={{ page: 1, limit: 9 }}
        />
      </Container>
    </BaseLayout>
  );
}
