"use client";

import React from "react";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { ActionProps } from "@/components/coaching-sessions/booking-details-layout";
import { useResponseToastHandler } from "@/hooks";
import { FetchErrorType } from "@/server-actions/config/base-query";
import { useBookAppointmentMutation } from "@/store/slices/api/appointmentSlice";
import { useRouter } from "@/utils/navigation";

import { Button } from "@msaaqcom/abjad";

const BookAppointmentAction = ({ start_at, member_timezone, user_id, canConfirm }: ActionProps) => {
  const t = useTranslations();

  const router = useRouter();
  const { appointment } =
    useParams<{
      appointment?: string;
    }>() ?? {};

  const [bookAppointment, { isLoading }] = useBookAppointmentMutation();

  const { displayErrors } = useResponseToastHandler({});

  return (
    <Button
      color="primary"
      variant={"solid"}
      isDisabled={!canConfirm}
      isLoading={isLoading}
      onPress={async () => {
        if (!user_id) {
          return;
        }

        const response = (await bookAppointment({
          slug: appointment as string,
          user_id,
          start_at,
          member_timezone
        })) as FetchErrorType;

        if (displayErrors(response)) {
          return;
        }

        router.push("/library/coaching-sessions");
      }}
    >
      {t("sessions.confirm_booking")}
    </Button>
  );
};

export default BookAppointmentAction;
