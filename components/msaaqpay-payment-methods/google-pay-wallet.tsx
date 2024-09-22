"use client";

import React, { useEffect, useMemo, useRef } from "react";

import { useTranslations } from "next-intl";

import { useCart } from "@/components/store/CartProvider";
import { useTenant } from "@/components/store/TenantProvider";
import { useIsForeignerLink, useValidateMemberBeforeMsaaqpayCheckout } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { useGooglePayAuthorizeMutation } from "@/store/slices/api/cartSlice";
import { AnyObject, App, AppSlug } from "@/types";
import { createImportsScript } from "@/utils";
import AppStorage from "@/utils/AppStorage";
import { useRouter } from "@/utils/navigation";

const supportedCardNetworks = ["visa", "mastercard", "discover"];

interface IProps {
  app: App<AppSlug.Msaaqpay>;
}

function GooglePayComponent({ app }: IProps) {
  const t = useTranslations();
  const router = useRouter();

  const { member } = useSession();
  const { isMemberValid } = useValidateMemberBeforeMsaaqpayCheckout();
  const { isForeignerLink } = useIsForeignerLink();
  const googlePayContainerRef = useRef<HTMLDivElement>(null);
  const cart = useCart()((s) => s.cart);
  const tenant = useTenant()((s) => s.tenant);

  const [authorize] = useGooglePayAuthorizeMutation();

  const supportedNetworks = useMemo(
    () =>
      app.gateways
        .filter((gateway) => supportedCardNetworks.includes(gateway))
        .map((gateway) => gateway)
        .map((network) => (network === "mastercard" ? "masterCard" : network)),
    [app]
  );

  useEffect(() => {
    createImportsScript("https://pay.google.com/gp/p/js/pay.js", { async: true }, () => initGooglePay());
  }, []);
  /**
   * Provide Google Pay API with a payment amount, currency, and amount status
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
   * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
   */
  const getGoogleTransactionInfo = () => {
    if (!cart || !tenant) {
      return;
    }

    return {
      displayItems: [
        {
          label: t("shopping_cart.subtotal"),
          type: "SUBTOTAL",
          price: String(cart.subtotal / 100)
        },
        {
          label: t("shopping_cart.vat", { vat: cart.tax.percent }),
          type: "TAX",
          price: String(cart.tax.value / 100)
        }
      ],
      countryCode: member?.country_code ?? AppStorage.getItem("country_code") ?? "SA",
      currencyCode: tenant.currency,
      totalPriceStatus: "FINAL",
      totalPrice: String((cart.total / 100).toFixed(2)),
      totalPriceLabel: t("shopping_cart.total")
    };
  };

  const initGooglePay = () => {
    /**
     * Define the version of the Google Pay API referenced when creating your
     * configuration
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|apiVersion in PaymentDataRequest}
     */
    const baseRequest = {
      apiVersion: 2,
      apiVersionMinor: 0
    };

    /**
     * Card networks supported by your site and your gateway
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
     * @todo confirm card networks supported by your site and gateway
     */
    const allowedCardNetworks = supportedNetworks.map((network) => network.toUpperCase());

    /**
     * Card authentication methods supported by your site and your gateway
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
     * @todo confirm your processor supports Android device tokens for your
     * supported card networks
     */
    const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

    /**
     * Identify your gateway and your site's gateway merchant identifier
     *
     * The Google Pay API response will return an encrypted payment method capable
     * of being charged by a supported gateway after payer authorization
     *
     * @todo check with your gateway on the parameters to pass
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway|PaymentMethodTokenizationSpecification}
     */
    const tokenizationSpecification = {
      type: "PAYMENT_GATEWAY",
      parameters: {
        gateway: "checkoutltd",
        gatewayMerchantId: "app.public_key"
      }
    };

    /**
     * Describe your site's support for the CARD payment method and its required
     * fields
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
     */
    const baseCardPaymentMethod = {
      type: "CARD",
      parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks
      }
    };

    /**
     * Describe your site's support for the CARD payment method including optional
     * fields
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
     */
    const cardPaymentMethod = Object.assign({}, baseCardPaymentMethod, {
      tokenizationSpecification: tokenizationSpecification
    });

    /**
     * An initialized google.payments.api.PaymentsClient object or null if not yet set
     *
     * @see {@link getGooglePaymentsClient}
     */
    // @ts-ignore
    let paymentsClient = null;

    /**
     * Configure your site's support for payment methods supported by the Google Pay
     * API.
     *
     * Each member of allowedPaymentMethods should contain only the required fields,
     * allowing reuse of this base request when determining a viewer's ability
     * to pay and later requesting a supported payment method
     *
     * @returns {object} Google Pay API version, payment methods supported by the site
     */
    function getGoogleIsReadyToPayRequest() {
      return Object.assign({}, baseRequest, {
        allowedPaymentMethods: [baseCardPaymentMethod]
      });
    }

    /**
     * Configure support for the Google Pay API
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|PaymentDataRequest}
     * @returns {object} PaymentDataRequest fields
     */
    function getGooglePaymentDataRequest() {
      const paymentDataRequest: AnyObject = Object.assign({}, baseRequest);
      paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
      paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
      paymentDataRequest.merchantInfo = {
        // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
        merchantId: "app.google_pay_merchant_id",
        merchantName: tenant?.title
      };

      paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];

      return paymentDataRequest;
    }

    /**
     * Return an active PaymentsClient or initialize
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
     * @returns {google.payments.api.PaymentsClient} Google Pay API client
     */
    function getGooglePaymentsClient() {
      // @ts-ignore
      if (paymentsClient === null) {
        // @ts-ignore
        paymentsClient = new google.payments.api.PaymentsClient({
          // @ts-ignore
          environment: app.sandbox ? "TEST" : "PRODUCTION",
          paymentDataCallbacks: {
            onPaymentAuthorized
          }
        });
      }
      // @ts-ignore
      return paymentsClient;
    }

    /**
     * Handles authorize payments callback intents.
     *
     * @param {object} paymentData response from Google Pay API after a payer approves payment through user gesture.
     * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData object reference}
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentAuthorizationResult}
     * @returns Promise<{object}> Promise of PaymentAuthorizationResult object to acknowledge the payment authorization status.
     */
    // @ts-ignore
    function onPaymentAuthorized(paymentData) {
      return new Promise(function (resolve, reject) {
        // handle the response
        processPayment(paymentData)
          .then(() => resolve({ transactionState: "SUCCESS" }))
          .catch((error) => {
            resolve({
              transactionState: "ERROR",
              error: {
                intent: "PAYMENT_AUTHORIZATION",
                message: error.message,
                reason: "PAYMENT_DATA_INVALID"
              }
            });
          });
      });
    }

    /**
     * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
     *
     * Display a Google Pay payment button after confirmation of the viewer's
     * ability to pay.
     */
    function onGooglePayLoaded() {
      const paymentsClient = getGooglePaymentsClient();
      paymentsClient
        .isReadyToPay(getGoogleIsReadyToPayRequest())
        // @ts-ignore
        .then((response) => {
          if (response.result) {
            addGooglePayButton();
          }
        })
        // @ts-ignore
        .catch((err) => {
          // show error in developer console for debugging
          // eslint-disable-next-line no-console
          console.error(err);
        });
    }

    /**
     * Add a Google Pay purchase button alongside an existing checkout button
     *
     * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#ButtonOptions|Button options}
     * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
     */
    function addGooglePayButton() {
      const paymentsClient = getGooglePaymentsClient();
      const button = paymentsClient.createButton({
        onClick: onGooglePaymentButtonClicked,
        buttonSizeMode: "fill",
        // buttonColor: 'white',
        buttonType: "plain",
        buttonLocale: "ar"
      });

      googlePayContainerRef.current?.appendChild(button);
    }

    /**
     * Show Google Pay payment sheet when Google Pay payment button is clicked
     */
    function onGooglePaymentButtonClicked() {
      const memberInfo = isMemberValid();

      if (!memberInfo) {
        return;
      }

      const paymentDataRequest = getGooglePaymentDataRequest();
      paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

      const paymentsClient = getGooglePaymentsClient();
      paymentsClient.loadPaymentData(paymentDataRequest);
    }

    /**
     * Process payment data returned by the Google Pay API
     *
     * @param {object} paymentData response from Google Pay API after user approves payment
     * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData|PaymentData object reference}
     */
    //@ts-ignore
    function processPayment(paymentData) {
      return new Promise(async (resolve, reject) => {
        const paymentToken = JSON.parse(paymentData.paymentMethodData.tokenizationData.token);

        const memberInfo = isMemberValid();

        if (!memberInfo || !cart) {
          return;
        }
        await authorize({
          uuid: cart.uuid,
          token: paymentToken,
          card_network: paymentData.paymentMethodData.info.cardNetwork.toLowerCase(),
          ...memberInfo
        })
          // @ts-ignore
          .then(({ data }) => {
            if (data.status === "success") {
              resolve({});

              if (isForeignerLink(data.redirect_url)) {
                window.location = data.redirect_url;
              } else {
                router.push(data.redirect_url);
              }
            } else {
              reject(new Error(data.message));
            }
          })
          .catch(({ response }) => {
            // eslint-disable-next-line no-console
            console.error("google-pay-authorize", response.data);

            reject(new Error(response.data?.message));
          });
      });
    }

    // Mount the component
    onGooglePayLoaded();
  };

  return (
    <div
      className="w-100"
      id="google-pay-container"
      ref={googlePayContainerRef}
    />
  );
}

export default GooglePayComponent;
