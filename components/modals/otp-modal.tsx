"use client";

import { useEffect, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { useCountdown } from "@/hooks";
import { isEnglish, isNumeric, toEnglishDigits } from "@/utils";

import { InboxIcon } from "@heroicons/react/24/outline";

import { Button, Form, Icon, Modal, ModalProps, Typography } from "@msaaqcom/abjad";

interface Props extends ModalProps {
  method: "email" | "phone";
  resendOTP: () => void;
  isLoading?: boolean;
  verify: (_: string) => void;
  data: {
    email?: string;
    phone?: any;
  };
  disabled?: boolean;
  onChangeDataClick?: () => void;
}

const OtpModal = ({
  method,
  open,
  resendOTP,
  onDismiss,
  verify,
  data,
  disabled,
  isLoading,
  onChangeDataClick
}: Props) => {
  const t = useTranslations();
  const locale = useLocale();
  const [show, setShow] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");

  useEffect(() => {
    setShow(open ?? false);
  }, [open]);

  const [canResendOTP, setCanResendOTP] = useState<boolean>(false);
  const { startCountdown, currentTimeFormatted, resetCountdown } = useCountdown(
    60,
    () => setCanResendOTP(false),
    () => setCanResendOTP(true)
  );

  const handleResendOTP = () => {
    resendOTP();
    resetCountdown();
    startCountdown();
  };

  useEffect(() => {
    resetCountdown();
    startCountdown();
  }, [show]);

  const verifyOTP = (otp: string): string => {
    let value = otp.replace(/[^0-9٠-٩]/g, "");

    value = toEnglishDigits(value);

    if (!isEnglish(value)) {
      value = "";
    }

    if (!isNumeric(value)) {
      value = "";
    }

    return value;
  };

  const handler = (e: string) => {
    let value = verifyOTP(e);

    setOtpValue(value);
    if (value.length === 6) {
      verify(value);
    }
  };

  const loadingDots = isLoading && (
    <div className="p-3">
      <div className="dot-flashing" />
    </div>
  );

  return (
    <Modal
      open={show}
      onDismiss={onDismiss}
      size="sm"
      rounded="2xl"
    >
      <Modal.Body className="flex flex-col items-center p-6">
        <Icon
          size="xl"
          color="gray"
          variant="soft"
          rounded="full"
          children={<InboxIcon />}
        />
        <div className="mt-4 flex flex-col items-center space-y-2">
          {method == "email" ? (
            <>
              <Typography.Text
                as="h3"
                size="md"
                className="font-bold"
                children={t("otp.verify_email")}
              />
              <Typography.Body
                size="sm"
                as="span"
                className="text-center text-gray-700"
                id="otp_description"
                children={t("otp.verify_email_description", {
                  email: data.email
                })}
              />
              <Button
                color="primary"
                size="sm"
                variant="link"
                children={t("otp.change_email")}
                onPress={onChangeDataClick ?? onDismiss}
              />
            </>
          ) : (
            <>
              <Typography.Text
                as="h3"
                size="md"
                className="font-bold"
                children={t("otp.verify_phone")}
              />
              <Typography.Body
                size="sm"
                as="span"
                className="text-gray-700"
                id="otp_description"
                children={t("otp.verify_phone_description", {
                  phone: `${data.phone?.phone_code}${data.phone?.phone}+`
                })}
              />
              <Button
                color="primary"
                size="sm"
                variant="link"
                children={t("otp.change_phone")}
                onPress={onChangeDataClick ?? onDismiss}
              />
            </>
          )}
        </div>
        <div className="mt-4 flex w-full flex-col items-center space-y-2">
          <Form.Input
            aria-label="otp_description"
            placeholder={t("otp.otp_input_placeholder")}
            inputMode="numeric"
            disabled={disabled}
            value={otpValue}
            className="m-0 w-full"
            dir={otpValue || locale == "en" ? "ltr" : "rtl"}
            maxLength={6}
            onPasteCapture={(e) => {
              handler(e.clipboardData.getData("text"));
            }}
            onChange={(e) => {
              handler(e.target.value);
            }}
            {...(locale == "en" ? { append: loadingDots } : { prepend: loadingDots })}
          />
          <Button
            color="primary"
            variant="link"
            size="sm"
            isDisabled={!canResendOTP}
            onPress={() => handleResendOTP()}
          >
            {t.rich("otp.resend_after_secs", {
              span: (c) => {
                return <span className="text-gray-700">{c}</span>;
              },
              secs: currentTimeFormatted
            })}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OtpModal;
