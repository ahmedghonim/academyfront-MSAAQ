import { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { RegisterForm } from "@/components/forms/auth";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = await getTranslations("auth");

  return generateCommonMetadata({
    title: t("register_new_account"),
    tenant: data,
    asPath: "/register"
  });
}

export default async function Page() {
  return (
    <BaseLayout>
      <Container layout="center">
        <RegisterForm />
      </Container>
    </BaseLayout>
  );
}
