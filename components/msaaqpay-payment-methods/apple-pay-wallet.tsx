"use client";

import { useMemo, useRef, useState } from "react";

import { useCart } from "@/components/store/CartProvider";
import { useTenant } from "@/components/store/TenantProvider";
import {
  useCopyToClipboard,
  useFireAddPaymentInfoEvent,
  useIsForeignerLink,
  useResponseToastHandler,
  useServerAction,
  useToast,
  useValidateMemberBeforeMsaaqpayCheckout
} from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { applePayAuthorizeMutation, applePayValidationMutation } from "@/server-actions/actions/checkout-actions";
import { APIFetchResponse, FetchErrorType, FetchReturnValue } from "@/server-actions/config/base-query";
import { App, AppSlug } from "@/types";
import AppStorage from "@/utils/AppStorage";
import { usePathname, useRouter } from "@/utils/navigation";

import { DocumentCheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

import { Button, Form, Icon, Modal, Typography } from "@msaaqcom/abjad";

const supportedCardNetworks = ["visa", "mastercard", "discover", "mada"];

interface IProps {
  app: App<AppSlug.Msaaqpay>;
}

const ApplePayWallet = ({ app }: IProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const canCheckoutRef = useRef<boolean>(true);
  const { member } = useSession();
  const { isMemberValid } = useValidateMemberBeforeMsaaqpayCheckout();
  const fireAddPaymentInfoEvent = useFireAddPaymentInfoEvent();

  const { isForeignerLink } = useIsForeignerLink();
  const [copy, values] = useCopyToClipboard();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [toast] = useToast();
  const cart = useCart()((s) => s.cart);
  const tenant = useTenant()((s) => s.tenant);

  const [validateCheckout] = useServerAction(applePayValidationMutation);
  const [authorizeCheckout] = useServerAction(applePayAuthorizeMutation);

  const supportedNetworks = useMemo(
    () =>
      app.gateways
        .filter((gateway) => supportedCardNetworks.includes(gateway))
        .map((gateway) => gateway)
        .map((network) => (network === "mastercard" ? "masterCard" : network)),
    [app]
  );

  const isApplePayAvailable = useMemo(
    //@ts-ignore
    () => (window.ApplePaySession && ApplePaySession.canMakePayments()) ?? false,
    //@ts-ignore
    [window, window.ApplePaySession]
  );

  const { displayErrors, displaySuccess } = useResponseToastHandler({});

  const startApplePaySession = () => {
    if (!isApplePayAvailable) {
      setOpenModal(true);

      return;
    }

    if (!cart) {
      return;
    }

    if (!tenant) {
      return;
    }

    const memberInfo = isMemberValid();

    if (!memberInfo) {
      return;
    }

    if (cart?.is_free) {
      return;
    }

    //@ts-ignore
    const session = new ApplePaySession(6, {
      countryCode: member?.country_code ?? AppStorage.getItem("country_code") ?? "SA",
      currencyCode: tenant.currency,
      supportedNetworks: supportedNetworks,
      merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"],
      total: {
        label: tenant.title,
        amount: (cart.total / 100).toFixed(2),
        type: "final"
      }
    });

    canCheckoutRef.current = false;
    session.oncancel = () => {
      canCheckoutRef.current = true;
    };

    session.begin();

    //@ts-ignore
    session.onvalidatemerchant = async (event) => {
      // eslint-disable-next-line no-console
      console.log("onvalidatemerchant", event.validationURL);
      await validateCheckout({ validation_url: event.validationURL })
        //@ts-ignore
        .then(({ data }) => {
          // eslint-disable-next-line no-console
          console.log("then.data", data);
          if (data) {
            fireAddPaymentInfoEvent();
            session.completeMerchantValidation(data);
          } else {
            // eslint-disable-next-line no-console
            console.error("onvalidatemerchant", data);
            toast.error({
              message: "حدث خطأ أثناء تحقق البائع"
            });
            session.abort();
          }
        })
        .catch(({ response }) => {
          // eslint-disable-next-line no-console
          console.log("catch.response", response);
          // eslint-disable-next-line no-console
          console.error("onvalidatemerchant", response?.data);
          toast.error({
            message: response?.data ?? "حدث خطأ أثناء تحقق البائع"
          });
          session.abort();
        });
    };

    // @ts-ignore
    session.onpaymentauthorized = async (event) => {
      const response = (await authorizeCheckout({
        uuid: cart.uuid,
        token: event.payment.token,
        card_network: event.payment.token.paymentMethod?.network?.toLowerCase(),
        ...memberInfo
      })) as FetchReturnValue<APIFetchResponse<any>, FetchErrorType>;

      if (displayErrors(response)) {
        // @ts-ignore
        session.completePayment(ApplePaySession.STATUS_FAILURE);
        session.abort();

        return;
      }

      displaySuccess(response);

      //@ts-ignore
      session.completePayment(ApplePaySession.STATUS_SUCCESS);

      if (response.data) {
        const { redirect_url } = response.data.data;

        if (isForeignerLink(redirect_url)) {
          window.location = redirect_url;
        } else {
          router.push(redirect_url);
        }
      }
    };
  };

  return (
    <>
      <div className={supportedNetworks?.length ? "apple-pay-container w-100" : ""}>
        <button
          onClick={startApplePaySession}
          disabled={!canCheckoutRef.current}
          className="apple-pay-button apple-pay-button-black"
        >
          <img
            src="https://cdn.msaaq.com/assets/images/payments/light/applepay.svg"
            alt="Apple Pay"
            className="apple-pay-img"
          />
        </button>
      </div>
      {!isApplePayAvailable && (
        <Modal
          className="md:!max-w-[550px]"
          open={openModal}
          onDismiss={() => {
            setOpenModal(false);
          }}
        >
          <Modal.Header
            className="items-center"
            dismissible
            title={
              <div className="flex items-center gap-3">
                <Icon>
                  <InformationCircleIcon />
                </Icon>
                <Typography.Text
                  className="font-semibold"
                  children={"الجهاز أو المتصفح لا يدعم Apple Pay"}
                />
              </div>
            }
          />
          <Modal.Body className="md:!ps-12">
            يمكنك الدفع باستخدام Apple Pay من خلال متصفح Safari على أحد أجهزة Apple المدعومة فقط.
            <Form.Input
              readOnly
              value={`${tenant?.domain}${pathname}`}
              append={
                <Button
                  onPress={() => copy(`${tenant?.domain}${pathname}`)}
                  variant="link"
                  className="px-0"
                  color="gray"
                  icon={
                    !values.includes(`${tenant?.domain}${pathname}`) ? (
                      <Icon
                        size="sm"
                        children={<DocumentDuplicateIcon />}
                      />
                    ) : (
                      <Icon
                        size="sm"
                        className="text-success"
                        children={<DocumentCheckIcon />}
                      />
                    )
                  }
                />
              }
              className="mb-2 mt-3"
            />
            <p className="mb-0 text-start text-sm text-gray-700">
              تلميح: انسخ هذا الرابط إلى متصفح سفاري لإكمال الدفع عبر Apple Pay.
            </p>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ApplePayWallet;
