"use client";

import { forwardRef } from "react";

import { useTranslations } from "next-intl";

import { TenantLogo } from "@/ui/images";

import { CheckCircleIcon } from "@heroicons/react/24/solid";

import { Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

const CheckoutPageHeader = forwardRef<
  HTMLElement,
  {
    activeStep: "2" | "3";
    className?: any;
  }
>(({ activeStep, className }, ref) => {
  const t = useTranslations();

  return (
    <header
      ref={ref}
      className={cn("border-gray-400 bg-white px-6 py-0 md:border-b md:!px-8 md:!py-6", className)}
    >
      <div className="flex !flex-col !items-center justify-center gap-4 md:!flex-row md:!justify-between">
        <div className="hidden md:!block">
          <TenantLogo className="me-2 md:!me-6" />
        </div>
        <div className="ms-auto flex w-full items-center justify-between rounded-lg bg-gray-100 p-4">
          <div className="flex !flex-col items-center gap-x-1 lg:!flex-row">
            <Icon className="text-success">
              <CheckCircleIcon />
            </Icon>
            <Typography.Body
              size="sm"
              className="text-gray-700"
              children={t("shopping_cart.checkout_step_1")}
            />
          </div>
          <div className="flex !flex-col items-center gap-x-1 lg:!flex-row">
            {activeStep === "2" ? (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-sm text-white">
                2
              </div>
            ) : (
              <Icon className="text-success">
                <CheckCircleIcon />
              </Icon>
            )}
            <Typography.Body
              size="sm"
              className={cn(activeStep === "2" ? "" : "text-gray-700")}
              children={t("shopping_cart.checkout_step_2")}
            />
          </div>
          <div className="flex !flex-col items-center gap-x-1 lg:!flex-row">
            <div
              className={cn(
                activeStep === "3" ? "bg-gray-900" : "bg-gray-700",
                "flex h-5 w-5 items-center justify-center rounded-full text-sm text-white"
              )}
            >
              3
            </div>
            <Typography.Body
              size="sm"
              className={cn(activeStep === "3" ? "" : "text-gray-700")}
              children={t("shopping_cart.checkout_step_3")}
            />
          </div>
        </div>
      </div>
    </header>
  );
});

export default CheckoutPageHeader;
