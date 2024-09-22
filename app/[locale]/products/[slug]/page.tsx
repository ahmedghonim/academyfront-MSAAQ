import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import { AddToCartButton, ExpressCheckoutButton } from "@/components/cart";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import {
  FileItem,
  FloatingActions,
  ProductBreadcrumbs,
  ProductImages,
  ProductPageLayout,
  ProductReviewsSection,
  ProductSectionCard,
  ProductSideCard
} from "@/components/product";
import { fetchProduct } from "@/server-actions/services/product-service";
import { fetchReviews, fetchReviewsDistribution } from "@/server-actions/services/reviews-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject, Product } from "@/types";
import { DownloadProductButton } from "@/ui/buttons";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { breadcrumbListJsonLd, productJsonLd } from "@/utils/jsonLd";

import { InformationCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { ArrowDownTrayIcon, LockClosedIcon, RectangleStackIcon } from "@heroicons/react/24/solid";

import { Button, Icon } from "@msaaqcom/abjad";

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata | null> {
  const data = await fetchTenant();
  const product = await fetchProduct({ slug });

  if (!data || !product) {
    return null;
  }

  return generateCommonMetadata({
    tenant: data,
    asPath: `/products/${slug}`,
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

  const product = await fetchProduct({ slug: params.slug });

  if (!product) {
    notFound();
  }

  const reviews = await fetchReviews({ limit: 3, relation_type: "product", relation_id: product.id });
  const reviewsDistribution = await fetchReviewsDistribution({ relation_type: "product", relation_id: product.id });

  const t = await getTranslations();

  return (
    <RootLayout
      className={`product-page product-page-${product.id}`}
      params={params}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              breadcrumbListJsonLd([
                { name: t("common.section_titles_home_page"), id: `https://${tenant?.domain}` },
                { name: t("common.section_titles_products"), id: `https://${tenant?.domain}/products` },
                { name: product?.title, id: `https://${tenant?.domain}/products/${product?.slug}` }
              ]),
              productJsonLd(product, tenant, product.avg_rating, product.review_count)
            ]
          })
        }}
      />
      <BaseLayout
        renderHeader={() => <Header />}
        renderFooter={() => <Footer />}
        renderMobileNavigation={() => <MobileNavigation />}
      >
        <Container>
          <ProductBreadcrumbs
            className="mb-4 text-gray-700 md:!mb-8"
            path="/products"
            pathLabel={t("common.section_titles_products")}
            title={product.title}
          />
          <ProductPageLayout sideCard={<ProductSideCard product={product} />}>
            <ProductImages product={product} />
            <ProductSectionCard
              title={t("product_page.description")}
              icon={<InformationCircleIcon />}
              children={
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.description
                  }}
                  className="prose"
                />
              }
              hasDivider
            />
            {!product.meta.custom_url && (
              <ProductSectionCard
                title={t("product_page.attachments")}
                icon={<RectangleStackIcon />}
                children={
                  <>
                    {product.attachments.map((attachment, i) => (
                      <FileItem
                        key={i}
                        title={attachment.file_name}
                        className="mb-4 rounded-2xl bg-white px-4 last:mb-0"
                        children={
                          <>
                            <DownloadProductButton
                              fileName={attachment.file_name}
                              filePath={`/products/${product.slug}/download/${attachment.uuid}`}
                              className="w-full md:!w-auto"
                              icon={
                                <Icon size="md">
                                  {product.can_download ? <ArrowDownTrayIcon /> : <LockClosedIcon />}
                                </Icon>
                              }
                              isDisabled={!product.can_download}
                              color={product.can_download ? "gray" : "primary"}
                              children={t("product_page.download_attachment")}
                            />
                          </>
                        }
                      />
                    ))}
                    {product.can_download && product.attachments.length > 1 && (
                      <DownloadProductButton
                        filePath={`/products/${product.slug}/download`}
                        fileName={product.title}
                        icon={
                          <Icon size="md">
                            <ArrowDownTrayIcon />
                          </Icon>
                        }
                        className="mt-6"
                        children={t("product_page.download_attachments")}
                      />
                    )}
                  </>
                }
                hasDivider
              />
            )}
            <ProductReviewsSection
              reviewsDistribution={reviewsDistribution.data}
              initialReviews={reviews}
              product={product}
              reviewsEnabled={product?.meta.reviews_enabled}
            />
          </ProductPageLayout>
        </Container>
        {product && (
          <FloatingActions
            product={product as Product}
            actions={
              product.can_download ? (
                product.meta.custom_url ? (
                  <Button
                    href={product.meta.custom_url}
                    target="_blank"
                    variant="solid"
                    color="primary"
                    className="w-full"
                    children={t("product_page.download_attachments")}
                  />
                ) : (
                  <DownloadProductButton
                    filePath={`/products/${product.slug}/download`}
                    fileName={product.title}
                    variant="solid"
                    color="primary"
                    className="w-full"
                    children={t("product_page.download_attachments")}
                  />
                )
              ) : (
                <div className="flex flex-wrap gap-4">
                  <ExpressCheckoutButton
                    className="shrink grow basis-auto break-words"
                    product_type="product"
                    product_id={product.id}
                    color="primary"
                    size="md"
                    variant="solid"
                    label={product.price == 0 ? t("common.get_it_for_free") : t("common.buy_now")}
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
                </div>
              )
            }
          />
        )}
      </BaseLayout>
    </RootLayout>
  );
}
