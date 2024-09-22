"use client";

import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { useCart } from "@/components/store/CartProvider";
import { useServerAction } from "@/hooks";
import { redeemCouponMutation } from "@/server-actions/actions/cart-actions";

import { ReceiptPercentIcon } from "@heroicons/react/24/outline";

import { Button, Form, Icon } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface IFormInputs {
  coupon: string;
}

const CouponInput = ({ coupon, className }: { coupon: string | null; className?: string }) => {
  const t = useTranslations();
  const setCart = useCart()((state) => state.setCart);
  const schema = yup.object({
    coupon: yup.string().required()
  });

  const [redeemCoupon, { isError, isSuccess, data }] = useServerAction(redeemCouponMutation);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: "onSubmit"
  });

  useEffect(() => {
    if (coupon) {
      reset({
        coupon: coupon
      });
      setFeedback(t("shopping_cart.coupon_redeem_success"));
    }
  }, [coupon]);

  useEffect(() => {
    if (isSuccess && data) {
      setCart(data);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (isError) {
      setError(t("shopping_cart.coupon_redeem_error"));
    } else if (isSuccess) {
      setFeedback(t("shopping_cart.coupon_redeem_success"));
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    if (watch("coupon") !== coupon) {
      setFeedback(null);
      setError(null);
    }
  }, [watch("coupon")]);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    if (isSubmitting) {
      return;
    }

    setFeedback(null);
    setError(null);

    await redeemCoupon(data.coupon);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-wrap items-center justify-between gap-3.5", className)}
    >
      <Controller
        render={({ field }) => (
          <Form.Input
            autoComplete="off"
            prepend={
              <Icon
                size="md"
                color="warning"
              >
                <ReceiptPercentIcon />
              </Icon>
            }
            aria-labelledby="coupon-input"
            placeholder={t("shopping_cart.coupon_input_placeholder")}
            classNames={{
              inputWrapper: "bg-white"
            }}
            error={error ? error : undefined}
            clearable
            onClear={async () => {
              await handleSubmit(() => onSubmit({ coupon: "" }))();
              field.onChange("");
            }}
            className="mb-0 shrink grow basis-auto"
            feedback={feedback ? feedback : undefined}
            {...field}
          />
        )}
        name="coupon"
        control={control}
      />
      <Button
        variant="solid"
        color="gray"
        type="submit"
        className="mb-auto shrink grow basis-auto xs:grow-0"
        isDisabled={!isValid || isSubmitting}
        isLoading={isSubmitting}
      >
        {t("shopping_cart.coupon_redeem")}
      </Button>
    </Form>
  );
};

export default CouponInput;
