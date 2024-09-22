"use client";

import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { OtpModal } from "@/components/modals";
import { useResponseToastHandler } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { updateLoginCredentials, verifyLoginCredentials } from "@/server-actions/actions/profile-actions";

import { Button, Card, Form } from "@msaaqcom/abjad";

interface IFormInputs {
  email: string;
}

const EditEmailInput = () => {
  const t = useTranslations();
  const { member } = useSession();
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [inputEnabled, setInputEnabled] = useState<boolean>(false);

  const schema = yup.object({
    email: yup.string().required()
  });

  const {
    handleSubmit,
    getValues,
    setError,
    control,
    reset,
    setFocus,
    formState: { isDirty, isSubmitting }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (member) {
      reset({
        email: member.email
      });
    }
  }, [member]);

  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });

  const onSubmit = handleSubmit(async (data) => {
    const { email } = data;
    const response = await updateLoginCredentials({
      type: "email",
      email
    });

    // if (displayErrors(response)) return;

    // displaySuccess(response);

    setShowOTPModal(true);
  });

  const verifyCredentials = async (data: IFormInputs & { otp: string }) => {
    if (isSubmitting) return;

    const response = await verifyLoginCredentials({
      type: "email",
      email: data.email,
      otp_code: data.otp
    });

    // if (displayErrors(response)) return;
    // displaySuccess(response);

    reset({
      email: data.email
    });

    setShowOTPModal(false);
    setInputEnabled(false);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Card className="mb-4 !rounded-xl border-0">
        <Card.Body className="flex flex-col items-end gap-4 rounded-xl bg-gray-100 p-4 md:!flex-row">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Form.Input
                label={t("common.email")}
                clearable
                onClear={() => {
                  field.onChange("");
                }}
                isDisabled={!inputEnabled}
                isRequired
                placeholder="Hello@msaaq.com"
                type="email"
                dir="auto"
                className="mb-0 w-full"
                {...field}
              />
            )}
          />
          <div className="flex gap-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || (!isDirty && inputEnabled)}
              color={inputEnabled ? "primary" : "gray"}
              children={t(inputEnabled ? "common.save_modifications" : "common.edit")}
              onPress={() => {
                if (!isDirty || !inputEnabled) {
                  setInputEnabled(true);
                }
              }}
            />
            {inputEnabled && (
              <Button
                type="button"
                isDisabled={isSubmitting}
                color={"gray"}
                children={t("common.cancel")}
                onPress={() => {
                  reset({
                    email: member?.email
                  });
                  setInputEnabled(false);
                }}
              />
            )}
          </div>
        </Card.Body>
      </Card>
      <OtpModal
        open={showOTPModal}
        method="email"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        onDismiss={() => {
          setShowOTPModal(false);
          setInputEnabled(false);
        }}
        onChangeDataClick={() => {
          setShowOTPModal(false);
          setInputEnabled(true);
          setFocus("email");
        }}
        resendOTP={onSubmit}
        verify={(otp) => {
          handleSubmit((data) => verifyCredentials({ ...data, otp }))();
        }}
        data={{ email: getValues("email") }}
      />
    </Form>
  );
};

export default EditEmailInput;
