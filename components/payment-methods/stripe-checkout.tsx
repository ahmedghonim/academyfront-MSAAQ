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

const StripeCheckout = () => {
  const t = useTranslations();
  const [checkout, { isError, error: resError, isSuccess, data }] = useServerAction(checkoutMutation);

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
      const checkout_url = (
        data as {
          checkout_url: string;
        }
      ).checkout_url;

      if (checkout_url) {
        fireAddPaymentInfoEvent();
        window.location.href = checkout_url;
      } else {
        setError(t("validation.unexpected_error"));
      }

      dispatch(setCheckoutProcessing(false));
    }
  }, [isSuccess, data, fireAddPaymentInfoEvent]);

  const onSubmit = handleSubmit(async () => {
    const memberInfo = isMemberValid();

    if (!memberInfo) {
      return;
    }

    dispatch(setCheckoutProcessing(true));

    await checkout({
      payment_gateway: PAYMENT_GATEWAY.STRIPE,
      ...memberInfo
    });
  });

  return (
    <div className="overflow-hidden">
      <MemberInfo
        control={control}
        errors={errors}
      />
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

export default StripeCheckout;
