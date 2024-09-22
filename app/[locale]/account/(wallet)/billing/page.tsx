import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

import BillingData from "./billing-data";

export async function generateMetadata(): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations();

  return generateCommonMetadata({
    tenant: data,
    asPath: "/account/billing",
    title: t("wallet.title")
  });
}

export default async function Page() {
  return <BillingData />;
}
