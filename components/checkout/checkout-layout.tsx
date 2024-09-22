"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { useTranslations } from "next-intl";

import EmptyState from "@/components/empty-state";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import { useCart } from "@/components/store/CartProvider";
import { useTenant } from "@/components/store/TenantProvider";
import { useAppSelector, useFormatPrice, useToast } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { App, AppSlug } from "@/types";
import { canUseTamara } from "@/utils";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/solid";

import { Button, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import CheckoutHeader from "./checkout-page-header";
import DesktopCartItems from "./desktop-cart-items";
import FreeCheckout from "./free-checkout";
import MobileCartItems from "./mobile-cart-items";
import MsaaqPayPaymentGateways from "./msaaq-pay-payment-gateways";
import PaymentMethodsOther from "./other-payment-gateways";

const CheckoutAnimation = dynamic(() => import("../cart/checkout-animation").then((mod) => mod), {
  ssr: false
});

const CheckoutLayout = () => {
  const t = useTranslations();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const searchParams = useSearchParams();

  const tenant = useTenant()((state) => state.tenant);
  const cart = useCart()((state) => state.cart);
  const { checkoutProcessing } = useAppSelector((state) => state.checkout);
  const { member } = useSession();
  const { formatPlainPrice } = useFormatPrice();

  const getApp = useCallback((slug: AppSlug) => tenant?.apps?.find((app) => app.slug === slug), [tenant]);

  const isMoreThanOnePaymentMethodAvailable = useMemo(() => {
    const apps = tenant?.apps ?? [];
    const availableApps = apps.filter((app) => app.category && app.category === "payment");

    return availableApps.length > 1;
  }, [tenant]);

  const isCartEmpty = cart && cart.items.length === 0;

  const useTamara = useMemo(() => canUseTamara(), []);
  const [toast] = useToast();

  useEffect(() => {
    if (searchParams && searchParams.get("error")) {
      toast.error({
        message: searchParams.get("error")
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [headerRef, headerRef.current, setHeaderHeight]);

  useEffect(() => {
    if (cart && tenant) {
      const payload = {
        coupon_code: cart.coupon ?? "",
        currency: tenant.currency,
        price: `${formatPlainPrice(cart.total)}`,
        title: `Cart #${cart.id}`,
        ids: cart.items.map((item) => `${item.product.id}`),
        items: cart.items.map((item) => ({
          id: item.product.id,
          price: formatPlainPrice(item.total),
          quantity: 1,
          name: item.product.title,
          category: item.type
        }))
      };

      window.APP_EVENTS?.BEGIN_CHECKOUT.map((fun) => fun(payload));
    }
  }, [cart, tenant]);

  return (
    <BaseLayout
      classNames={{
        layout: "my-0 h-screen overflow-x-hidden"
      }}
    >
      <CheckoutHeader
        className={cn(!cart?.is_free ? "hidden md:!block" : "")}
        activeStep={"2"}
        ref={headerRef}
      />
      {isCartEmpty ? (
        <Container layout="center">
          <EmptyState
            className="p-0"
            iconClassName="text-gray-700"
            title={t("common.cart_empty_state_title")}
            description={t("common.cart_empty_state_description")}
            icon={<ShoppingCartIcon />}
            actions={
              <Button
                href="/"
                className="w-full md:!w-auto"
                children={t("common.browse_academy")}
              />
            }
          />
        </Container>
      ) : (
        <>
          <CheckoutAnimation
            show={checkoutProcessing}
            children={
              <div className="flex flex-col justify-center text-center">
                <Typography.Body
                  size="base"
                  className="dots-animate font-bold"
                  children={t("shopping_cart.checkout_loading")}
                />
                <Typography.Body
                  size="md"
                  className="font-medium text-gray-700"
                  children={t("shopping_cart.checkout_loading_description")}
                />
              </div>
            }
          />
          {!cart.is_free && <MobileCartItems cart={cart} />}
          <Container
            layout="default"
            style={{
              height: headerHeight == 0 ? `auto` : `calc(100% - ${headerHeight}px)`
            }}
            className={cn("relative z-10 mt-[138px] lg:mt-0 lg:pt-0", cart.is_free ? "mt-6 lg:mt-12" : "")}
          >
            {cart.is_free && !cart.is_free_due_to_coupon ? (
              <FreeCheckout cart={cart} />
            ) : (
              <div className="grid h-full grid-cols-1 gap-10 lg:grid-cols-2">
                <div className="mb-6 flex flex-col space-y-6">
                  {tenant.msaaqpay_enabled ? (
                    <MsaaqPayPaymentGateways
                      cart={cart}
                      msaaqpayApp={getApp(AppSlug.Msaaqpay) as App<AppSlug.Msaaqpay>}
                      authenticated={Boolean(member)}
                      bankTransferApp={getApp(AppSlug.BankTransfer) as App<AppSlug.BankTransfer>}
                      tamaraApp={useTamara ? (getApp(AppSlug.Tamara) as App<AppSlug.Tamara>) : undefined}
                      payPalApp={getApp(AppSlug.PayPal) as App<AppSlug.PayPal>}
                    />
                  ) : (
                    <PaymentMethodsOther
                      cart={cart}
                      isMoreThanOnePaymentMethodAvailable={isMoreThanOnePaymentMethodAvailable}
                      tamaraApp={useTamara ? (getApp(AppSlug.Tamara) as App<AppSlug.Tamara>) : undefined}
                      payPalApp={getApp(AppSlug.PayPal) as App<AppSlug.PayPal>}
                      bankTransferApp={getApp(AppSlug.BankTransfer) as App<AppSlug.BankTransfer>}
                      paylinkApp={getApp(AppSlug.Paylink) as App<AppSlug.Paylink>}
                      myfatoorah={getApp(AppSlug.Myfatoorah) as App<AppSlug.Myfatoorah>}
                      paddleApp={getApp(AppSlug.Paddle) as App<AppSlug.Paddle>}
                      stripeApp={getApp(AppSlug.Stripe) as App<AppSlug.Stripe>}
                      tapApp={getApp(AppSlug.Tap) as App<AppSlug.Tap>}
                    />
                  )}
                  <div className="flex items-center justify-center gap-3">
                    <Icon
                      variant="soft"
                      color="gray"
                      size="xs"
                      rounded="full"
                    >
                      <LockClosedIcon />
                    </Icon>
                    <Typography.Body
                      size="md"
                      className="font-medium"
                    >
                      {t("shopping_cart.secure_payment")}
                    </Typography.Body>
                  </div>
                </div>
                <div className="relative hidden before:absolute before:-z-[1] before:hidden before:h-full before:w-screen before:bg-gray-100 lg:!block lg:before:!block">
                  <DesktopCartItems cart={cart} />
                </div>
              </div>
            )}
          </Container>
        </>
      )}
    </BaseLayout>
  );
};

export default CheckoutLayout;
