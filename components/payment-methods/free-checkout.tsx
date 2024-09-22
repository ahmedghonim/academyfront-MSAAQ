"use client";

import { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { CartItem } from "@/components/cart";
import { useAppDispatch, useResponseToastHandler, useServerAction } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { checkoutMutation } from "@/server-actions/actions/checkout-actions";
import { setCheckoutProcessing } from "@/store/slices/checkout-slice";
import { Cart, PAYMENT_GATEWAY } from "@/types";
import { useRouter } from "@/utils/navigation";

import { Button, Card, Form, Typography } from "@msaaqcom/abjad";

interface IFormInputs {
  email: string;
}

const FreeCheckout = ({ cart }: { cart: Cart }) => {
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
    mode: "onSubmit",
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (isSuccess && data) {
      const uuid = (data as { cart: { uuid: string } }).cart.uuid;

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

  const { displayErrors } = useResponseToastHandler({
    setError
  });

  const onSubmit = handleSubmit(async (data) => {
    await dispatch(setCheckoutProcessing(true));

    await checkout({
      payment_gateway: PAYMENT_GATEWAY.FREE,
      ...data
    });

    dispatch(setCheckoutProcessing(false));
  });

  return (
    <Card className="mx-auto my-auto border-0 bg-gray-100 sm:w-[418px] md:my-0 md:w-[518px] lg:w-[618px]">
      <Form onSubmit={onSubmit}>
        <Card.Body className="p-8">
          <Typography.Text
            size="sm"
            className="mb-6 flex font-semibold"
          >
            {t.rich("shopping_cart:title_with_count", {
              span: (c) => <span className="font-normal text-gray-700 ltr:ml-1 rtl:mr-1">{c}</span>,
              count: cart.items.length
            })}
          </Typography.Text>
          <div className="flex flex-col space-y-2">
            {cart.items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
              />
            ))}
          </div>
          <div className="my-6 h-px bg-gray-400" />
          {!auth && (
            <>
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
                    placeholder={t("shopping_cart.email_input_placeholder")}
                    description={t("shopping_cart.email_input_description")}
                    error={errors.email?.message ?? ""}
                    {...field}
                  />
                )}
              />
              <div className="my-6 h-px bg-gray-400" />
            </>
          )}
          <Button
            variant="solid"
            color="primary"
            className="w-full"
            type="submit"
          >
            {t("shopping_cart.free_checkout")}
          </Button>
        </Card.Body>
      </Form>
    </Card>
  );
};

export default FreeCheckout;
