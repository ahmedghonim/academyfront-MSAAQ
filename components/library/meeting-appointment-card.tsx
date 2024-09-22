"use client";

import React from "react";

import { useTranslations } from "next-intl";

import dayjs from "@/lib/dayjs";
import { LibraryAppointment } from "@/types";

import { Typography } from "@msaaqcom/abjad";

import AppointmentCard from "./appointment-card";

const MeetingAppointmentCard = ({ appointment }: { appointment: LibraryAppointment }) => {
  const t = useTranslations();

  return (
    <AppointmentCard
      appointment={appointment}
      buttonText={t("library.join_meeting")}
      badgeColor={"danger"}
      badgeLabel={t("library.meeting")}
      dateTimeDetails={
        <div className="mt-1 flex items-center gap-1">
          <Typography.Body
            size="md"
            dir="auto"
            className="font-normal text-gray-700"
            children={dayjs(appointment.start_at).format("DD/MM/YYYY")}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="4"
            height="4"
            viewBox="0 0 4 4"
            fill="none"
          >
            <path
              d="M1.77616 3.44006C0.816164 3.44006 0.368164 2.89606 0.368164 2.16006V1.84006C0.368164 1.10406 0.816164 0.560059 1.77616 0.560059C2.73616 0.560059 3.18416 1.10406 3.18416 1.84006V2.16006C3.18416 2.89606 2.73616 3.44006 1.77616 3.44006Z"
              fill="#171717"
            />
          </svg>

          <Typography.Body
            size="md"
            dir="auto"
            className="font-normal text-gray-700"
            children={`${dayjs(appointment.end_at).format("hh:mm A")} - ${dayjs(appointment.start_at).format(
              "hh:mm A"
            )}`}
          />
          {appointment.is_recurring && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="4"
                height="4"
                viewBox="0 0 4 4"
                fill="none"
              >
                <path
                  d="M1.77616 3.44006C0.816164 3.44006 0.368164 2.89606 0.368164 2.16006V1.84006C0.368164 1.10406 0.816164 0.560059 1.77616 0.560059C2.73616 0.560059 3.18416 1.10406 3.18416 1.84006V2.16006C3.18416 2.89606 2.73616 3.44006 1.77616 3.44006Z"
                  fill="#171717"
                />
              </svg>
              <Typography.Body
                size="md"
                dir="auto"
                className="font-normal text-gray-700"
                children={t("meeting.occurrence", {
                  current: appointment.occurrence?.current,
                  total: appointment.occurrence?.total
                })}
              />
            </>
          )}
        </div>
      }
    />
  );
};

export default MeetingAppointmentCard;
