"use client";

import React, { useCallback } from "react";

import dayjs from "@/lib/dayjs";
import { LibraryAppointment } from "@/types";

import { Badge, Button, Card, Typography } from "@msaaqcom/abjad";

const AppointmentCard = ({
  appointment,
  buttonText,
  badgeColor,
  badgeLabel,
  dateTimeDetails
}: {
  appointment: LibraryAppointment;
  badgeLabel: string;
  buttonText: string;
  badgeColor: string;
  dateTimeDetails: any;
}) => {
  const isThirtyMinutesBeforeAppointment = useCallback((startAt: string) => {
    const appointmentStartTime = dayjs(startAt);
    const thirtyMinutesBefore = dayjs().add(30, "minute");

    return appointmentStartTime.isSameOrBefore(thirtyMinutesBefore, "minute");
  }, []);

  return (
    <Card className="h-full border-0 bg-gray-100">
      <Card.Body className="flex h-full flex-col">
        <div className="mb-3 flex items-start justify-between">
          <Badge
            color={badgeColor as any}
            variant="soft"
          >
            {badgeLabel}
          </Badge>
          {(appointment.type !== "coaching_session" ||
            (appointment.type === "coaching_session" && isThirtyMinutesBeforeAppointment(appointment.start_at))) && (
            <Button
              variant="solid"
              color="primary"
              size="sm"
              href={appointment.join_url}
              target="_blank"
            >
              {buttonText}
            </Button>
          )}
        </div>
        <div className="mt-auto flex flex-col">
          <Typography.Body
            size="base"
            className="font-semibold"
          >
            {appointment.title}
          </Typography.Body>
          {dateTimeDetails}
        </div>
      </Card.Body>
    </Card>
  );
};

export default AppointmentCard;
