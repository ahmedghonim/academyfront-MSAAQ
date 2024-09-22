"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import LangSwitcher from "@/components/lang-switcher";
import { OtpModal } from "@/components/modals";
import { useTenant } from "@/components/store/TenantProvider";
import { useResponseToastHandler } from "@/hooks";
import { authorize, verify } from "@/lib/auth";
import { ProgressBarLink } from "@/providers/progress-bar";
import { TenantLogo } from "@/ui/images";
import { PhoneInput } from "@/ui/inputs";

import { InboxIcon, PhoneIcon } from "@heroicons/react/24/outline";

import { Alert, Button, Card, Form, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface IFormInputs {
  method: "phone" | "email";
  password: string;
  email: string;
  phone: {
    phone: string;
    phone_code: string;
  };
  otp: string;
  next_action: "otp" | "password";
}

const LoginForm = () => {
  const t = useTranslations();
  const tenant = useTenant()((state) => state.tenant);
  const searchParams = useSearchParams();

  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const schema = yup.object({
    method: yup.string().required(),
    email: yup
      .string()
      .email()
      .when("method", ([method], schema) => (method === "email" ? schema.required() : schema.nullable().notRequired()))
  });

  const {
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    control,
    setFocus,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      method: "email"
    },
    mode: "onSubmit"
  });

  useEffect(() => {
    if (status === "authenticated") {
      window.APP_EVENTS?.LOGIN.map((event) =>
        event({
          email: getValues("email") ?? null,
          method: getValues("method"),
          phone: getValues("phone") ? `${getValues("phone")?.phone} ${getValues("phone")?.phone_code}` : null
        })
      );
      const callback = searchParams.get("callbackUrl") ?? "/";

      window.location.replace(decodeURIComponent(callback));
    }
  }, [status, searchParams]);

  useEffect(() => {
    if (searchParams && searchParams.get("email")) {
      setValue("email", searchParams.get("email")!);
    }
  }, [searchParams]);
  const { displayErrors } = useResponseToastHandler({ setError });

  const preferredEmail = watch("method") === "email";

  useEffect(() => {
    setShowPasswordForm(false);
    reset({
      method: watch("method")
    });
  }, [watch("method")]);

  const onSubmit = handleSubmit(async (data) => {
    if (isSubmitting) return;

    const response = await authorize({
      via: data.method,
      ...(data.method === "email"
        ? { email: data.email }
        : {
            phone: data.phone?.phone,
            phone_code: data.phone?.phone_code
          })
    });

    if (displayErrors(response)) return;

    if (response.data) {
      const { next_action } = response?.data;

      setValue("next_action", next_action as "otp" | "password");
      if (next_action == "otp") {
        setFocus("otp");
        setShowOTPModal(true);
      }
      if (next_action == "password") {
        setShowPasswordForm(true);
      }
    }
  });

  const verifyLogin = async (data: IFormInputs) => {
    if (isSubmitting) return;

    const { otp, password, phone, method, email, next_action } = data;
    const response = await verify({
      via: next_action,
      ...(method === "email" ? { email: email } : { phone: phone.phone, phone_code: phone.phone_code }),
      ...(next_action === "otp" ? { otp_code: otp } : { password: password })
    });

    if (displayErrors(response)) return;

    if (response.data) {
      const { status } = response.data;

      setStatus(status);
    }
  };

  return (
    <>
      <Card className="mx-auto my-6 flex rounded-lg border-gray shadow sm:max-w-[32rem]">
        <Card.Body className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between">
              <TenantLogo />
              <LangSwitcher />
            </div>
            <div className="flex flex-col space-y-2">
              <Typography.Text
                as="h1"
                size="md"
                children={t("auth.welcome_back")}
              />
              <Typography.Body
                as="span"
                size="sm"
                className="text-gray-700"
                children={t(
                  tenant?.sms_available ? "auth.welcome_back_description" : "auth.welcome_back_description_email_only"
                )}
              />
            </div>
            {tenant?.sms_available && (
              <div className="flex flex-col space-y-4">
                <Typography.Text
                  as="h3"
                  size="sm"
                  className="font-semibold"
                  children={t("auth.login_via")}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                  <Controller
                    name={"method"}
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <label
                        className={cn(
                          "w-full rounded-lg border p-4 transition-colors",
                          "flex items-center justify-between gap-8",
                          value === "email" ? "border-primary bg-primary-50" : "border-gray"
                        )}
                      >
                        <Form.Radio
                          id="method-email"
                          color="primary"
                          value="email"
                          classNames={{
                            label: cn(value === "email" ? "text-black" : "text-black/40")
                          }}
                          checked={value === "email"}
                          label={t("common.email")}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          {...field}
                        />
                        <Icon
                          className="text-gray-900"
                          children={<InboxIcon />}
                        />
                      </label>
                    )}
                  />
                  <Controller
                    name={"method"}
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <label
                        className={cn(
                          "w-full rounded-lg border p-4 transition-colors",
                          "flex items-center justify-between gap-8",
                          value === "phone" ? "border-primary bg-primary-50" : "border-gray"
                        )}
                      >
                        <Form.Radio
                          id="method-phone"
                          color="primary"
                          value="phone"
                          classNames={{
                            label: cn(value === "phone" ? "text-black" : "text-black/40")
                          }}
                          checked={value === "phone"}
                          label={t("common.phone")}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          {...field}
                        />
                        <Icon
                          className="text-gray-900"
                          children={<PhoneIcon />}
                        />
                      </label>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
          {!showPasswordForm && (
            <Form
              onSubmit={onSubmit}
              className="mt-6 space-y-6"
            >
              <div>
                {preferredEmail ? (
                  <Controller
                    name={"email"}
                    control={control}
                    render={({ field }) => (
                      <Form.Input
                        type="email"
                        dir={field.value ? "auto" : "auto"}
                        autoComplete="email"
                        label={t("common.email")}
                        placeholder={t("common.email_input_placeholder")}
                        error={errors.email?.message}
                        {...field}
                      />
                    )}
                  />
                ) : (
                  <>
                    <div className="mb-6">
                      <Controller
                        render={({ field }) => (
                          <PhoneInput
                            className="h-12"
                            placeholder={t("common.phone_input_placeholder")}
                            {...field}
                          />
                        )}
                        name={"phone"}
                        control={control}
                      />
                    </div>

                    <Alert
                      bordered
                      color="gray"
                      description={t("auth.new_way_to_login_description", {
                        digits: "5"
                      })}
                      title={t("auth.new_way_to_login")}
                      variant="soft"
                    />
                  </>
                )}
              </div>
              <div className="flex flex-col space-y-5">
                <Button
                  type="submit"
                  children={t("common.login")}
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                />
                <Typography.Body
                  size="md"
                  className="text-center"
                >
                  {t.rich("auth.register", {
                    a: (children) => (
                      <ProgressBarLink
                        href="/register"
                        className="rounded text-primary underline underline-offset-4 outline-none hover:text-primary-600 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:text-primary-700"
                      >
                        {children}
                      </ProgressBarLink>
                    )
                  })}
                </Typography.Body>
              </div>
            </Form>
          )}
          {showPasswordForm && (
            <Form
              onSubmit={handleSubmit(verifyLogin)}
              className="mt-6 space-y-6"
            >
              <div>
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
                <div className="flex flex-col items-end">
                  <Controller
                    name={"password"}
                    control={control}
                    render={({ field }) => (
                      <Form.Password
                        isRequired
                        autoComplete="current-password"
                        label={t("common.password")}
                        placeholder={t("common.password_input_placeholder")}
                        className="mb-2 w-full"
                        error={errors.password?.message}
                        {...field}
                      />
                    )}
                  />
                  <ProgressBarLink
                    href="/password/reset"
                    className="rounded text-primary underline underline-offset-4 outline-none hover:text-primary-600 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:text-primary-700"
                  >
                    {t("auth.did_you_forget_your_password")}
                  </ProgressBarLink>
                </div>
              </div>
              <div className="flex flex-col space-y-5">
                <Button
                  type="submit"
                  children={t("common.login")}
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                />
                <Typography.Body
                  size="md"
                  className="text-center"
                >
                  {t.rich("auth.register", {
                    a: (children) => (
                      <ProgressBarLink
                        href="/register"
                        className="rounded text-primary underline underline-offset-4 outline-none hover:text-primary-600 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:text-primary-700"
                      >
                        {children}
                      </ProgressBarLink>
                    )
                  })}
                </Typography.Body>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
      <OtpModal
        method={watch("method")}
        isLoading={isSubmitting}
        open={showOTPModal}
        onDismiss={() => setShowOTPModal(false)}
        onChangeDataClick={() => {
          setShowOTPModal(false);
          setFocus(watch("method"));
        }}
        resendOTP={onSubmit}
        data={{
          email: getValues("email"),
          phone: getValues("phone")
        }}
        verify={(otp) => {
          handleSubmit((data) => verifyLogin({ ...data, otp }))();
        }}
      />
    </>
  );
};

export default LoginForm;
