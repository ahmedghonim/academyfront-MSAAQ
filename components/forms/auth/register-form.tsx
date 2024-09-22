"use client";

import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import LangSwitcher from "@/components/lang-switcher";
import { useTenant } from "@/components/store/TenantProvider";
import { useResponseToastHandler } from "@/hooks";
import { register } from "@/lib/auth";
import { ProgressBarLink } from "@/providers/progress-bar";
import { APIFetchResponse, FetchErrorType } from "@/server-actions/config/base-query";
import { hasData } from "@/server-actions/config/error-handler";
import { TenantLogo } from "@/ui/images";
import { PhoneInput } from "@/ui/inputs";
import { redirect } from "@/utils/navigation";

import { Button, Card, Form, Typography } from "@msaaqcom/abjad";

interface IFormInputs {
  name: string;
  email: string;
  phone: {
    phone: string;
    phone_code: string;
  };
  password: string;
}

const RegisterForm = () => {
  const t = useTranslations();
  const tenant = useTenant()((state) => state.tenant);

  const [status, setStatus] = useState<string>("");

  const arabicRegex = /^[\u0600-\u06FF\s]+$/;

  const schema = yup.object({
    name: yup
      .string()
      .matches(arabicRegex, () => t("validation.name_must_be_in_arabic"))
      .required(),
    email: yup.string().email().required(),
    phone: yup
      .object({
        phone: yup.string().required(),
        phone_code: yup.string().required()
      })
      .required(),
    password: yup.string().required()
  });

  const {
    handleSubmit,
    control,
    setError,
    getValues,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: "onSubmit"
  });

  const { displayErrors } = useResponseToastHandler({ setError });

  useEffect(() => {
    if (status === "authenticated") {
      window.APP_EVENTS?.SIGN_UP.map((event) =>
        event({
          email: getValues("email") ?? null,
          phone: getValues("phone") ? `${getValues("phone")?.phone} ${getValues("phone")?.phone_code}` : null
        })
      );
      redirect("/");
    }
  }, [status]);

  const onSubmit = handleSubmit(async (data) => {
    if (isSubmitting) return;

    const response = (await register({ ...data, phone: data.phone?.phone, phone_code: data.phone?.phone_code })) as
      | APIFetchResponse<any>
      | FetchErrorType;

    if (displayErrors(response)) return;

    if (hasData(response)) {
      const { status } = response.data;

      setStatus(status);
    }
  });

  return (
    <Card className="mx-auto my-6 flex rounded-lg border-gray shadow sm:w-[32rem]">
      <Card.Body className="p-0">
        <Form
          onSubmit={onSubmit}
          className="space-y-6 p-6"
        >
          <div className="flex justify-between">
            <TenantLogo />
            <LangSwitcher />
          </div>
          <Typography.Text
            as="h1"
            size="md"
            children={t("auth.register_new_account")}
          />
          <div>
            <Controller
              name={"name"}
              control={control}
              render={({ field }) => (
                <Form.Input
                  isRequired
                  autoComplete="name"
                  label={t("common.the_name")}
                  placeholder={t("common.the_name_input_placeholder")}
                  description={t("common.name_in_arabic_helper")}
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name={"email"}
              control={control}
              render={({ field }) => (
                <Form.Input
                  isRequired
                  type="email"
                  autoComplete="email"
                  label={t("common.email")}
                  placeholder={t("common.email_input_placeholder")}
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />

            <div className="mb-6">
              <Controller
                render={({ field }) => (
                  <PhoneInput
                    className="h-12"
                    placeholder={t("common.phone_input_placeholder")}
                    label={t("common.phone")}
                    error={errors.phone?.message}
                    {...field}
                  />
                )}
                name={"phone"}
                control={control}
              />
            </div>

            <Controller
              name={"password"}
              control={control}
              render={({ field }) => (
                <Form.Password
                  isRequired
                  autoComplete="new-password"
                  label={t("common.password")}
                  placeholder={t("common.password_input_placeholder")}
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />
          </div>
          <Typography.Text size="sm">
            {t.rich("auth.accept_terms", {
              privacy: (children) => (
                <ProgressBarLink
                  href="/privacy"
                  className="rounded text-primary underline underline-offset-4 outline-none hover:text-primary-600 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:text-primary-700"
                >
                  {children}
                </ProgressBarLink>
              ),
              terms: (children) => (
                <ProgressBarLink
                  href="/terms"
                  className="rounded text-primary underline underline-offset-4 outline-none hover:text-primary-600 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:text-primary-700"
                >
                  {children}
                </ProgressBarLink>
              ),
              academy: tenant?.title
            })}
          </Typography.Text>
          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              children={t("auth.register_free")}
              isDisabled={!isDirty}
              isLoading={isSubmitting}
            />
            <Typography.Body
              size="md"
              className="text-center"
            >
              {t.rich("auth.already_have_account", {
                a: (children) => (
                  <ProgressBarLink
                    href="/login"
                    className="rounded text-primary underline underline-offset-4 outline-none hover:text-primary-600 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:text-primary-700"
                  >
                    {children}
                  </ProgressBarLink>
                )
              })}
            </Typography.Body>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegisterForm;
