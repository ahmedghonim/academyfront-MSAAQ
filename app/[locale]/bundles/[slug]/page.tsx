import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import { BundleCard, BundleItems, MetaGrid } from "@/components/bundle";
import { AddToCartButton, ExpressCheckoutButton } from "@/components/cart";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import { FloatingActions, ProductBreadcrumbs, ProductSectionCard } from "@/components/product";
import { fetchProduct } from "@/server-actions/services/product-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject, Product, ProductType } from "@/types";
import { Thumbnail } from "@/ui/images";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { breadcrumbListJsonLd, bundleJsonLd } from "@/utils/jsonLd";

import { InformationCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

import { Button, Icon } from "@msaaqcom/abjad";

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata | null> {
  const data = await fetchTenant();
  const product = await fetchProduct({
    slug,
    filters: {
      type: ProductType.BUNDLE
    }
  });

  if (!data || !product) {
    return null;
  }

  return generateCommonMetadata({
    tenant: data,
    asPath: `/bundles/${slug}`,
    title: product.title,
    description: product.meta_description,
    keywords: product.meta_keywords,
    image: product.thumbnail
  });
}

export default async function Page({ params }: { params: AnyObject }) {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }

  const product = await fetchProduct({
    slug: params.slug,
    filters: {
      type: ProductType.BUNDLE
    }
  });

  if (!product) {
    notFound();
  }

  const t = await getTranslations();

  return (
    <RootLayout
      className={`bundle-page bundle-page-${product?.id}`}
      params={params}
    >
      <BaseLayout
        renderHeader={() => <Header />}
        renderFooter={() => <Footer />}
        renderMobileNavigation={() => <MobileNavigation />}
      >
        <Container>
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
                    {
                      name: t("common.section_titles_products"),
                      id: `https://${tenant?.domain}/products`
                    },
                    {
                      name: product.title as string,
                      id: `https://${tenant?.domain}/products/${product.slug}`
                    }
                  ]),
                  bundleJsonLd(product, tenant)
                ]
              })
            }}
          />
          <ProductBreadcrumbs
            className="mb-6 text-gray-700"
            path="/products"
            pathLabel={t("common.section_titles_products")}
            title={product.title}
          />
          {product.thumbnail && (
            <div className="mb-8 h-[508px]">
              <Thumbnail
                bordered={false}
                alt={product.title}
                src={product.thumbnail}
                rounded="none"
                className="!absolute left-0 h-[508px] w-full"
              />
            </div>
          )}
          <div className="flex flex-col gap-y-8">
            <BundleCard product={product} />
            <MetaGrid product={product} />
            <ProductSectionCard
              align="center"
              vertical
              title={t("bundle_page.description")}
              icon={<InformationCircleIcon />}
              children={
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.description
                  }}
                  className="prose max-w-full"
                />
              }
              hasDivider
              dividerPosition="top"
              className="!px-8 !py-12"
            />
            <BundleItems product={product} />
          </div>
        </Container>
        {product && (
          <FloatingActions
            product={product as Product}
            actions={
              <div className="flex flex-wrap items-center gap-4">
                {product.can_download ? (
                  <Button
                    variant="solid"
                    color="gray"
                    size="md"
                    className="shrink grow basis-auto break-words"
                    href="/library/courses"
                  >
                    {t("common.to_library")}
                  </Button>
                ) : (
                  <>
                    <ExpressCheckoutButton
                      className="shrink grow basis-auto break-words"
                      product_type="product"
                      product_id={product.id}
                      color="primary"
                      size="md"
                      variant="solid"
                      label={product.price == 0 ? t("common.get_collection_for_free") : t("common.buy_now")}
                    />
                    <AddToCartButton
                      product={product}
                      product_type="product"
                      product_id={product.id}
                      color="gray"
                      size="md"
                      icon={
                        <Icon>
                          <ShoppingCartIcon />
                        </Icon>
                      }
                    />
                  </>
                )}
              </div>
            }
          />
        )}
      </BaseLayout>
    </RootLayout>
  );
}
