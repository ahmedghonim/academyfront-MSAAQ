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

const PaylinkCheckout = () => {
  const t = useTranslations();
  const [checkout, { isError, error: resultError, data, isSuccess }] = useServerAction(checkoutMutation);

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
    if (isError && resultError) {
      displayErrors({ error: resultError });
      // eslint-disable-next-line no-console
      console.log(resultError);
      dispatch(setCheckoutProcessing(false));
    }
  }, [isError, resultError]);

  useEffect(() => {
    if (data && isSuccess) {
      const redirect_url = (
        data as {
          redirect_url: string;
        }
      ).redirect_url;

      if (redirect_url) {
        fireAddPaymentInfoEvent();
        window.location.href = redirect_url;
      } else {
        setError(t("validation.unexpected_error"));
        dispatch(setCheckoutProcessing(false));
      }
    }
  }, [data, isSuccess, fireAddPaymentInfoEvent]);

  const onSubmit = handleSubmit(async () => {
    const memberInfo = isMemberValid();

    if (!memberInfo) {
      return;
    }

    dispatch(setCheckoutProcessing(true));

    await checkout({
      payment_gateway: PAYMENT_GATEWAY.PAY_LINK,
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

export default PaylinkCheckout;
