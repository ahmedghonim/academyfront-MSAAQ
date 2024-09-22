"use client";

import { useEffect } from "react";

import { useParams, useSearchParams } from "next/navigation";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useTenant } from "@/components/store/TenantProvider";
import { useResponseToastHandler } from "@/hooks";
import { resetPassword } from "@/lib/auth";
import { ProgressBarLink } from "@/providers/progress-bar";
import { TenantLogo } from "@/ui/images";
import { redirect } from "@/utils/navigation";

import { Button, Card, Form, Typography } from "@msaaqcom/abjad";

type IFormInputs = {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
};

const ResetTokenPasswordForm = () => {
  const params = useParams<{
    locale: string;
    token: string;
  }>();
  const { token } = params ?? { token: "" };

  const tenant = useTenant()((state) => state.tenant);
  const t = useTranslations();
  const searchParams = useSearchParams();

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
    password_confirmation: yup.string().required()
  });

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: "onSubmit"
  });

  const { displaySuccess, displayErrors } = useResponseToastHandler({ setError });

  useEffect(() => {
    if (searchParams) {
      reset({ email: searchParams?.get("email")!, token: token as string });
    }
  }, [searchParams]);

  const onSubmit = handleSubmit(async (data) => {
    if (isSubmitting) return;

    const response = await resetPassword(data);

    if (displayErrors(response)) return;

    displaySuccess(response);

    redirect("/login");
  });

  return (
    <div className="flex items-center justify-center">
      <Card className="mx-auto my-6 inline-block rounded-lg border-gray shadow sm:w-[32rem]">
        <Card.Body className="p-0">
          <Form
            onSubmit={onSubmit}
            className="space-y-6 p-6"
          >
            <div className="flex justify-between">
              <TenantLogo />
            </div>
            <Typography.Text
              as="h1"
              size="md"
              children={t("auth.set_new_password")}
            />
            <div className="flex flex-col space-y-4">
              <Controller
                name={"password"}
                control={control}
                render={({ field }) => (
                  <Form.Password
                    isRequired
                    autoComplete="new-password"
                    className="mb-0"
                    label={t("common.password")}
                    placeholder={t("common.password_input_placeholder")}
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
                    className="mb-0"
                    autoComplete="new-password"
                    label={t("common.password_confirm")}
                    placeholder={t("common.password_confirm_input_placeholder")}
                    error={errors.password_confirmation?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-col space-y-7">
              <Button
                type="submit"
                children={t("auth.set_password")}
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
              />
              <div className="flex items-center justify-center gap-1 text-center">
                <Typography.Body size="md">
                  {t.rich("common.login_or_register", {
                    register: (children) => (
                      <ProgressBarLink
                        href="/register"
                        className="rounded text-primary underline underline-offset-4 outline-none hover:text-primary-600 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:text-primary-700"
                      >
                        {children}
                      </ProgressBarLink>
                    ),
                    login: (children) => (
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
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResetTokenPasswordForm;
