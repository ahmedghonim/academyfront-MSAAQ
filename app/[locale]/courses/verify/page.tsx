import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import BaseLayout from "@/components/layout/base-layout";
import RootLayout from "@/components/layout/root-layout";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

import VerifyForm from "./verify-form";

export async function generateMetadata(): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations("verify_certificate");

  return generateCommonMetadata({
    tenant: data,
    asPath: "/verify",
    title: t("title")
  });
}

export default async function Page({ params }: { params: { locale: string } }) {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }
  const t = await getTranslations();

  return (
    <RootLayout params={params}>
      <BaseLayout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: t("verify_certificate:title"),
              description: t("verify_certificate:description"),
              publisher: {
                "@type": "Organization",
                name: tenant?.title,
                logo: {
                  "@type": "ImageObject",
                  url: tenant?.logo
                }
              }
            })
          }}
        />
        <div className="flex h-screen items-center justify-center">
          <VerifyForm />
        </div>
      </BaseLayout>
    </RootLayout>
  );
}
