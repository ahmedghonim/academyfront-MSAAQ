"use client";

import { useCallback, useEffect, useState } from "react";

import Image from "next/image";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { CartItem } from "@/components/cart";
import { OtpModal } from "@/components/modals";
import { useTenant } from "@/components/store/TenantProvider";
import { useCartByUUID } from "@/components/store/cart-by-uuid-provider";
import { useResponseToastHandler, useServerAction } from "@/hooks";
import { authorize, verify } from "@/lib/auth";
import { anonymousMutation } from "@/lib/mutations";
import { useSession } from "@/providers/session-provider";
import { useRouter } from "@/utils/navigation";

import { Button, Card, Form, Typography } from "@msaaqcom/abjad";

interface IFormInputs {
  email: string;
  password: string;
  password_confirmation: string;
  otp_code: string;
}

const ThankYouMsaaqPay = () => {
  const t = useTranslations();
  const router = useRouter();

  const [anonymousMut, { error, isSuccess, data, isError }] = useServerAction(anonymousMutation);
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);

  const { cart, payload } = useCartByUUID()((s) => s);

  const tenant = useTenant()((s) => s.tenant);

  const { member } = useSession();

  const wasRecentlyCreated = useCallback(() => {
    if (member) {
      return false;
    }
    if (!payload || !payload.member) {
      return false;
    }

    if (payload.member.login_via === "password") {
      return false;
    }

    return payload.member.login_via === "new_password";
  }, [member, payload]);

  const schema = yup.object({
    password: yup.string().when(([], schema) => {
      if (payload?.member.login_via !== "otp" && (!member || wasRecentlyCreated())) {
        return schema.min(6).required();
      }

      return schema.nullable().notRequired();
    }),
    password_confirmation: yup.string().when(([], schema) => {
      if (wasRecentlyCreated()) {
        return schema.required().oneOf([yup.ref("password")], t("validation.field_must_match_password"));
      }

      return schema.nullable().notRequired();
    })
  });

  const {
    handleSubmit,
    control,
    reset,
    setError,
    setFocus,
    getValues,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: "onSubmit"
  });

  const { displayErrors } = useResponseToastHandler({
    setError
  });

  useEffect(() => {
    if (isSuccess) {
      login({
        via: "password",
        ...getValues()
      });
    }
  }, [isSuccess, data, getValues]);

  useEffect(() => {
    if (isError && error) {
      if (error?.error.status == 403) {
        const params = new URLSearchParams();

        params.set("email", payload?.member?.email);

        router.push(`/login?${params.toString()}`);

        return;
      }

      displayErrors({
        error
      });
    }
  }, [error, isError]);

  useEffect(() => {
    reset({
      email: payload?.member.email || ""
    });
  }, [payload]);

  const guessUrl = useCallback(() => {
    if (
      !cart ||
      (cart.items.filter((item) => item.type === "course").length > 0 &&
        cart.items.filter((item) => item.type === "product").length > 0)
    ) {
      return "/library/courses";
    }

    if (cart.items.every((item) => item.type === "course")) {
      return "/library/courses";
    }

    if (cart.items.every((item) => item.type === "product" && item.meta !== undefined)) {
      return "/library/coaching-sessions";
    } else {
      return "/library/products";
    }
  }, [cart]);

  const sendOTP = handleSubmit(async () => {
    if (!payload) {
      return;
    }

    const response = await authorize({
      via: "email",
      email: payload.member.email
    });

    if (displayErrors(response)) {
      return;
    }

    setShowOTPModal(true);
  });

  const login = async (data: { via: "password" | "otp"; email: string; password?: string; otp_code?: string }) => {
    if (!payload) {
      return;
    }

    const res = await verify({
      ...data
    });

    if (displayErrors(res)) return;

    window.location.replace(guessUrl());
  };

  const onSubmit = handleSubmit(async (data) => {
    //1- update the user password if the user was recently created
    //2- login the user if the user was already a member

    if (!payload) {
      return;
    }

    if (wasRecentlyCreated()) {
      await anonymousMut(payload.action, "patch", {
        password: data.password,
        password_confirmation: data.password_confirmation
      });
    } else {
      await login({
        via: "password",
        ...data
      });
    }
  });

  return (
    <>
      <Form>
        <Card className="mx-auto sm:w-[418px] md:w-[518px] lg:w-[618px]">
          <Card.Body className="flex flex-col space-y-4 !py-6 px-4">
            <div className="flex items-center">
              <Image
                src={"/images/check-success.gif"}
                alt={"check-success"}
                width={100}
                height={100}
                className="select-none"
              />
              <div className="flex flex-col gap-1">
                <Typography.Text
                  size="sm"
                  className="font-semibold text-success"
                  children={
                    !cart?.order_id
                      ? t("thank_you_page.bank_transfer_title")
                      : member
                      ? t("thank_you_page.msaaqpay_title")
                      : t("thank_you_page.msaaqpay_products_access_title")
                  }
                />
                <Typography.Body
                  size="md"
                  className="font-normal text-gray-950"
                  children={
                    !cart?.order_id
                      ? t("thank_you_page.bank_transfer_description")
                      : member
                      ? t("thank_you_page.msaaqpay_description")
                      : t("thank_you_page.msaaqpay_products_access_description", {
                          academy: tenant?.title
                        })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {cart?.items.map((item) => (
                <CartItem
                  className="bg-gray-100"
                  key={item.product.id}
                  item={item}
                />
              ))}
            </div>
            <div className="flex flex-col space-y-6 empty:!m-0">
              {/*
            know user and the emil and phone already given at the first time when was checkout so it only will be sent
            with the form
            */}
              {wasRecentlyCreated() && (
                <>
                  <Controller
                    name={"password"}
                    control={control}
                    render={({ field }) => (
                      <Form.Password
                        isRequired
                        autoComplete="new-password"
                        label={t("common.new_password")}
                        className="mb-0"
                        placeholder={t("common.new_password_placeholder")}
                        error={errors.password?.message}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name={"password_confirmation"}
                    control={control}
                    render={({ field }) => (
                      <Form.Password
                        isRequired
                        autoComplete="new-password"
                        label={t("common.new_password_confirmation")}
                        className="mb-0"
                        placeholder={t("common.new_password_confirmation_placeholder")}
                        error={errors.password_confirmation?.message}
                        {...field}
                      />
                    )}
                  />
                </>
              )}
              {/*
            it means that the user already a member in the academy, not registered recently
            so the email already knowen, and the phone number is already verified
            */}
              {!member && !wasRecentlyCreated() && (
                <>
                  <Controller
                    name={"email"}
                    control={control}
                    render={({ field: { value } }) => (
                      <Form.Input
                        isReadOnly
                        value={value}
                        dir="ltr"
                        type="email"
                        className="mb-0"
                        autoComplete="email"
                        label={t("common.email")}
                        placeholder={t("common.email_input_placeholder")}
                      />
                    )}
                  />
                  {payload?.member.login_via === "password" && (
                    <Controller
                      name={"password"}
                      control={control}
                      render={({ field }) => (
                        <Form.Password
                          isRequired
                          autoComplete="current-password"
                          label={t("common.password")}
                          placeholder={t("common.password_input_placeholder")}
                          className="w-full"
                          error={errors.password?.message}
                          {...field}
                        />
                      )}
                    />
                  )}
                </>
              )}
            </div>
          </Card.Body>
          <Card.Footer>
            {member ? (
              <Button
                href={guessUrl()}
                className="w-full"
                children={t("common.to_library")}
                color="primary"
              />
            ) : payload?.member.login_via === "otp" ? (
              <Button
                type="submit"
                onPress={() => sendOTP()}
                className="w-full"
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                children={t("common.login")}
                color="primary"
              />
            ) : (
              <Button
                type="submit"
                onPress={() => onSubmit()}
                className="w-full"
                isLoading={isSubmitting}
                isDisabled={isSubmitting || !isValid}
                children={t("common.to_library")}
                color="primary"
              />
            )}
          </Card.Footer>
        </Card>
      </Form>
      <OtpModal
        open={showOTPModal}
        method="email"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        onDismiss={() => {
          setShowOTPModal(false);
        }}
        onChangeDataClick={() => {
          setShowOTPModal(false);
          setFocus("email");
        }}
        resendOTP={sendOTP}
        verify={(otp) => {
          handleSubmit((data) => login({ ...data, via: "otp", otp_code: otp }))();
        }}
        data={{ email: payload?.member.email }}
      />
    </>
  );
};

export default ThankYouMsaaqPay;
