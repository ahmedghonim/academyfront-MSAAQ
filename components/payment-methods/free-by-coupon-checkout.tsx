"use client";

import { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useAppDispatch, useResponseToastHandler, useServerAction } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { checkoutMutation } from "@/server-actions/actions/checkout-actions";
import { setCheckoutProcessing } from "@/store/slices/checkout-slice";
import { PAYMENT_GATEWAY } from "@/types";
import { useRouter } from "@/utils/navigation";

import { Alert, Button, Form } from "@msaaqcom/abjad";

interface IFormInputs {
  email: string;
}

const FreeByCouponCheckout = () => {
  const t = useTranslations();
  const router = useRouter();
  const { member } = useSession();
  const auth = Boolean(member);

  const schema = yup.object({
    email: yup.string().when(([], schema) => {
      if (!member) {
        return schema.email().required();
      }

      return schema.nullable().notRequired();
    })
  });

  const [checkout, { isError, error, isSuccess, data }] = useServerAction(checkoutMutation);
  const dispatch = useAppDispatch();
  const {
    control,
    formState: { errors },
    setError,
    handleSubmit
  } = useForm<IFormInputs>({
    mode: "onChange",
    resolver: yupResolver(schema)
  });

  const { displayErrors } = useResponseToastHandler({
    setError
  });

  useEffect(() => {
    if (isSuccess && data) {
      const uuid = (
        data as {
          cart: {
            uuid: string;
          };
        }
      ).cart.uuid;

      if (!uuid) {
        return;
      }

      router.replace(`/cart/${uuid}/thank-you`);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (isError && error) {
      dispatch(setCheckoutProcessing(false));
      displayErrors({ error: error.error });
    }
  }, [isError, error, dispatch]);

  const onSubmit = handleSubmit(async (data) => {
    dispatch(setCheckoutProcessing(true));

    await checkout({
      payment_gateway: PAYMENT_GATEWAY.FREE,
      ...data
    });

    dispatch(setCheckoutProcessing(false));
  });

  return (
    <div className="rounded-lg border border-gray-300">
      <div className="flex flex-col space-y-4 p-4">
        <Alert
          variant="soft"
          color="success"
          title={t("shopping_cart.free_checkout_alert")}
        />
        {!auth && (
          <Controller
            name={"email"}
            control={control}
            render={({ field }) => (
              <Form.Input
                isRequired
                type="email"
                autoComplete="email"
                label={t("common.email")}
                className="mb-0"
                placeholder={t("common.email_input_placeholder")}
                error={errors.email?.message ?? ""}
                {...field}
              />
            )}
          />
        )}
      </div>
      <div className="space-y-2 border-t border-gray-300 p-4">
        <Button
          variant="solid"
          color="primary"
          className="w-full"
          onPress={() => onSubmit()}
        >
          {t("shopping_cart.free_checkout")}
        </Button>
      </div>
    </div>
  );
};

export default FreeByCouponCheckout;
