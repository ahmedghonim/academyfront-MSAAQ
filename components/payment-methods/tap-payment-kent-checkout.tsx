"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import MemberInfo from "@/components/payment-methods/member-info";
import {
  useAppDispatch,
  useFireAddPaymentInfoEvent,
  useResponseToastHandler,
  useServerAction,
  useValidateMemberBeforeCheckout
} from "@/hooks";
import { checkoutMutation } from "@/server-actions/actions/checkout-actions";
import { setCheckoutProcessing } from "@/store/slices/checkout-slice";
import { PAYMENT_GATEWAY } from "@/types";

import { Button, Form } from "@msaaqcom/abjad";

import PrivacyPolicyText from "./privacy-policy-text";

type RedirectResponse = {
  redirect_url: string;
};

const TapPaymentKentCheckout = () => {
  const t = useTranslations();

  const [checkout, { isError, error: resError, isSuccess, data, isLoading }] = useServerAction(checkoutMutation);

  const dispatch = useAppDispatch();
  const fireAddPaymentInfoEvent = useFireAddPaymentInfoEvent();

  const [error, setError] = useState<string>("");

  const { useFormApi, isMemberValid } = useValidateMemberBeforeCheckout();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError: setFormError
  } = useFormApi;

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
      displayErrors(resError);
      // eslint-disable-next-line no-console
      console.log(resError);

      dispatch(setCheckoutProcessing(false));
    }
  }, [isError, resError]);

  const onSubmit = handleSubmit(async () => {
    const memberInfo = isMemberValid();

    if (!memberInfo) {
      return;
    }

    dispatch(setCheckoutProcessing(true));
    await checkout({
      payment_gateway: PAYMENT_GATEWAY.TAP_PAYMENT,
      source: "src_kw.knet",
      ...memberInfo
    });
  });

  return (
    <div className="overflow-hidden">
      <MemberInfo
        control={control}
        errors={errors}
      />
      <div className="border-t border-gray-300 p-4">
        <Button
          className="w-full"
          isDisabled={isLoading}
          onPress={() => onSubmit()}
        >
          {t("shopping_cart.checkout")}
        </Button>
        <Form.Errors errors={error} />
        <PrivacyPolicyText />
      </div>
    </div>
  );
};

export default TapPaymentKentCheckout;
