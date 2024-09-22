import { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { ResetTokenPasswordForm } from "@/components/forms/auth";
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
    title: t("set_new_password"),
    tenant: data,
    asPath: "/password/reset/[token]?email=[email]"
  });
}

export default async function Page() {
  return (
    <BaseLayout>
      <Container layout="center">
        <ResetTokenPasswordForm />
      </Container>
    </BaseLayout>
  );
}
