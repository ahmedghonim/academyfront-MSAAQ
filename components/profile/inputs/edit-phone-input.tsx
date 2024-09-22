"use client";

import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { OtpModal } from "@/components/modals";
import { useTenant } from "@/components/store/TenantProvider";
import { useResponseToastHandler } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import { updateLoginCredentials, verifyLoginCredentials } from "@/server-actions/actions/profile-actions";
import { PhoneInput } from "@/ui/inputs";

import { Button, Card, Form } from "@msaaqcom/abjad";

interface IFormInputs {
  phone_code: number;
  phone: {
    phone: string | number;
    phone_code: string | number;
  };
  otp: string;
}

const EditPhoneInput = () => {
  const t = useTranslations();
  const tenant = useTenant()((state) => state.tenant);
  const { member } = useSession();
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [inputEnabled, setInputEnabled] = useState<boolean>(false);

  const schema = yup.object({
    phone: yup.object({
      phone: yup.number().required(),
      phone_code: yup.number().required()
    })
  });

  const {
    handleSubmit,
    setError,
    control,
    reset,
    getValues,
    setFocus,
    formState: { isDirty, isSubmitting }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (member) {
      reset({
        phone: {
          phone: member.phone,
          phone_code: member.phone_code
        }
      });
    }
  }, [member]);

  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });

  const updateLogin = handleSubmit(async (data) => {
    const response = await updateLoginCredentials({
      type: "phone",
      phone: data.phone.phone.toString(),
      phone_code: data.phone.phone_code.toString()
    });

    // if (displayErrors(response)) return;
    //
    // displaySuccess(response);

    if (tenant?.sms_available) {
      setShowOTPModal(true);
    } else {
      setInputEnabled(false);
    }
  });

  const verifyCredentials = async (data: any) => {
    if (isSubmitting) return;

    const response = await verifyLoginCredentials({
      type: "phone",
      phone: data.phone.phone,
      phone_code: data.phone.phone_code,
      otp_code: data.otp
    });

    // if (displayErrors(response)) return;
    //
    // displaySuccess(response);

    reset({
      phone: {
        phone: data.phone.phone,
        phone_code: data.phone.phone_code
      }
    });
    setShowOTPModal(false);
    setInputEnabled(false);
  };

  return (
    <>
      <Form onSubmit={updateLogin}>
        <Card className="mb-4 overflow-visible rounded-xl border-0">
          <Card.Body className="flex flex-col items-end gap-4 rounded-xl bg-gray-100 p-4 md:!flex-row">
            <div className="w-full">
              <Controller
                render={({ field }) => (
                  <PhoneInput
                    isDisabled={!inputEnabled}
                    className="h-12 grow"
                    placeholder={t("common.phone_input_placeholder")}
                    label={t("common.phone")}
                    {...field}
                  />
                )}
                name={"phone"}
                control={control}
              />
            </div>
            <div className="flex gap-4">
              <Button
                type="submit"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
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
                    if (member) {
                      reset({
                        phone: {
                          phone: member.phone,
                          phone_code: member.phone_code
                        }
                      });
                    }
                    setInputEnabled(false);
                  }}
                />
              )}
            </div>
          </Card.Body>
        </Card>
      </Form>
      <OtpModal
        open={showOTPModal}
        method="phone"
        onDismiss={() => {
          setShowOTPModal(false);
          setInputEnabled(false);
        }}
        onChangeDataClick={() => {
          setShowOTPModal(false);
          setInputEnabled(true);
          setFocus("phone");
        }}
        isLoading={isSubmitting}
        resendOTP={updateLogin}
        verify={(otp) => {
          handleSubmit((data) => verifyCredentials({ ...data, otp }))();
        }}
        disabled={isSubmitting}
        data={{ phone: getValues("phone") }}
      />
    </>
  );
};

export default EditPhoneInput;
