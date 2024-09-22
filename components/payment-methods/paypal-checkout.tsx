"use client";

import { useRef, useState } from "react";

import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useTranslations } from "next-intl";

import MemberInfo from "@/components/payment-methods/member-info";
import { useTenant } from "@/components/store/TenantProvider";
import { useAppDispatch, useFireAddPaymentInfoEvent, useServerAction, useValidateMemberBeforeCheckout } from "@/hooks";
import { paypalCaptureMutation, paypalCheckoutMutation } from "@/server-actions/actions/checkout-actions";
import { setCheckoutProcessing } from "@/store/slices/checkout-slice";
import { App, AppSlug } from "@/types";
import { useRouter } from "@/utils/navigation";

import { Form } from "@msaaqcom/abjad";

const ButtonWrapper = ({
  setErrorMessage,
  isMemberValid,
  isValid
}: {
  setErrorMessage: (message: string) => void;
  isValid: boolean;
  isMemberValid: () => boolean | object;
}) => {
  const uuid = useRef<string>("");
  const t = useTranslations();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const fireAddPaymentInfoEvent = useFireAddPaymentInfoEvent();

  const [{ isPending }] = usePayPalScriptReducer();

  const [checkout] = useServerAction(paypalCheckoutMutation);
  const [capture] = useServerAction(paypalCaptureMutation);

  return (
    <>
      {isPending ? (
        <div className="spinner">loading paypal buttons</div>
      ) : (
        <PayPalButtons
          disabled={!isValid}
          createOrder={() => {
            const memberInfo = isMemberValid();

            if (!memberInfo) {
              return Promise.reject("Member info is not valid");
            }

            return checkout({
              ...(memberInfo as any)
            }).then((response: any) => {
              if (response.data) {
                uuid.current = response.data?.data?.cart?.uuid;
                fireAddPaymentInfoEvent();

                return response.data.data.paypal_order_id;
              } else if (response.error) {
                // eslint-disable-next-line no-console
                console.log("Paypal createOrder error: ", response.error);
              }
            });
          }}
          onApprove={async (data: any, actions: any) => {
            await dispatch(setCheckoutProcessing(true));

            return capture({
              cart_id: uuid.current,
              paypal_order_id: data.orderID
            }).then(async (response: any) => {
              await dispatch(setCheckoutProcessing(false));

              let orderData = response.data;

              // Three cases to handle:
              //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   (2) Other non-recoverable errors -> Show a failure message
              //   (3) Successful transaction -> Show confirmation or thank you

              // This example reads a v2/checkout/orders capture response, propagated from the server
              // You could use a different API or structure for your 'orderData'
              let errorDetail = Array.isArray(orderData.details) && orderData.details[0];

              if (errorDetail && errorDetail.issue === "INSTRUMENT_DECLINED") {
                // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/

                return actions.restart(); // Recoverable state, per:
              }

              if (errorDetail) {
                let msg = "";

                if (errorDetail.description) msg += "\n\n" + errorDetail.description;
                if (orderData.debug_id) msg += " (" + orderData.debug_id + ")";

                // eslint-disable-next-line no-console
                console.log(msg);

                setErrorMessage(t("validation.unexpected_error"));
              }

              router.replace(`/cart/${uuid.current}/thank-you`);
            });
          }}
          onError={(err: any) => {
            // eslint-disable-next-line no-console
            console.error(err);
            setErrorMessage(t("validation.unexpected_error"));
          }}
        />
      )}
    </>
  );
};

interface IProps {
  app: App<AppSlug.PayPal>;
}

const PaypalCheckout = ({ app }: IProps) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const tenant = useTenant()((s) => s.tenant);
  const { useFormApi, isMemberValid } = useValidateMemberBeforeCheckout();

  const {
    control,
    formState: { isValid, errors }
  } = useFormApi;

  if (!app.client_id) {
    return null;
  }

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-4 border-t border-gray-300 p-4 py-4">
        {(!tenant || !tenant.msaaqpay_enabled) && (
          <MemberInfo
            className="border-t-0 p-0"
            control={control}
            errors={errors}
          />
        )}
        <PayPalScriptProvider
          options={{
            clientId: app.client_id,
            currency: "USD",
            locale: "ar_SA",
            components: "buttons",
            dataNamespace: "paypal_sdk"
          }}
        >
          <ButtonWrapper
            isValid={isValid}
            isMemberValid={isMemberValid}
            setErrorMessage={setErrorMessage}
          />
        </PayPalScriptProvider>
        <Form.Errors errors={errorMessage} />
      </div>
    </div>
  );
};

export default PaypalCheckout;
