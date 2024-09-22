"use client";

import { useTranslations } from "next-intl";

import { CouponInput } from "@/components/cart";
import * as MsaaqPayMethods from "@/components/msaaqpay-payment-methods";
import { FreeByCouponCheckout, PaymentDetailsAccordion, TamaraCheckout } from "@/components/payment-methods";
import { useSession } from "@/providers/session-provider";
import { App, AppSlug, Cart } from "@/types";

const MsaaqPayPaymentGateways = ({
  msaaqpayApp,
  cart,
  authenticated,
  bankTransferApp,
  payPalApp,
  tamaraApp
}: {
  msaaqpayApp?: App<AppSlug.Msaaqpay>;
  bankTransferApp?: App<AppSlug.BankTransfer>;
  payPalApp?: App<AppSlug.PayPal>;
  tamaraApp?: App<AppSlug.Tamara>;
  cart: Cart;
  authenticated: boolean;
}) => {
  const t = useTranslations();
  const { member } = useSession();

  return msaaqpayApp ? (
    <div className="relative flex flex-col">
      {cart.is_free && <FreeByCouponCheckout />}
      {!cart.is_free && !authenticated && <MsaaqPayMethods.MemberInfoCheckout />}
      <div className="relative flex flex-col space-y-6 py-8">
        {cart.is_free && <div className="pointer-events-auto absolute inset-0 z-50 bg-white bg-opacity-40" />}
        <CouponInput
          coupon={cart.coupon}
          className="flex lg:!hidden"
        />
        <div className="relative rounded-lg border border-gray-300 px-4 pb-4 pt-8">
          <span className="absolute left-2/4 top-[-13px] w-fit -translate-x-2/4 translate-y-0 whitespace-nowrap bg-white px-2">
            {t("shopping_cart.checkout_with_wallets")}
          </span>
          <MsaaqPayMethods.WalletCheckout app={msaaqpayApp} />
        </div>
        <div className="relative border-t border-gray-300">
          <span className="absolute left-2/4 top-[-13px] w-fit -translate-x-2/4 translate-y-0 whitespace-nowrap bg-white px-2">
            {t("shopping_cart.checkout_with_other_methods")}
          </span>
        </div>
        {member && member.saved_cards && member.saved_cards.length > 0 && <MsaaqPayMethods.SavedCardsCheckout />}
        <PaymentDetailsAccordion
          name="payment"
          title={t("shopping_cart.card_checkout")}
          payment_logo={["MADA", "VISA", "MASTER"]}
          id="msaaq-pay"
          children={cart.is_free ? undefined : <MsaaqPayMethods.CardCheckout app={msaaqpayApp} />}
        />
        {tamaraApp && (
          <PaymentDetailsAccordion
            name="payment"
            title={t("shopping_cart.tamara_checkout")}
            payment_logo={["Tamara"]}
            id="tamara"
            children={cart.is_free ? undefined : <TamaraCheckout app={tamaraApp} />}
          />
        )}
        {payPalApp && (
          <PaymentDetailsAccordion
            name="payment"
            title={t("shopping_cart.paypal_checkout")}
            payment_logo={["PayPal"]}
            id="paypal"
            children={cart.is_free ? undefined : <MsaaqPayMethods.PayPalCheckout app={payPalApp} />}
          />
        )}
        {bankTransferApp && (
          <PaymentDetailsAccordion
            name="payment"
            title={t("shopping_cart.bank_transfer_checkout")}
            payment_logo={["bankTransfer"]}
            id="bank_transfer_checkout"
            children={cart.is_free ? undefined : <MsaaqPayMethods.BankTransferCheckout app={bankTransferApp} />}
          />
        )}
      </div>
    </div>
  ) : null;
};

export default MsaaqPayPaymentGateways;
