import React from "react";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import { fetchProduct } from "@/server-actions/services/product-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject, ProductType } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

import BookingDetailsComp from "./booking-details-comp";

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
    asPath: `/coaching-sessions/${slug}/booking-details`,
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
      type: ProductType.COACHING_SESSION
    }
  });

  if (!product) {
    notFound();
  }

  const t = await getTranslations();

  return (
    <RootLayout params={params}>
      <BaseLayout
        renderHeader={() => <Header />}
        renderFooter={() => <Footer />}
        renderMobileNavigation={() => <MobileNavigation />}
      >
        <Container>
          <BookingDetailsComp
            product={product}
            label={t("sessions.confirm_booking")}
          />
        </Container>
      </BaseLayout>
    </RootLayout>
  );
}
