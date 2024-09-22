"use client";

import { useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import MemberInfo from "@/components/payment-methods/member-info";
import {
  useAppDispatch,
  useAppSelector,
  useFireAddPaymentInfoEvent,
  useResponseToastHandler,
  useServerAction,
  useValidateMemberBeforeCheckout
} from "@/hooks";
import { checkoutMutation } from "@/server-actions/actions/checkout-actions";
import { AppSliceStateType } from "@/store/slices/app-slice";
import { setCheckoutProcessing } from "@/store/slices/checkout-slice";
import { App, AppSlug, PAYMENT_GATEWAY } from "@/types";
import { IS_CLIENT } from "@/utils";

import { Button, Form } from "@msaaqcom/abjad";

import PrivacyPolicyText from "./privacy-policy-text";

type RedirectResponse = {
  redirect_url: string;
};

interface IProps {
  app: App<AppSlug.Tap>;
}

const TapPaymentCreditCheckout = ({ app }: IProps) => {
  const t = useTranslations();

  const [checkout, { isError, error: resError, isSuccess, data, isLoading }] = useServerAction(checkoutMutation);

  const { appLocale } = useAppSelector<AppSliceStateType>((state) => state.app);

  const dispatch = useAppDispatch();

  const [error, setError] = useState<string>("");

  const mounted = useRef<boolean>(false);

  const { useFormApi, isMemberValid } = useValidateMemberBeforeCheckout();
  const fireAddPaymentInfoEvent = useFireAddPaymentInfoEvent();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError: setFormError
  } = useFormApi;

  useEffect(() => {
    if (mounted.current || !app.publishable_key) {
      return;
    }
    //@ts-ignore
    if (window.goSell) {
      //@ts-ignore
      goSell.goSellElements({
        containerID: "element-container",
        gateway: {
          publicKey: app.publishable_key,
          //TODO: use theme direction
          language: appLocale,
          supportedCurrencies: ["AED", "SAR", "BHD", "EGP", "KWD", "OMR", "QAR", "EUR", "USD", "GBP"],
          callback: tapTokenHandler,
          notifications: "msg",
          style: {
            base: {
              color: "#444",
              lineHeight: "18px",
              //TODO: use theme font
              fontFamily: `tahoma, sans-serif`,
              fontSmoothing: "antialiased",
              fontSize: "16px",
              "::placeholder": {
                color: "rgba(0, 0, 0, 0.4)",
                fontSize: "15px"
              }
            },
            invalid: {
              color: "red"
            }
          }
        }
      });
      mounted.current = true;
    }
    //@ts-ignore
  }, [IS_CLIENT]);

  const { displayErrors } = useResponseToastHandler({ setError: setFormError });

  useEffect(() => {
    if (isSuccess && data) {
      const redirect_url = (data as RedirectResponse).redirect_url;

      if (redirect_url) {
        fireAddPaymentInfoEvent();
        window.location.href = redirect_url;
      } else {
        setError(t("validation.unexpected_error"));
        dispatch(setCheckoutProcessing(false));
      }
    }
  }, [isSuccess, data, fireAddPaymentInfoEvent]);

  useEffect(() => {
    if (isError && resError) {
      displayErrors({
        error: resError as any
      });
      // eslint-disable-next-line no-console
      console.log(resError);

      dispatch(setCheckoutProcessing(false));
    }
  }, [isError, resError]);

  const tapTokenHandler = async (response: any) => {
    if (response.error) {
      // eslint-disable-next-line no-console
      console.log(response);
      setError(response?.error?.message ?? "");
    } else if (response.id) {
      onCardTokenized(response.id);
    } else {
      // eslint-disable-next-line no-console
      console.log(response);
      setError(t("validation.unexpected_error"));
    }
  };

  const onCardTokenized = async (token?: string) => {
    const memberInfo = isMemberValid();

    if (!memberInfo) {
      return;
    }

    dispatch(setCheckoutProcessing(true));

    await checkout({
      payment_gateway: PAYMENT_GATEWAY.TAP_PAYMENT,
      tapToken: token,
      ...memberInfo
    });
  };

  const onSubmit = handleSubmit(async () => {
    //@ts-ignore
    if (window && window.goSell && app.publishable_key) {
      //@ts-ignore
      goSell.submit();
    } else {
      await onCardTokenized();
    }
  });

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-4 border-t border-gray-300 p-4 py-4">
        <div className="flex flex-col gap-y-2">
          <MemberInfo
            className="border-t-0 p-0"
            control={control}
            errors={errors}
          />
          <div id="element-container"></div>
          <p
            id="msg"
            className="text-danger"
          />
          <Form.Errors errors={error} />
        </div>
      </div>
      <div className="border-t border-gray-300 p-4">
        <Button
          className="w-full"
          isDisabled={isLoading}
          onPress={() => onSubmit()}
        >
          {t("shopping_cart.checkout")}
        </Button>
        <PrivacyPolicyText />
      </div>
    </div>
  );
};

export default TapPaymentCreditCheckout;
