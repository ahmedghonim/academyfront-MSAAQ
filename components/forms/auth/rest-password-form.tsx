"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import { useTenant } from "@/components/store/TenantProvider";
import { useResponseToastHandler } from "@/hooks";
import { forgetPassword } from "@/lib/auth";
import { ProgressBarLink } from "@/providers/progress-bar";
import { TenantLogo } from "@/ui/images";
import { useRouter } from "@/utils/navigation";

import { Button, Card, Form, Typography } from "@msaaqcom/abjad";

interface IFormInputs {
  email: string;
}

const ResetPasswordForm = () => {
  const t = useTranslations();
  const tenant = useTenant()((state) => state.tenant);
  const router = useRouter();

  const schema = yup.object({
    email: yup.string().email().required()
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: "onSubmit"
  });
  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });

  const onSubmit = handleSubmit(async (data) => {
    if (isSubmitting) return;

    const response = await forgetPassword(data);

    if (displayErrors(response)) return;

    displaySuccess(response);

    router.push("/login");
  });

  return (
    <BaseLayout>
      <Container layout="center">
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
                <div className="flex flex-col space-y-2">
                  <Typography.Text
                    as="h1"
                    size="md"
                    children={t("auth.did_you_forget_your_password")}
                  />
                  <Typography.Body
                    as="span"
                    size="sm"
                    className="text-gray-700"
                    children={t("auth.forget_your_password_description")}
                  />
                </div>

                <Controller
                  name={"email"}
                  control={control}
                  render={({ field }) => (
                    <Form.Input
                      isRequired
                      type="email"
                      autoComplete="email"
                      clearable
                      onClear={() => {
                        field.onChange("");
                      }}
                      label={t("common.email")}
                      placeholder={t("common.email_input_placeholder")}
                      description={t("auth.email_input_description")}
                      error={errors.email?.message}
                      {...field}
                    />
                  )}
                />
                <div className="flex flex-col space-y-7">
                  <Button
                    type="submit"
                    children={t("auth.reset_password")}
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
      </Container>
    </BaseLayout>
  );
};

export default ResetPasswordForm;
