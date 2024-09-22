import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

import AccountData from "./account-data";

export async function generateMetadata(): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations();

  return generateCommonMetadata({
    tenant: data,
    asPath: `/account`,
    title: t("profile.title")
  });
}

export default async function Page() {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }

  const t = await getTranslations();

  return (
    <BaseLayout
      className="account"
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
      renderMobileNavigation={() => <MobileNavigation />}
    >
      <Container layout="center">
        <h1 className="-mx-4 block border-b border-gray-400 px-4 pb-6 text-2xl font-medium text-black md:mx-0 md:!border-b-0 md:!px-0 md:pb-8">
          {t("profile.title")}
        </h1>
        <AccountData />
      </Container>
    </BaseLayout>
  );
}
