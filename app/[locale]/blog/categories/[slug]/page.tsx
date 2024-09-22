import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { fetchArticles } from "@/server-actions/services/article-service";
import { fetchTaxonomy } from "@/server-actions/services/taxonomy-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { articleJsonLd, breadcrumbListJsonLd, searchActionJsonLd } from "@/utils/jsonLd";

import ArticlesListing from "./articles-listing";
import BlogBreadcrumbs from "./breadcrumbs";

export async function generateMetadata({
  params: { slug }
}: {
  params: {
    locale: string;
    slug: string;
  };
}): Promise<Metadata | null> {
  const data = await fetchTenant();
  const taxonomy = await fetchTaxonomy(slug);

  if (!data || !taxonomy) {
    return null;
  }

  const t = await getTranslations("common");

  return generateCommonMetadata({
    tenant: data,
    asPath: "/blog",
    title: t("taxonomy_blog", {
      taxonomy: taxonomy.name
    })
  });
}

export default async function Page({
  params: { slug }
}: {
  params: {
    locale: string;
    slug: string;
  };
}) {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }

  const taxonomy = await fetchTaxonomy(slug);

  if (!taxonomy) {
    notFound();
  }

  const articles = await fetchArticles({
    filters: {
      category: slug as string
    }
  });

  const t = await getTranslations("common");

  return (
    <BaseLayout
      className={`blog-category-${taxonomy?.id}`}
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
      renderMobileNavigation={() => <MobileNavigation />}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t("taxonomy_blog", {
              taxonomy: taxonomy.name
            }),
            description: taxonomy?.description || undefined,
            url: `https://${tenant?.domain}/categories/${taxonomy?.slug}`,
            breadcrumb: breadcrumbListJsonLd([
              { name: t("section_titles_home_page"), id: `https://${tenant?.domain}` },
              { name: t("section_titles_blog"), id: `https://${tenant?.domain}/blog` },
              {
                name: taxonomy?.name as string,
                id: `https://${tenant?.domain}/categories/${taxonomy?.slug}`
              }
            ]),
            mainEntity:
              articles?.data && articles?.data.length > 0
                ? {
                    "@type": "ItemList",
                    itemListElement: articles?.data.map((article, i) => ({
                      "@type": "ListItem",
                      position: i + 1,
                      item: articleJsonLd(article, tenant)
                    }))
                  }
                : undefined,
            potentialAction: searchActionJsonLd(tenant)
          })
        }}
      />
      <Container>
        <BlogBreadcrumbs title={taxonomy.name} />
        <ArticlesListing
          title={
            t("common.taxonomy_blog", {
              taxonomy: taxonomy?.name
            }) as string
          }
          articles={articles!}
        />
      </Container>
    </BaseLayout>
  );
}
