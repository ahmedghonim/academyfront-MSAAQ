"use client";

import React, { useMemo } from "react";

import Image from "next/image";

import { useTranslations } from "next-intl";
import { components } from "react-select";

import AppMenu from "@/components/layout/menus/app-menu";
import { Select } from "@/components/select";
import { SocialLinks } from "@/components/social-links";
import { useTenant } from "@/components/store/TenantProvider";
import { useAppDispatch, useAppSelector, useConvertCurrency } from "@/hooks";
import { ProgressBarLink } from "@/providers/progress-bar";
import NelcIcon from "@/public/images/nelc-icon.svg";
import { AppSliceStateType, setAcademyCurrency } from "@/store/slices/app-slice";
import { TenantLogo } from "@/ui/images";
import { PaymentLogos } from "@/ui/images";
import AppStorage from "@/utils/AppStorage";

import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

import { Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

type FooterProps = {
  className?: string;
};

const Footer = ({ className }: FooterProps) => {
  const t = useTranslations();
  const tenant = useTenant()((state) => state.tenant);

  const { currencies } = useConvertCurrency();
  const { academyCurrency, appLocale } = useAppSelector<AppSliceStateType>((state) => state.app);
  const dispatch = useAppDispatch();

  const selectedCurrency = useMemo(
    () => currencies.find((currency) => currency.code === academyCurrency),
    [currencies, academyCurrency]
  );

  const hasLinks = useMemo(() => {
    return (
      tenant &&
      Object.entries(tenant.links)
        .map(([, value]) => value)
        .filter((link) => link !== null && link !== undefined && link !== "").length > 0
    );
  }, [tenant]);

  return (
    <footer className={cn("mt-16", className)}>
      <div className="footer-container w-full border-t-2 border-gray-200 px-8 py-12">
        <div className="footer-grid grid md:grid-cols-3">
          <div className="footer-branding mb-6 flex flex-col md:col-span-1 md:mb-0">
            <TenantLogo className="me-2 md:!me-6" />
            <div className="footer-info mt-6 flex flex-col gap-2">
              <Typography.Body size="md">{tenant?.title}</Typography.Body>
              <PaymentLogos
                bordered
                className="footer-payment-logos"
              />
              <Typography.Body size="md">
                {t("common.all_rights_reserved", {
                  year: new Date().getFullYear(),
                  title: tenant?.title
                })}
              </Typography.Body>
            </div>
          </div>
          <AppMenu
            menu={tenant?.menus.find((m) => m.location.includes("footer"))}
            className="footer-links grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2 md:grid-cols-3"
            location="footer"
          />
        </div>
      </div>
      <div className="footer-bottom flex flex-col-reverse items-start gap-4 border-t-2 border-gray-200 px-8 py-4 empty:hidden md:!flex-row md:!items-center md:gap-8">
        {!tenant?.meta?.unbranded && (
          <ProgressBarLink
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-gray-400 px-3 py-2 md:!w-fit"
            href={`https://msaaq.com?utm_source=${tenant?.domain}&utm_medium=poweredby&utm_campaign=AcademyFooter`}
            target="_blank"
            title="أنشئ موقعك التعليمي الخاص وابدأ بيع دوراتك التدريبية أونلاين - مساق"
          >
            <Typography.Body
              size="md"
              className="font-semibold"
            >
              {appLocale === "ar" ? "يعمل بواسطة" : "Powered by"}
            </Typography.Body>

            <Image
              src="https://cdn.msaaq.com/assets/images/logo/logo.svg"
              width="50"
              height="22"
              alt="أنشئ موقعك التعليمي الخاص وابدأ بيع دوراتك التدريبية أونلاين - مساق"
              style={{
                width: "50px",
                height: "22px"
              }}
            />
          </ProgressBarLink>
        )}
        {tenant?.tax_number && (
          <div className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-gray-400 px-3 py-2 md:!w-fit">
            <Icon
              size="md"
              color="primary"
            >
              <BuildingLibraryIcon />
            </Icon>
            <Typography.Body
              size="md"
              className="font-semibold"
            >
              {t("common.tax_number", {
                tax_number: tenant?.tax_number
              })}
            </Typography.Body>
          </div>
        )}

        {tenant?.nelc_compliant && (
          <div className="group flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-gray-400 px-4 md:!w-fit">
            <NelcIcon
              width={14}
              height={14}
              alt="nelc icon"
            />

            <Typography.Body
              size="md"
              className="block font-semibold lg:!hidden group-hover:lg:!block "
            >
              {t("common.nelc_compliant")}
            </Typography.Body>
          </div>
        )}
        {tenant?.msaaqpay_enabled && currencies.length > 1 && (
          <div className="currency-select w-full md:!w-fit">
            <Select
              isSearchable={false}
              classNames={{
                menu: () => "w-full md:!w-[200px]",
                control: () => "w-full md:!w-fit",
                dropdownIndicator: () => "!pl-3 !pr-0 !py-0",
                valueContainer: () => "!px-3 !flex"
              }}
              value={{
                label: selectedCurrency?.name,
                value: selectedCurrency?.code,
                ...selectedCurrency
              }}
              rounded
              onChange={(event) => {
                AppStorage.setItem("currency", event.value);
                dispatch(setAcademyCurrency(event.value));
              }}
              options={currencies.map((currency) => ({
                label: t(`currencies.${currency.code.toLowerCase()}`),
                value: currency.code,
                ...currency
              }))}
              components={{
                DropdownIndicator: (props): any => {
                  const { menuIsOpen } = props.selectProps;

                  return components.DropdownIndicator({
                    ...props,
                    children: (
                      <Icon
                        size="sm"
                        className={`${
                          menuIsOpen ? "rotate-0 transform" : "rotate-180"
                        }   text-black transition-transform duration-300 ease-in-out`}
                        children={<ChevronUpIcon />}
                      />
                    )
                  });
                },
                Option: (props) => (
                  <components.Option {...props}>
                    <div className="flex items-center gap-2">
                      <div
                        style={
                          props.data.country_code
                            ? {
                                backgroundImage: `url(https://cdn.msaaq.com/assets/flags/${props.data.country_code?.toLowerCase()}.svg)`
                              }
                            : {}
                        }
                        className="h-5 w-7 rounded bg-cover bg-center bg-no-repeat"
                      />
                      <span>{props.data.label}</span>
                    </div>
                  </components.Option>
                ),
                SingleValue: (props) => (
                  <components.SingleValue {...props}>
                    <div className="flex items-center gap-2">
                      <div
                        style={
                          props.data.country_code
                            ? {
                                backgroundImage: `url(https://cdn.msaaq.com/assets/flags/${props.data.country_code?.toLowerCase()}.svg)`
                              }
                            : {}
                        }
                        className="h-5 w-7 rounded bg-cover bg-center bg-no-repeat"
                      />
                      <span
                        dangerouslySetInnerHTML={{
                          __html: props.data.symbol
                        }}
                      />
                    </div>
                  </components.SingleValue>
                )
              }}
            />
          </div>
        )}

        {tenant && hasLinks && (
          <div className="footer-social-links mx-auto md:!me-0 md:!ms-auto">{<SocialLinks links={tenant.links} />}</div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
