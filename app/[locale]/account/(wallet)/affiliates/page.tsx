import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import { fetchAffiliate } from "@/server-actions/services/affiliates-service";
import { fetchBankData, fetchCurrencies } from "@/server-actions/services/bank-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

import AffiliateData from "./affiliate-data";

export async function generateMetadata(): Promise<Metadata | null> {
  const data = await fetchTenant();

  if (!data) {
    return null;
  }

  const t = await getTranslations();

  return generateCommonMetadata({
    tenant: data,
    asPath: "/account/affiliates",
    title: t("wallet.title")
  });
}

export default async function Page() {
  const affiliate = await fetchAffiliate();

  if (!affiliate) {
    notFound();
  }

  const bankAccountData = await fetchBankData();

  if (!bankAccountData) {
    notFound();
  }
  const currencies = await fetchCurrencies();

  if (!currencies) {
    notFound();
  }

  return (
    <AffiliateData
      currencies={currencies.data}
      bankAccountData={bankAccountData}
      affiliate={affiliate}
    />
  );
}
