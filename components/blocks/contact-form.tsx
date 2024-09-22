"use client";

import { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { useResponseToastHandler, useServerAction } from "@/hooks";
import { createContact } from "@/server-actions/actions/contact-actions";
import { PageBlock } from "@/types";

import { Button, Card, Form } from "@msaaqcom/abjad";

import BaseSection from "./base-section";

interface IFormInputs {
  subject: string;
  name: string;
  email: string;
  message: string;
  path: string;
}

export default function ContactForm({ block }: { block: PageBlock<"contact-form">; children?: React.ReactNode }) {
  const t = useTranslations();

  const schema = yup.object({
    subject: yup.string().required(),
    name: yup.string().required(),
    email: yup.string().email().required(),
    message: yup.string().min(10).required()
  });

  const form = useForm<IFormInputs>({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      subject: "",
      name: "",
      email: "",
      message: "",
      path: ""
    }
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = form;

  const [contactForm, { data, error, isError, isSuccess }] = useServerAction(createContact);
  console.log("data >>>> ", data);
  console.log("error >>>> ", error);
  useEffect(() => {
    if (isSuccess && data) {
      displaySuccess(data);

      reset({
        subject: "",
        name: "",
        email: "",
        message: "",
        path: ""
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
    await contactForm({
      ...data,
      path: window.location.pathname
    });
  };

  return (
    <BaseSection block={block}>
      <div className="col-span-12 flex flex-col gap-2 lg:col-span-6 lg:col-start-4">
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Form.Input
                    label={t("contact_form.subject")}
                    error={errors.subject?.message}
                    placeholder={t("contact_form.subject_input_placeholder")}
                    type="text"
                    {...field}
                  />
                )}
              />
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Form.Input
                    label={t("contact_form.full_name")}
                    error={errors.name?.message}
                    placeholder={t("contact_form.full_name_input_placeholder")}
                    type="text"
                    {...field}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Form.Input
                    label={t("contact_form.email")}
                    error={errors.email?.message}
                    placeholder={t("contact_form.email_input_placeholder")}
                    type="email"
                    {...field}
                  />
                )}
              />
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <Form.Textarea
                    label={t("contact_form.message")}
                    error={errors.message?.message}
                    placeholder={t("contact_form.message_input_placeholder")}
                    {...field}
                  />
                )}
              />
              <Button
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                type="submit"
                color="primary"
                children={t("contact_form.submit")}
              />
            </Form>
          </Card.Body>
        </Card>
      </div>
    </BaseSection>
  );
}
