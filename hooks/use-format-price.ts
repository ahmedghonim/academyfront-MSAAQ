"use client";

import { useMemo } from "react";

import { useTenant } from "@/components/store/TenantProvider";
import { useAppSelector } from "@/hooks";
import { AppSliceStateType } from "@/store/slices/app-slice";
import { IS_CLIENT } from "@/utils";

import useConvertCurrency from "./use-convert-currency";

interface FormatPriceReturnType {
  formatRawPrice: (
    amount: number,
    providedCurrency?: string | undefined,
    currencyDisplay?: "name" | "symbol"
  ) => string;
  formatRawPriceWithoutCurrency: (amount: number) => string;
  formatPlainPrice: (amount: number | string) => number;
  formatPrice: (
    amount: number,
    providedCurrency?: string | undefined,
    currencyDisplay?: "name" | "symbol",
    convertCurrency?: boolean
  ) => string;
  formatPriceWithoutCurrency: (amount: number) => string;
  currentCurrency: string;
  currentCurrencySymbol: string;
  currentCurrencyLocalizeSymbol: string;
  formatCurrency: (providedCurrency?: string | undefined) => string;
}

const useFormatPrice = (providedCurrency: string | undefined = undefined): FormatPriceReturnType => {
  const tenant = useTenant()((state) => state.tenant);
  const { academyCurrency, appLocale } = useAppSelector<AppSliceStateType>((state) => state.app);
  const defaultCurrency = tenant?.currency ?? "USD";

  const { currencies, convert } = useConvertCurrency();

  const getSelectedCurrency = () => {
    if (!IS_CLIENT || !tenant || !tenant.msaaqpay_enabled) {
      return defaultCurrency;
    }

    if (
      !currencies ||
      !currencies.length ||
      currencies.length < 2 ||
      currencies.every((c) => c.code === defaultCurrency)
    ) {
      return defaultCurrency;
    }

    const storedCurrency = academyCurrency || defaultCurrency;

    const currency = currencies.find((c) => c.code === storedCurrency);

    return currency?.code || storedCurrency;
  };

  const currency = useMemo(
    () => providedCurrency ?? getSelectedCurrency(),
    [providedCurrency, getSelectedCurrency, currencies]
  );

  const converter = (amount: number) => convert(defaultCurrency, currency, amount);

  let arabicCurrencies = ["AED", "SAR", "BHD", "EGP", "KWD", "OMR", "QAR"];
  let lang = appLocale === "ar" ? "ar-DZ" : "en-US";

  const newFormatter = (
    providedCurrency: string | undefined = undefined,
    currencyDisplay: "name" | "symbol" = "name",
    preferLang: string | undefined = undefined
  ) => {
    return new Intl.NumberFormat(preferLang ? preferLang : currencyDisplay === "symbol" ? "en-US" : lang, {
      style: "currency",
      currency: providedCurrency ?? currency ?? "USD",
      currencyDisplay,
      minimumFractionDigits: 0
    });
  };

  let formatter = newFormatter();

  const getCurrency = (formatter: Intl.NumberFormat) => {
    return formatter
      .formatToParts(0)
      .filter((part) => part.type === "currency")
      .map((part) => part.value)
      .join("");
  };

  return {
    //format amount as is without dividing it
    formatRawPrice: (
      amount: number,
      providedCurrency: string | undefined = undefined,
      currencyDisplay: "name" | "symbol" = "name"
    ) => {
      return newFormatter(providedCurrency, currencyDisplay ?? "name")
        .formatToParts(converter(amount ?? 0))
        .map((part) => {
          let v = part.value;

          switch (part.type) {
            case "decimal":
              v = lang === "ar-DZ" ? "." : v;
              break;
            case "group":
              v = lang === "ar-DZ" ? "," : v;
              break;
            default:
              v = part.value;
              break;
          }

          return v;
        })
        .join("");
    },
    //format amount as is without dividing it and without returning currency
    formatRawPriceWithoutCurrency: (amount: number) => {
      return formatter
        .formatToParts(converter(amount ?? 0))
        .filter((part) => part.type !== "currency")
        .map((part) => {
          let v = part.value;

          switch (part.type) {
            case "decimal":
              v = lang === "ar-DZ" ? "." : v;
              break;
            case "group":
              v = lang === "ar-DZ" ? "," : v;
              break;
            default:
              v = part.value;
              break;
          }

          return v;
        })
        .join("");
    },
    //format amount as is without returning currency or any decimals points like: 1000.00
    formatPlainPrice: (amount: number | string) => {
      const value = Number(amount);

      if (isNaN(value)) {
        return 0;
      }

      return value ? converter(value / 100) : 0;
    },
    formatPrice: (
      amount: number,
      providedCurrency: string | undefined = undefined,
      currencyDisplay: "name" | "symbol" = "name",
      convertCurrency: boolean = true
    ) => {
      return newFormatter(providedCurrency, currencyDisplay ?? "name")
        .formatToParts(amount ? (convertCurrency ? converter(amount / 100) : amount / 100) : 0)
        .map((part) => {
          let v = part.value;

          switch (part.type) {
            case "decimal":
              v = lang === "ar-DZ" ? "." : v;
              break;
            case "group":
              v = lang === "ar-DZ" ? "," : v;
              break;
            default:
              v = part.value;
              break;
          }

          return v;
        })
        .join("");
    },
    formatPriceWithoutCurrency: (amount: number) =>
      formatter
        .formatToParts(amount ? converter(amount / 100) : 0)
        .filter((part) => part.type !== "currency")
        .map((part) => {
          let v = part.value;

          switch (part.type) {
            case "decimal":
              v = lang === "ar-DZ" ? "." : v;
              break;
            case "group":
              v = lang === "ar-DZ" ? "," : v;
              break;
            default:
              v = part.value;
              break;
          }

          return v;
        })
        .join(""),
    currentCurrency: getCurrency(formatter),
    currentCurrencySymbol: getCurrency(newFormatter(undefined, "symbol")),
    currentCurrencyLocalizeSymbol: getCurrency(newFormatter(undefined, "symbol", appLocale)).substring(0, 3),
    formatCurrency: (providedCurrency: string | undefined = undefined) => {
      let formatter = newFormatter(providedCurrency);

      return getCurrency(formatter);
    }
  };
};

export default useFormatPrice;
