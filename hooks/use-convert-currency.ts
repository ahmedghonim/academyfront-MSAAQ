"use client";

import { useMemo } from "react";

import { useTenant } from "@/components/store/TenantProvider";
import { App, AppSlug } from "@/types";

const useConvertCurrency = () => {
  const tenant = useTenant()((state) => state.tenant);
  const currencies = useMemo(
    () => (tenant?.apps.find((a) => a.slug === AppSlug.Msaaqpay) as App<AppSlug.Msaaqpay>)?.currencies ?? [],
    [tenant]
  );

  const convert = (from: string, to: string, amount: number) => {
    if (from === to) {
      return amount;
    }

    if (!tenant || !tenant.msaaqpay_enabled) {
      return amount;
    }

    if (!currencies || !currencies.length) {
      return amount;
    }

    const f = currencies.find((c) => c.code === from);

    const t = currencies.find((c) => c.code === to);

    if (!f || !t) {
      return amount;
    }

    const from_rate = f.rate;
    const to_rate = t?.rate ?? f.rate;
    const rate = from_rate / to_rate;

    return amount * rate;
  };

  return { convert, currencies };
};

export default useConvertCurrency;
