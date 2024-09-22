import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import EmptyCard from "@/app/[locale]/search/empty-card";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import { ProductBreadcrumbs, ProductsSectionCard } from "@/components/product";
import { fetchProducts } from "@/server-actions/services/product-service";
import { fetchTaxonomy } from "@/server-actions/services/taxonomy-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { breadcrumbListJsonLd, productJsonLd, searchActionJsonLd } from "@/utils/jsonLd";

export async function generateMetadata({
  params: { slug, locale }
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata | null> {
  const data = await fetchTenant();
  const taxonomy = await fetchTaxonomy(slug);

  if (!data || !taxonomy) {
    return null;
  }

  const t = await getTranslations();

  return generateCommonMetadata({
    tenant: data,
    asPath: `/products/categories/${slug}`,
    title: t("common.taxonomy_products", {
      taxonomy: taxonomy.name
    }) as string
  });
}

export default async function Page({ params }: { params: AnyObject }) {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }

  const taxonomy = await fetchTaxonomy(params.slug);

  if (!taxonomy) {
    notFound();
  }

  const filters = {
    limit: 12,
    filters: {
      category: params.slug as string
    },
    page: 1
  };
  const products = await fetchProducts(filters);

  const t = await getTranslations();

  const isEmpty = products?.data.length === 0;

  return (
    <RootLayout params={params}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t("common:taxonomy_blog", {
              taxonomy: taxonomy?.name
            }) as string,
            description: taxonomy?.description || undefined,
            url: `https://${tenant?.domain}/categories/${taxonomy?.slug}`,
            breadcrumb: breadcrumbListJsonLd([
              { name: t("common.section_titles_home_page"), id: `https://${tenant.domain}` },
              { name: t("common.section_titles_products"), id: `https://${tenant.domain}/blog` },
              {
                name: taxonomy?.name as string,
                id: `https://${tenant.domain}/categories/${taxonomy.slug}`
              }
            ]),
            mainEntity:
              products?.data && products.data.length > 0
                ? {
                    "@type": "ItemList",
                    itemListElement: products?.data.map((product, i) => ({
                      "@type": "ListItem",
                      position: i + 1,
                      item: productJsonLd(product, tenant)
                    }))
                  }
                : undefined,
            potentialAction: searchActionJsonLd(tenant)
          })
        }}
      />
      <BaseLayout
        className={`product-category${taxonomy.id}`}
        renderHeader={() => <Header />}
        renderFooter={() => <Footer />}
        renderMobileNavigation={() => <MobileNavigation />}
      >
        <Container>
          <ProductBreadcrumbs
            className="mb-4 text-gray-700 md:!mb-8"
            path="/products"
            pathLabel={t("common.section_titles_products")}
            title={taxonomy.name}
          />
          {isEmpty ? (
            <EmptyCard title={t("empty_sections.no_products")} />
          ) : (
            <ProductsSectionCard
              title={
                t("common.taxonomy_products", {
                  taxonomy: taxonomy.name
                }) as string
              }
              initialProducts={products}
              initialFilters={filters}
              columns={{
                md: 3
              }}
            />
          )}
        </Container>
      </BaseLayout>
    </RootLayout>
  );
}
