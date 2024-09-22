"use client";

import { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { useResponseToastHandler, useServerAction } from "@/hooks";
import { subscribeToNewsletter } from "@/server-actions/actions/contact-actions";
import { PageBlock } from "@/types";

import { Button, Form } from "@msaaqcom/abjad";

import BaseSection from "./base-section";

interface IFormInputs {
  name: string;
  email: string;
}

export default function NewsletterForm({ block }: { block: PageBlock<"newsletter-form">; children?: React.ReactNode }) {
  const t = useTranslations();
  const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required()
  });

  const form = useForm<IFormInputs>({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: ""
    }
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = form;

  const [subscribe, { data, error, isError, isSuccess }] = useServerAction(subscribeToNewsletter);

  useEffect(() => {
    if (isSuccess && data) {
      displaySuccess(data, "info");

      reset({
        name: "",
        email: ""
      });
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (isError && error) {
      displayErrors(error);
    }
  }, [error, isError]);

  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    await subscribe({
      ...data
    });
  };

  return (
    <BaseSection block={block}>
      <div className="col-span-12 flex flex-col gap-2 lg:col-span-6 lg:col-start-4">
        <Form
          className="grid grid-cols-12 items-center gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Form.Input
                classNames={{
                  base: "mb-0",
                  input: "px-3",
                  innerWrapper: "px-0"
                }}
                className="col-span-12 mb-auto md:col-span-3"
                error={errors.name?.message}
                placeholder={t("newsletter_form.name_input_placeholder") as string}
                type="text"
                {...field}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { value, ...rest } }) => (
              <Form.Input
                classNames={{
                  base: "mb-0",
                  input: "px-3",
                  innerWrapper: "px-0"
                }}
                className="col-span-12 mb-auto md:col-span-6"
                error={errors.email?.message}
                value={value}
                dir={value ? "ltr" : ""}
                placeholder={t("newsletter_form.email_input_placeholder") as string}
                type="email"
                {...rest}
              />
            )}
          />
          <Button
            className="col-span-12 mb-auto md:col-span-3"
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            type="submit"
            color="primary"
            children={t("newsletter_form.subscribe")}
          />
        </Form>
      </div>
    </BaseSection>
  );
}
