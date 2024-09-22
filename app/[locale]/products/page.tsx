import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import { MarketProvider } from "@/providers/store-market-provider";
import { fetchProducts } from "@/server-actions/services/product-service";
import { fetchTaxonomies } from "@/server-actions/services/taxonomy-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { breadcrumbListJsonLd, productJsonLd } from "@/utils/jsonLd";

import Breadcrumbs from "./breadcrumbs";
import ProductsListing from "./products-listing";

export async function generateMetadata(): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations();

  return generateCommonMetadata({
    tenant: data,
    asPath: "/products",
    title: t("common.section_titles_products") as string
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

  type NestedObject = { [key: string]: any };

  const { hasOwnProperty } = Object.prototype;

  function unflatten(obj: { [key: string]: any }): NestedObject {
    const result: NestedObject = {};

    for (const key in obj) {
      if (!hasOwnProperty.call(obj, key)) {
        continue;
      }

      const keys = key.replace(/\]/g, "").split(/\[/);
      let current = result;

      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          if (Array.isArray(current)) {
            current.push(obj[key]);
          } else {
            current[k] = obj[key];
          }
        } else {
          if (!current[k]) {
            current[k] = isNaN(Number(keys[index + 1])) ? {} : [];
          }
          current = current[k];
        }
      });
    }

    return result;
  }

  const products = await fetchProducts({
    limit: 1,
    ...searchParams
  });

  const taxonomies = await fetchTaxonomies({
    filters: {
      type: "product_category"
    }
  });

  return (
    <RootLayout params={params}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              breadcrumbListJsonLd([
                { name: t("common:section_titles_home_page"), id: `https://${tenant?.domain}` },
                { name: t("common:all_products"), id: `https://${tenant?.domain}/products` }
              ]),
              ...[
                products?.data && products?.data.length > 0
                  ? {
                      "@type": "ItemList",
                      itemListElement: products?.data.map((product, i) => ({
                        "@type": "ListItem",
                        position: i + 1,
                        item: productJsonLd(product, tenant)
                      }))
                    }
                  : {}
              ]
            ]
          })
        }}
      />
      <BaseLayout
        className="products-page"
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
                    name: t("common.section_titles_home_page"),
                    id: `https://${tenant?.domain}`
                  },
                  { name: t("common.all_products"), id: `https://${tenant?.domain}/products` }
                ]),
                ...[
                  products && products.data.length > 0
                    ? {
                        "@type": "ItemList",
                        itemListElement: products.data.map((product, i) => ({
                          "@type": "ListItem",
                          position: i + 1,
                          item: productJsonLd(product, tenant)
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
          <h1 className="mb-8 text-4xl font-bold text-black">{t("store.all_products")}</h1>
          <div className="grid gap-8">
            <MarketProvider taxonomies={taxonomies.data}>
              <ProductsListing
                initialProducts={products}
                initialFilters={unflatten(searchParams).filters}
              />
            </MarketProvider>
          </div>
        </Container>
      </BaseLayout>
    </RootLayout>
  );
}
