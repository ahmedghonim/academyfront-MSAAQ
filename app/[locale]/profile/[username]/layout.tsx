import React from "react";

import { Metadata } from "next";
import { notFound } from "next/navigation";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import { fetchInstructor } from "@/server-actions/services/instructor-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { profilePageJsonLd } from "@/utils/jsonLd";

export async function generateMetadata({
  params: { username }
}: {
  params: { locale: string; username: string };
}): Promise<Metadata | null> {
  const data = await fetchTenant();
  const mentor = await fetchInstructor({ id: username });

  if (!data || !mentor) {
    return null;
  }

  return generateCommonMetadata({
    tenant: data,
    asPath: `/@${username}`,
    title: mentor.name
  });
}

export default async function Layout({
  children,
  params,
  courses,
  products,
  sessions,
  articles
}: {
  children: React.ReactNode;
  courses: React.ReactNode;
  products: React.ReactNode;
  sessions: React.ReactNode;
  articles: React.ReactNode;
  params: AnyObject;
}) {
  const mentor = await fetchInstructor({ id: params.username });
  const tenant = await fetchTenant();

  if (!mentor) {
    notFound();
  }

  return (
    <RootLayout params={params}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            ...profilePageJsonLd(mentor, tenant)
          })
        }}
      />
      <BaseLayout
        className={`instructor-page instructor-${mentor.id}`}
        renderHeader={() => <Header />}
        renderFooter={() => <Footer />}
        renderMobileNavigation={() => <MobileNavigation />}
      >
        <Container>
          {children}
          <div className="my-4 h-px bg-gray-400" />
          <div className="content-section flex flex-col space-y-4">
            {courses}
            {products}
            {sessions}
            {articles}
          </div>
        </Container>
      </BaseLayout>
    </RootLayout>
  );
}
