import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import CheckoutHeader from "@/components/checkout/checkout-page-header";
import ThankYouLayout from "@/components/checkout/thank-you-layout";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import CartByUuidProvider from "@/components/store/cart-by-uuid-provider";
import { fetchCartByUUID } from "@/server-actions/services/cart-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

export async function generateMetadata({
  params: { locale, uuid }
}: {
  params: { locale: string; uuid: string };
}): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations("thank_you_page");

  return generateCommonMetadata({
    tenant: data,
    asPath: `/cart/${uuid}/thank-you`,
    title: t("title")
  });
}

export default async function Page({
  params: { uuid }
}: {
  params: {
    uuid: string;
  };
}) {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }

  const data = await fetchCartByUUID(uuid);

  if (!data) {
    notFound();
  }

  return (
    <BaseLayout
      classNames={{
        layout: "my-0 h-screen overflow-x-hidden"
      }}
    >
      <CheckoutHeader activeStep={"3"} />
      <Container
        layout="center"
        className="my-10 flex flex-col justify-center"
      >
        <CartByUuidProvider
          payload={data.payload}
          cart={data.cart}
        >
          <ThankYouLayout />
        </CartByUuidProvider>
      </Container>
    </BaseLayout>
  );
}
