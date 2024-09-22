"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import MemberInfo from "@/components/payment-methods/member-info";
import {
  useAppDispatch,
  useAppSelector,
  useFireAddPaymentInfoEvent,
  usePaddle,
  useResponseToastHandler,
  useServerAction,
  useValidateMemberBeforeCheckout
} from "@/hooks";
import { checkoutMutation } from "@/server-actions/actions/checkout-actions";
import { AppSliceStateType } from "@/store/slices/app-slice";
import { setCheckoutProcessing } from "@/store/slices/checkout-slice";
import { App, AppSlug, PAYMENT_GATEWAY } from "@/types";

import { Button, Form } from "@msaaqcom/abjad";

import PrivacyPolicyText from "./privacy-policy-text";

interface IProps {
  app: App<AppSlug.Paddle>;
}

const PaddleCheckout = ({ app }: IProps) => {
  const t = useTranslations();
  const [checkout, { isError, error: resError, isSuccess, data }] = useServerAction(checkoutMutation);
  const { appLocale } = useAppSelector<AppSliceStateType>((state) => state.app);

  const [error, setError] = useState<string>("");

  const dispatch = useAppDispatch();

  const { useFormApi, isMemberValid } = useValidateMemberBeforeCheckout();
  const fireAddPaymentInfoEvent = useFireAddPaymentInfoEvent();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError: setFormError
  } = useFormApi;

  const { displayErrors } = useResponseToastHandler({ setError: setFormError });
  const { paddle } = usePaddle({
    vendor: Number(app.vendor_id),
    environment: app.sandbox ? "sandbox" : undefined
  });

  useEffect(() => {
    if (isError && resError) {
      displayErrors({
        error: resError
      });
      // eslint-disable-next-line no-console
      console.log(resError);
      dispatch(setCheckoutProcessing(false));
    }
  }, [isError, resError]);

  useEffect(() => {
    if (isSuccess && data) {
      const payLink = (data as { pay_link: string }).pay_link;

      if (payLink) {
        fireAddPaymentInfoEvent();
        paddle.Checkout.open({
          method: "inline",
          override: payLink,
          locale: appLocale,
          allowQuantity: false,
          disableLogout: true,
          frameTarget: "paddle-checkout-container",
          frameInitialHeight: 416,
          frameStyle: "width:100%; min-width:312px; background-color: transparent; border: none;",
          loadCallback: function () {
            dispatch(setCheckoutProcessing(false));
          },
          successCallback: function (data: any) {
            window.location.href = data.checkout.redirect_url;
          },
          closeCallback: function () {}
        });
      } else {
        dispatch(setCheckoutProcessing(false));
        setError(t("validation.unexpected_error"));
      }
    }
  }, [isSuccess, data, fireAddPaymentInfoEvent]);

  const onSubmit = handleSubmit(async () => {
    const memberInfo = isMemberValid();

    if (!memberInfo) {
      return;
    }

    dispatch(setCheckoutProcessing(true));

    await checkout({
      payment_gateway: PAYMENT_GATEWAY.PADDLE,
      ...memberInfo
    });
  });

  return (
    <div className="overflow-hidden">
      <div className="border-t border-gray-300 p-4">
        <MemberInfo
          className="border-t-0  p-0"
          control={control}
          errors={errors}
        />
        <div className="paddle-checkout-container" />
      </div>

      <div className="space-y-2 border-t border-gray-300 p-4">
        <Button
          onPress={() => onSubmit()}
          className="w-full"
        >
          {t("shopping_cart.checkout")}
        </Button>
        <Form.Errors errors={error} />
        <PrivacyPolicyText />
      </div>
    </div>
  );
};

export default PaddleCheckout;
