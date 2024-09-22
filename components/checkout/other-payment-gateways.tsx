"use client";

import { useTranslations } from "next-intl";

import { CouponInput } from "@/components/cart";
import * as PaymentMethods from "@/components/payment-methods";
import { App, AppSlug, Cart } from "@/types";

import { Typography } from "@msaaqcom/abjad";

const OtherPaymentGateways = ({
  tapApp,
  paylinkApp,
  myfatoorah,
  stripeApp,
  paddleApp,
  cart,
  isMoreThanOnePaymentMethodAvailable,
  bankTransferApp,
  payPalApp,
  tamaraApp
}: {
  tapApp?: App<AppSlug.Tap>;
  paylinkApp?: App<AppSlug.Paylink>;
  myfatoorah?: App<AppSlug.Myfatoorah>;
  stripeApp?: App<AppSlug.Stripe>;
  paddleApp?: App<AppSlug.Paddle>;
  bankTransferApp?: App<AppSlug.BankTransfer>;
  payPalApp?: App<AppSlug.PayPal>;
  tamaraApp?: App<AppSlug.Tamara>;
  cart: Cart;
  isMoreThanOnePaymentMethodAvailable: boolean;
}) => {
  const t = useTranslations();

  return (
    <>
      {cart.is_free && <PaymentMethods.FreeByCouponCheckout />}
      <div className="relative flex flex-col space-y-6 py-8">
        {cart.is_free && <div className="pointer-events-auto absolute inset-0 z-50 bg-white bg-opacity-40" />}
        <CouponInput
          coupon={cart.coupon}
          className="flex lg:!hidden"
        />
        <Typography.Title
          size="sm"
          className="font-semibold lg:!mt-0"
          children={t("shopping_cart.payment_method")}
        />
        {tapApp && (
          <>
            <PaymentMethods.PaymentDetailsAccordion
              name="payment"
              title={
                isMoreThanOnePaymentMethodAvailable ? t("shopping_cart.tap_checkout") : t("shopping_cart.card_checkout")
              }
              payment_logo={["MADA", "VISA", "MASTER"]}
              id="tap"
              children={cart.is_free ? undefined : <PaymentMethods.TapPaymentCreditCheckout app={tapApp} />}
            />
            <PaymentMethods.PaymentDetailsAccordion
              name="payment"
              title={t("shopping_cart.tap_apply_pay_checkout")}
              payment_logo={["Apple Pay"]}
              id="tap_apply_pay"
              children={cart.is_free ? undefined : <PaymentMethods.TapPaymentApplePayCheckout />}
            />
          </>
        )}
        {paylinkApp && (
          <PaymentMethods.PaymentDetailsAccordion
            name="payment"
            title={
              isMoreThanOnePaymentMethodAvailable
                ? t("shopping_cart.paylink_checkout")
                : t("shopping_cart.card_checkout")
            }
            payment_logo={["MADA", "Apple Pay", "VISA", "MASTER"]}
            id="paylink"
            children={cart.is_free ? undefined : <PaymentMethods.PaylinkCheckout />}
          />
        )}
        {myfatoorah && (
          <PaymentMethods.PaymentDetailsAccordion
            name="payment"
            title={
              isMoreThanOnePaymentMethodAvailable
                ? t("shopping_cart.myfatoorah_checkout")
                : t("shopping_cart.card_checkout")
            }
            payment_logo={["MADA", "KNET", "STC Pay", "Apple Pay", "Google Pay", "VISA", "MASTER"]}
            id="myfatoorah"
            children={cart.is_free ? undefined : <PaymentMethods.MyfatoorahCheckout app={myfatoorah} />}
          />
        )}
        {stripeApp && (
          <PaymentMethods.PaymentDetailsAccordion
            name="payment"
            title={
              isMoreThanOnePaymentMethodAvailable
                ? t("shopping_cart.stripe_checkout")
                : t("shopping_cart.card_checkout")
            }
            payment_logo={["Apple Pay", "VISA", "MASTER"]}
            id="stripe-checkout"
            children={cart.is_free ? undefined : <PaymentMethods.StripeCheckout />}
          />
        )}
        {paddleApp && (
          <PaymentMethods.PaymentDetailsAccordion
            name="payment"
            title={
              isMoreThanOnePaymentMethodAvailable
                ? t("shopping_cart.paddle_checkout")
                : t("shopping_cart.card_checkout")
            }
            payment_logo={["Apple Pay", "VISA", "MASTER", "PayPal"]}
            id="paddle-checkout"
            children={cart.is_free ? undefined : <PaymentMethods.PaddleCheckout app={paddleApp} />}
          />
        )}
        {bankTransferApp && (
          <PaymentMethods.PaymentDetailsAccordion
            name="payment"
            title={t("shopping_cart.bank_transfer_checkout")}
            payment_logo={["bankTransfer"]}
            id="payment"
            children={cart.is_free ? undefined : <PaymentMethods.BankTransferCheckout app={bankTransferApp} />}
          />
        )}
        {tamaraApp && (
          <PaymentMethods.PaymentDetailsAccordion
            name="payment"
            title={
              isMoreThanOnePaymentMethodAvailable
                ? t("shopping_cart.tamara_checkout")
                : t("shopping_cart.card_checkout")
            }
            payment_logo={["Tamara"]}
            id="tamara"
            children={cart.is_free ? undefined : <PaymentMethods.TamaraCheckout app={tamaraApp} />}
          />
        )}
        {payPalApp && (
          <PaymentMethods.PaymentDetailsAccordion
            name="payment"
            title={
              isMoreThanOnePaymentMethodAvailable
                ? t("shopping_cart.paypal_checkout")
                : t("shopping_cart.card_checkout")
            }
            payment_logo={["PayPal"]}
            id="paypal"
            children={cart.is_free ? undefined : <PaymentMethods.PayPalCheckout app={payPalApp} />}
          />
        )}
      </div>
    </>
  );
};

export default OtherPaymentGateways;
