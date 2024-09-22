import { Suspense } from "react";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";
import { ErrorBoundary } from "react-error-boundary";

import { ActiveAppointments, Consultants, SessionSideCard } from "@/components/coaching-sessions";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import {
  FloatingActions,
  OtherProducts,
  OtherProductsLoading,
  ProductBreadcrumbs,
  ProductImages,
  ProductPageLayout,
  ProductReviews,
  ProductReviewsLoading,
  ProductSectionCard
} from "@/components/product";
import { fetchAppointments } from "@/server-actions/services/appointment-service";
import { fetchProduct } from "@/server-actions/services/product-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject, AppointmentStatus, Product, ProductType } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

import { InformationCircleIcon, UserGroupIcon } from "@heroicons/react/24/outline";

import { Alert, Button, Typography } from "@msaaqcom/abjad";

const FallbackComponent = () => {
  return <div></div>;
};

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata | null> {
  const data = await fetchTenant();
  const product = await fetchProduct({
    slug,
    filters: {
      type: ProductType.COACHING_SESSION
    }
  });

  if (!data || !product) {
    return null;
  }

  return generateCommonMetadata({
    tenant: data,
    asPath: `/coaching-sessions/${slug}`,
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
    slug: params.slug as string,
    filters: {
      type: ProductType.COACHING_SESSION
    }
  });

  if (!product) {
    notFound();
  }

  const appointments = await fetchAppointments({
    filters: {
      product: product.id
    }
  });

  const pendingAppointments = appointments.data?.filter(
    (appointment) => appointment.status === AppointmentStatus.PENDING
  );

  const restAppointments = appointments.data.filter((appointment) => appointment.status !== AppointmentStatus.PENDING);

  const t = await getTranslations();

  return (
    <RootLayout
      className={`coaching-session-page coaching-session-page-${product?.id}`}
      params={params}
    >
      <BaseLayout
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
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      item: {
                        name: t("common.section_titles_home_page"),
                        "@id": `${tenant?.domain}`
                      }
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      item: {
                        name: t("common.section_titles_sessions"),
                        "@id": `${tenant?.domain}/coaching-sessions`
                      }
                    },
                    {
                      "@type": "ListItem",
                      position: 3,
                      item: {
                        name: product?.title,
                        "@id": `${tenant?.domain}/coaching-sessions/${product?.slug}`
                      }
                    }
                  ]
                },
                {
                  "@id": `${tenant?.domain}/products/${product?.slug}`,
                  url: `${tenant?.domain}/products/${product?.slug}`,
                  "@type": "Product",
                  image: product?.thumbnail,
                  name: product?.title,
                  description: product?.summary,
                  offers: {
                    "@type": "AggregateOffer",
                    availability: "https://schema.org/InStock",
                    priceCurrency: tenant?.currency,
                    highPrice: product?.sales_price
                      ? product?.sales_price / 100
                      : product?.price
                      ? product?.price / 100
                      : 0,
                    lowPrice: product?.price ? product?.price / 100 : 0
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: product.avg_rating,
                    reviewCount: product.review_count
                  }
                }
              ]
            })
          }}
        />
        <Container>
          <ProductBreadcrumbs
            className="mb-4 text-gray-700 md:!mb-8"
            path="/products"
            pathLabel={t("common.section_titles_sessions")}
            title={product.title}
          />
          <ProductPageLayout
            sideCard={
              <SessionSideCard
                pendingAppointments={pendingAppointments}
                product={product}
              />
            }
          >
            <ProductImages product={product} />
            <ActiveAppointments
              product={product}
              appointments={restAppointments}
            />
            {product.consultants && (
              <ProductSectionCard
                title={t("sessions.advisers")}
                icon={<UserGroupIcon />}
                children={<Consultants consultants={product.consultants} />}
                hasDivider
              />
            )}
            <ProductSectionCard
              title={t("sessions.session_description")}
              icon={<InformationCircleIcon />}
              children={
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.description
                  }}
                  className="prose-sm prose prose-stone sm:prose-base h-full max-w-full"
                />
              }
            />
            <Suspense fallback={<ProductReviewsLoading />}>
              <ErrorBoundary fallback={<FallbackComponent />}>
                <ProductReviews
                  reviewsArgs={{ limit: 3, relation_type: "product", relation_id: product.id }}
                  reviewsDistributionArgs={{
                    relation_type: "product",
                    relation_id: product.id
                  }}
                  reviewsEnabled={product.meta.reviews_enabled}
                  product={product}
                />
              </ErrorBoundary>
            </Suspense>
          </ProductPageLayout>
          <Suspense fallback={<OtherProductsLoading type="product" />}>
            <ErrorBoundary fallback={<FallbackComponent />}>
              <OtherProducts
                slug={params.slug}
                type="product"
              />
            </ErrorBoundary>
          </Suspense>
        </Container>
        {product && (
          <FloatingActions
            product={product as Product}
            actions={
              pendingAppointments && pendingAppointments.length > 0 ? (
                <>
                  <Alert
                    variant="soft"
                    color="info"
                    className="mb-4"
                  >
                    <Typography.Text
                      size="sm"
                      className="font-bold text-gray-950"
                    >
                      {t.rich("sessions:pending_session_alert", { count: pendingAppointments.length })}
                    </Typography.Text>
                  </Alert>
                  <Button
                    href={`/coaching-sessions/${product.slug}/${pendingAppointments[0].id}/booking-details`}
                    className="w-full"
                  >
                    {t("common.confirm_session")}
                  </Button>
                </>
              ) : (
                <Button
                  href={`/coaching-sessions/${product.slug}/booking-details`}
                  className="w-full"
                >
                  {product.can_download ? t("sessions.book_new_session") : t("common.book_it_for_free")}
                </Button>
              )
            }
          />
        )}
      </BaseLayout>
    </RootLayout>
  );
}
