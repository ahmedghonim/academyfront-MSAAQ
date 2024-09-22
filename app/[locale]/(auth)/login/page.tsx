import { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { LoginForm } from "@/components/forms/auth";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

export async function generateMetadata(): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations("auth");

  return generateCommonMetadata({
    title: t("welcome_back"),
    tenant: data,
    asPath: "/login"
  });
}

export default async function Page() {
  const tenant = await fetchTenant();

  const t = await getTranslations();

  return (
    <BaseLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("auth.welcome_back"),
            url: `https://${tenant?.domain}/login`
          })
        }}
      />
      <Container layout="center">
        <LoginForm />
      </Container>
    </BaseLayout>
  );
}
