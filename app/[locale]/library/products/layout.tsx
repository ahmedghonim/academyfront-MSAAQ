import React from "react";

import { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

export async function generateMetadata(): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations();

  return generateCommonMetadata({
    tenant: data,
    asPath: "/library/products",
    title: t("common.my_library") as string
  });
}

export default function Layout({
  children,
  productsData
}: {
  children: React.ReactNode;
  productsData: React.ReactNode;
}) {
  return (
    <BaseLayout
      className="library-products"
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
      renderMobileNavigation={() => <MobileNavigation />}
    >
      <Container>
        {children}
        {productsData}
      </Container>
    </BaseLayout>
  );
}
