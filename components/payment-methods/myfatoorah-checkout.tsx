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
import { App, AppSlug, PAYMENT_GATEWAY } from "@/types";

import { Button, Form, Grid, Icon } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import PrivacyPolicyText from "./privacy-policy-text";

interface IProps {
  app: App<AppSlug.Myfatoorah>;
}

const MyfatoorahCheckout = ({ app }: IProps) => {
  const t = useTranslations();
  const [checkout, { isError, error: resError, isSuccess, data }] = useServerAction(checkoutMutation);

  const [error, setError] = useState<string>("");
  const [methodID, setMethodID] = useState<number | null>(null);

  useEffect(() => {
    if (app.methods.length > 0) {
      setMethodID(app.methods[0].id);
    }
  }, [app.methods]);

  const dispatch = useAppDispatch();

  const { useFormApi, isMemberValid } = useValidateMemberBeforeCheckout();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError: setFormError
  } = useFormApi;

  const { displayErrors } = useResponseToastHandler({ setError: setFormError });
  const fireAddPaymentInfoEvent = useFireAddPaymentInfoEvent();

  useEffect(() => {
    if (isSuccess && data) {
      if (
        (
          data as {
            redirect_url: string;
          }
        ).redirect_url
      ) {
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
    }
  }, [data, isSuccess, fireAddPaymentInfoEvent]);

  useEffect(() => {
    if (isError && resError) {
      // eslint-disable-next-line no-console
      console.log(resError);
      dispatch(setCheckoutProcessing(false));
      displayErrors({ error: resError });
    }
  }, [isError, resError, dispatch]);

  const onSubmit = handleSubmit(async () => {
    if (!methodID) {
      return;
    }

    const memberInfo = isMemberValid();

    if (!memberInfo) {
      return;
    }

    dispatch(setCheckoutProcessing(true));

    await checkout({
      payment_gateway: PAYMENT_GATEWAY.MY_FATOORAH,
      payment_method_id: methodID,
      ...memberInfo
    });
  });

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-4 border-t border-gray-300 p-4">
        <MemberInfo
          className="border-t-0  p-0"
          control={control}
          errors={errors}
        />
        <Grid
          columns={{
            md: 2,
            sm: 1
          }}
          gap={{
            xs: "0.75rem",
            sm: "0.75rem",
            md: "0.75rem",
            lg: "0.75rem",
            xl: "0.75rem"
          }}
        >
          {app.methods.map((method) => (
            <Grid.Cell key={method.id}>
              <label
                htmlFor={method.name_en}
                className={cn(
                  "w-full rounded-lg border p-4 transition-colors",
                  "flex items-center justify-between gap-8",
                  methodID === method.id ? "border-primary bg-primary-50" : "border-gray"
                )}
              >
                <Form.Radio
                  id={method.name_en}
                  color="primary"
                  value={method.id}
                  classNames={{
                    label: cn(methodID === method.id ? "text-black" : "text-black/40")
                  }}
                  checked={methodID === method.id}
                  label={method.name_ar}
                  description={method.name_en}
                  onChange={() => {
                    setMethodID(method.id);
                  }}
                />
                <Icon
                  className="text-gray-900"
                  size="xl"
                  children={
                    <img
                      src={method.logo}
                      alt={method.name_ar}
                    />
                  }
                />
              </label>
            </Grid.Cell>
          ))}
        </Grid>
      </div>
      <div className="space-y-2 border-t border-gray-300 p-4">
        <Button
          onPress={() => onSubmit()}
          isDisabled={!methodID}
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

export default MyfatoorahCheckout;
