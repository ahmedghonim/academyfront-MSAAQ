"use client";

import React, { ReactNode, createContext, useCallback, useEffect } from "react";

import * as Sentry from "@sentry/nextjs";
import { getCookie, setCookie } from "cookies-next";
import { useLocale, useTranslations } from "next-intl";
import { setLocale } from "yup";

import { CompleteProfileModal } from "@/components/modals";
import { useTenant } from "@/components/store/TenantProvider";
import { useConvertCurrency, useProfileCompleteStatus } from "@/hooks";
import { useAppDispatch } from "@/hooks";
import dayjs from "@/lib/dayjs";
import { useSession } from "@/providers/session-provider";
import {
  setAcademyCurrency,
  setAccessToken,
  setCompletedProfilePercentage,
  setDefaultCurrency,
  setOpenCompleteProfileModal
} from "@/store/slices/app-slice";
import AppStorage from "@/utils/AppStorage";

interface ProviderProps {
  children: ReactNode;
}

const AppContext = createContext({});

const AppProvider: React.FC<ProviderProps> = ({ children }) => {
  const lang = useLocale();
  const t = useTranslations();

  const { tenant, ipInfo } = useTenant()((state) => state);

  const { profileRequiredFieldsCompleted, profileFieldsCompleted } = useProfileCompleteStatus();
  const { member, token } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setAccessToken(token));
    } else {
      dispatch(setAccessToken(""));
    }
  }, [token, dispatch, setAccessToken]);
  useEffect((): void => {
    dayjs.locale(lang);
  }, [lang]);

  useEffect((): void => {
    dayjs.locale(lang);
  }, [lang]);

  setLocale({
    mixed: {
      default: t("validation.field_invalid"),
      required: t("validation.field_required"),
      oneOf: ({ values }) => t("validation.field_one_of", { values: values.join(", ") })
    },
    array: {
      min: ({ min }) => t("validation.field_min_items", { min }),
      max: ({ max }) => t("validation.field_max_items", { max })
    },
    string: {
      matches: t("validation.field_invalid_format"),
      min: ({ min }) => t("validation.field_min_length", { min }),
      email: t("validation.field_must_be_valid_email")
    },
    number: {
      min: ({ min }) => t("validation.field_number_min_length", { min }),
      max: ({ max }) => t("validation.field_number_max_length", { max })
    }
  });

  useEffect(() => {
    if (profileFieldsCompleted) {
      dispatch(setCompletedProfilePercentage(100));
    } else {
      dispatch(setCompletedProfilePercentage(60));
    }
  }, [profileFieldsCompleted, member, tenant, dispatch, setCompletedProfilePercentage]);

  const showCompleteProfileModal = useCallback(
    (path: string) => {
      if (path.startsWith("/cart")) {
        return;
      }

      if (!member || !tenant) {
        return;
      }

      if (profileRequiredFieldsCompleted) {
        return;
      }

      dispatch(setOpenCompleteProfileModal(true));
    },
    [dispatch, setOpenCompleteProfileModal, profileRequiredFieldsCompleted, member, tenant]
  );

  useEffect(() => {
    showCompleteProfileModal("");
  }, [dispatch, setOpenCompleteProfileModal, profileRequiredFieldsCompleted, member]);

  const { currencies } = useConvertCurrency();

  const setupCurrency = () => {
    if (!tenant) {
      return;
    }

    dispatch(setDefaultCurrency(tenant.currency));

    let country = getCookie("forced_country") ?? getCookie("current_country");

    if (!country && ipInfo) {
      country = ipInfo.countryCode ?? "sa";
      setCookie("current_country", country, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
      });
    }

    let currency = currencies.find((currency) => currency.country_code === country)?.code;

    if (!currency) {
      currency = tenant.currency;
    }

    dispatch(setAcademyCurrency(AppStorage.getItem("currency") ?? currency));
  };

  useEffect(() => {
    setupCurrency();

    const disableFunction = (e: any) => {
      e.preventDefault();

      return false;
    };

    const disableScreenshot = (e: any) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();

        return false;
      }
    };

    const disableScreenshotForMobile = (e: any) => {
      if (e.touches.length > 1) {
        e.preventDefault();

        return false;
      }
    };

    if (tenant) {
      const disable_text_copy = tenant.meta.disable_text_copy;
      const disable_screenshot = tenant.meta.disable_screenshot;

      if (disable_text_copy) {
        // disable text copy and text selection
        document.addEventListener("copy", disableFunction);

        document.addEventListener("selectstart", disableFunction);

        document.addEventListener("contextmenu", disableFunction);
      }

      if (disable_screenshot) {
        // disable screenshot
        document.addEventListener("keydown", disableScreenshot);

        // disable screenshot for mobile
        document.addEventListener("touchstart", disableScreenshotForMobile, false);

        // disable screenshot for iphone
        document.addEventListener("gesturestart", disableFunction);
      }
    }

    return () => {
      document.removeEventListener("copy", disableFunction);
      document.removeEventListener("selectstart", disableFunction);
      document.removeEventListener("contextmenu", disableFunction);
      document.removeEventListener("keydown", disableScreenshot);
      document.removeEventListener("touchstart", disableScreenshotForMobile);
      document.removeEventListener("gesturestart", disableFunction);
    };
  }, [tenant, ipInfo]);

  useEffect(() => {
    if (tenant) {
      try {
        const host = window.location.host;
        const env = process.env.NODE_ENV;

        if (env === "production" && tenant.domain !== host) {
          window.location.href = `https://${tenant.domain}${window.location.pathname}`;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Error redirecting to tenant domain", e);
      }
    }
  }, [tenant]);

  useEffect(() => {
    if (!member || !member?.id) {
      return;
    }

    Sentry.setUser({
      id: member.id.toString(),
      email: member.email
    });
  }, [member]);

  return (
    <AppContext.Provider value={{}}>
      {children}
      <CompleteProfileModal />
    </AppContext.Provider>
  );
};

export { AppProvider };
