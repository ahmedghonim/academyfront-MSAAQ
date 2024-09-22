"use client";

import { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { setCheckoutMemberEmail } from "@/store/slices/checkout-slice";

import { Form } from "@msaaqcom/abjad";

interface IFormInputs {
  email: string;
}

const FreeCheckout = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { member } = useSession();
  const { errors: storeErrors } = useAppSelector((state) => state.checkout);
  const auth = Boolean(member);

  const schema = yup.object({
    email: yup.string().when(([], schema) => {
      if (!member) {
        return schema.email().required();
      }

      return schema.nullable().notRequired();
    })
  });

  const {
    control,
    setError,
    watch,
    formState: { errors }
  } = useForm<IFormInputs>({
    mode: "onSubmit",
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    dispatch(setCheckoutMemberEmail(watch("email") ?? null));
  }, [watch("email")]);

  useEffect(() => {
    if (storeErrors?.email.message) {
      setError(
        "email",
        {
          type: "required",
          message: storeErrors.email.message
        },
        {
          shouldFocus: true
        }
      );
    }
  }, [storeErrors]);

  if (auth) {
    return null;
  }

  return (
    <div
      className="mt-8 flex flex-col space-y-4"
      id="member-info"
    >
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
    </div>
  );
};

export default FreeCheckout;
