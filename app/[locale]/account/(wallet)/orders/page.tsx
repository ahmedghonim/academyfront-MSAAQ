import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

import OrdersData from "./orders-data";

export async function generateMetadata(): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations();

  return generateCommonMetadata({
    tenant: data,
    asPath: "/account/orders",
    title: t("wallet.title")
  });
}

export default async function Page() {
  return <OrdersData />;
}
