import { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { ResetPasswordForm } from "@/components/forms/auth";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations("auth");

  return generateCommonMetadata({
    title: t("did_you_forget_your_password"),
    tenant: data,
    asPath: "/password/reset"
  });
}

export default async function Page() {
  return (
    <BaseLayout>
      <Container layout="center">
        <ResetPasswordForm />
      </Container>
    </BaseLayout>
  );
}
