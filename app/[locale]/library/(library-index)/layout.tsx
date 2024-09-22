import React from "react";

import { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

export async function generateMetadata(): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations();

  return generateCommonMetadata({
    tenant: data,
    asPath: "/library",
    title: t("common.my_library")
  });
}

export default function Layout({
  children,
  upcomingAppointments,
  memberStats,
  memberAssignmentsQuizzes
}: {
  children: React.ReactNode;
  upcomingAppointments: React.ReactNode;
  memberStats: React.ReactNode;
  memberAssignmentsQuizzes: React.ReactNode;
  params: AnyObject;
}) {
  return (
    <BaseLayout
      className="library"
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
      renderMobileNavigation={() => <MobileNavigation />}
    >
      <Container>
        {children}
        {upcomingAppointments}
        {memberStats}
        {memberAssignmentsQuizzes}
      </Container>
    </BaseLayout>
  );
}
