"use client";

import React from "react";

import { useTranslations } from "next-intl";

import { GoogleMeetIcon } from "@/components/icons";
import { ProductSectionCard } from "@/components/product";
import dayjs from "@/lib/dayjs";
import { Appointment, Product } from "@/types";

import { CalendarIcon, ClockIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

import { Badge, Button, Card, Grid, Icon, Typography } from "@msaaqcom/abjad";

interface Props {
  product: Product;
  appointments: Appointment[];
}

const ActiveAppointments = ({ product, appointments }: Props) => {
  const t = useTranslations();

  if (!product.can_download) {
    return null;
  }

  if (!appointments.length) {
    return null;
  }

  return (
    <ProductSectionCard
      title={t("sessions.reservation_details")}
      icon={<InformationCircleIcon />}
      children={
        <div className="flex flex-col space-y-4">
          {appointments.map((appointment) => {
            return (
              <Card
                key={appointment.id}
                className="mb-4 h-full border-0 last:mb-0"
              >
                <Card.Body className="p-6">
                  {appointment.is_upcoming && appointment.join_url && (
                    <div className="mb-6 flex flex-col items-start justify-between space-y-2 md:!flex-row md:space-y-0">
                      <Badge
                        rounded="full"
                        color="success"
                        variant="soft"
                        children={t("common.upcoming_session")}
                        size="sm"
                        className="w-fit"
                      />
                      <Button
                        className="w-full md:!w-auto"
                        children={t("common.attend_session_now")}
                        variant="outline"
                        href={appointment.join_url}
                        icon={<GoogleMeetIcon />}
                      />
                    </div>
                  )}
                  <Grid
                    columns={{
                      md: 2
                    }}
                    gap={{
                      md: "1rem",
                      lg: "1rem",
                      xl: "1rem"
                    }}
                  >
                    <Grid.Cell>
                      <div className="flex items-start justify-start gap-4 md:flex-col">
                        <Icon
                          size="md"
                          className="p-4"
                          variant="solid"
                          color="gray"
                          rounded="full"
                          children={<ClockIcon />}
                        />
                        <div className="grid">
                          <Typography.Body
                            size="md"
                            className="font-medium text-gray-700"
                            children={t("sessions.session_duration")}
                          />
                          <Typography.Body
                            size="lg"
                            dir="ltr"
                            className="text-end"
                            children={`${dayjs(appointment.end_at).format("hh:mm A")} - ${dayjs(
                              appointment.start_at
                            ).format("hh:mm A")}`}
                          />
                        </div>
                      </div>
                    </Grid.Cell>
                    <Grid.Cell>
                      <div className="flex items-start justify-start gap-4 md:flex-col">
                        <Icon
                          size="md"
                          className="p-4"
                          variant="solid"
                          color="gray"
                          rounded="full"
                          children={<CalendarIcon />}
                        />
                        <div className="grid">
                          <Typography.Body
                            size="md"
                            className="text-gray-700"
                            children={t("sessions.session_date")}
                          />
                          <Typography.Body
                            size="lg"
                            className=""
                            children={dayjs(appointment.start_at).format("dddd، D MMMM، YYYY")}
                          />
                        </div>
                      </div>
                    </Grid.Cell>
                  </Grid>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      }
      hasDivider
    />
  );
};

export default ActiveAppointments;
