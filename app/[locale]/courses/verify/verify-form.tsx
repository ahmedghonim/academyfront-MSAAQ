"use client";

import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { useTenant } from "@/components/store/TenantProvider";
import dayjs from "@/lib/dayjs";
import FingerprintSVGImage from "@/public/images/certificate-verify.svg";
import { Certificate } from "@/types";
import { TenantLogo } from "@/ui/images";
import { Link } from "@/utils/navigation";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

import { Button, Card, Form, Grid, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface IFormInputs {
  serial: string;
}

export default function VerifyForm() {
  const t = useTranslations();
  const tenant = useTenant()((state) => state.tenant);

  const schema = yup.object({
    serial: yup.string().required()
  });

  const {
    handleSubmit,
    control,
    setFocus,
    setError,
    reset,
    formState: { errors, isDirty, isSubmitting, isValid }
  } = useForm<IFormInputs>({
    defaultValues: {
      serial: ""
    },
    mode: "all",
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    setFocus("serial");
  }, [setFocus]);

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isError, setIsError] = useState(false);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const request = await fetch("/api/v1/certificates/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const response = await request.json();

    if (response.data) {
      setIsError(false);
      setCertificate(response.data);
    } else {
      setIsError(true);
      setCertificate(null);
      setError("serial", {
        message: t("verify_certificate.invalid_certificate") as string
      });
    }
  };

  return (
    <>
      <Grid
        columns={{
          md: 2
        }}
        gap={{
          xs: "0",
          sm: "0",
          md: "0",
          lg: "0",
          xl: "0",
          "2xl": "0"
        }}
        className="fixed inset-0 h-screen"
      >
        <Grid.Cell className="bg-primary" />
        <Grid.Cell className="bg-gray-100">
          <Link href="/public">
            <TenantLogo className="fixed bottom-5 left-5 md:!bottom-8 md:!left-8" />
          </Link>
        </Grid.Cell>
      </Grid>
      <Card className="md:p-8 lg:p-10 xl:p-20">
        <Card.Body>
          <Grid
            columns={{
              md: 2
            }}
            gap={{
              md: "3rem",
              lg: "3.5rem",
              xl: "5rem"
            }}
          >
            <Grid.Cell className="flex items-center justify-center">
              <FingerprintSVGImage className="h-56 w-56 text-primary md:h-64 md:w-64 lg:h-80 lg:w-80" />
            </Grid.Cell>
            <Grid.Cell className="flex h-full flex-col items-start justify-center">
              {(isError || certificate) && (
                <Card className="mb-4 mt-4 w-full border-0 bg-gray-50 md:!mt-0">
                  <Card.Body className="p-3">
                    <div className="flex items-center gap-1">
                      <Icon
                        size="sm"
                        className={cn(isError && "text-danger", certificate && "text-success")}
                      >
                        {isError ? <XCircleIcon /> : <CheckCircleIcon />}
                      </Icon>
                      <Typography.Text
                        size="sm"
                        className={cn("font-bold", isError ? "text-danger" : "text-success")}
                        children={t(`verify_certificate.${isError ? "invalid_certificate" : "valid_certificate"}`)}
                      />
                    </div>
                    <div className="flex flex-col justify-between space-y-3">
                      <Typography.Body
                        size="sm"
                        className="text-gray-800"
                      >
                        {certificate
                          ? t("verify_certificate.valid_message", {
                              member: certificate.member.name
                            })
                          : t("verify_certificate.invalid_message")}
                      </Typography.Body>
                      {certificate && (
                        <div className="mt-auto flex flex-col space-y-1 md:!flex-row md:items-center md:justify-between">
                          <Typography.Body
                            size="sm"
                            className="font-semibold text-gray-800"
                            children={tenant?.title}
                          />
                          <Typography.Body
                            size="sm"
                            className="font-semibold text-gray-800"
                            children={dayjs(certificate.created_at).format("D/M/YYYY")}
                          />
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )}
              <Typography.Text
                as="h1"
                size="md"
                children={t("verify_certificate.title")}
                className="font-semibold"
              />
              <Typography.Text
                as="p"
                size="xs"
                children={t("verify_certificate.description")}
                className="mb-4 mt-1 font-normal text-gray-700"
              />
              <Form
                className="w-full"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  control={control}
                  name="serial"
                  render={({ field }) => (
                    <Form.Input
                      label={t("verify_certificate.certificate_number")}
                      placeholder={t("verify_certificate.certificate_number_input_label") as string}
                      isDisabled={Boolean(certificate)}
                      type="text"
                      {...field}
                      error={errors.serial?.message}
                    />
                  )}
                />
                <div className="grid items-center gap-2 md:grid-cols-3">
                  <Button
                    type="submit"
                    className="w-full md:col-span-2"
                    isDisabled={!isDirty || isSubmitting || !isValid || Boolean(certificate)}
                    isLoading={isSubmitting}
                    children={t(`verify_certificate.${certificate ? "re_verify_again" : "verify"}`)}
                  />
                  {certificate && (
                    <Button
                      color="gray"
                      className="w-full"
                      children={t("verify_certificate.re_verify")}
                      onPress={() => {
                        setFocus("serial");
                        reset({
                          serial: ""
                        });
                        setCertificate(null);
                      }}
                    />
                  )}
                </div>
              </Form>
            </Grid.Cell>
          </Grid>
        </Card.Body>
      </Card>
    </>
  );
}
