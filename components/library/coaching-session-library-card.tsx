"use client";

import React, { ReactNode } from "react";

import { useTranslations } from "next-intl";

import { useAppDispatch } from "@/hooks";
import dayjs from "@/lib/dayjs";
import { ProgressBarLink } from "@/providers/progress-bar";
import { setOpenRatingModal, setProductToReview } from "@/store/slices/courses-slice";
import { Appointment, AppointmentStatus } from "@/types";
import { Thumbnail } from "@/ui/images";

import { CalendarDaysIcon, ClockIcon, StarIcon } from "@heroicons/react/24/outline";

import { Badge, Button, Card, Icon, Typography } from "@msaaqcom/abjad";

type ProductCardProps = {
  appointment: Appointment;
  children?: ReactNode;
};

const CoachingSessionLibraryCard = ({ appointment }: ProductCardProps) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  if (!appointment.product) {
    return null;
  }

  return (
    <Card className="group h-full transform duration-150 ease-linear hover:-translate-y-2 hover:shadow-[12px_32px_32px_0px_rgba(0,0,0,0.12)]">
      <Card.Body className="relative flex h-full flex-col p-4">
        <Thumbnail
          src={appointment.product.thumbnail}
          alt={appointment.product.title}
        />
        <div className="mt-4 flex flex-1 flex-col space-y-2">
          <div className="flex flex-col gap-1">
            <Badge
              rounded="full"
              color={
                appointment.status === AppointmentStatus.PENDING ? "info" : appointment.is_upcoming ? "success" : "gray"
              }
              variant="soft"
              children={
                appointment.status === AppointmentStatus.PENDING
                  ? t("account.pending_session")
                  : appointment.is_upcoming
                  ? t("account.upcoming_session")
                  : t("account.ended_session")
              }
              size="sm"
              className="w-fit"
            />
            <Typography.Body
              as="h3"
              size="base"
              className="break-words font-semibold group-hover:text-primary"
            >
              <ProgressBarLink href={`/coaching-sessions/${appointment.product.slug}`}>
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                />
                {appointment.product.title}
              </ProgressBarLink>
            </Typography.Body>
          </div>
          <ul>
            <li className="flex gap-2 py-2">
              <Icon
                size="sm"
                children={<ClockIcon />}
              />
              <div className="flex flex-col">
                <Typography.Body
                  size="md"
                  dir="auto"
                  className="font-normal text-black"
                  children={t.rich("account:session_time", {
                    strong: (children) => <strong>{children}</strong>,
                    time: (children) => <time dir="auto">{children}</time>,
                    date:
                      appointment.status === AppointmentStatus.PENDING
                        ? t("account.not_confirmed")
                        : `${dayjs(appointment.end_at).format("hh:mm A")} - ${dayjs(appointment.start_at).format(
                            "hh:mm A"
                          )}`
                  })}
                />
              </div>
            </li>
            <li className="flex gap-2 py-2">
              <Icon
                size="sm"
                children={<CalendarDaysIcon />}
              />
              <div className="flex flex-col">
                <Typography.Body
                  size="md"
                  dir="auto"
                  className="font-normal text-black"
                  children={t.rich("account:session_date", {
                    strong: (children) => <strong>{children}</strong>,
                    time: (children) => <time dir="auto">{children}</time>,
                    date:
                      appointment.status === AppointmentStatus.PENDING
                        ? t("account.not_confirmed")
                        : dayjs(appointment.start_at).format("dddd، D MMMM، YYYY")
                  })}
                />
              </div>
            </li>
          </ul>
        </div>
      </Card.Body>
      <Card.Footer className="mt-auto flex-col space-y-4">
        {appointment.is_upcoming ? (
          <Button
            className="w-full"
            children={t("common.attend_session_now")}
            href={appointment.join_url}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <rect
                  x="0.5"
                  width="24"
                  height="24"
                  rx="12"
                  fill="white"
                />
                <path
                  d="M13.6494 12.2903L15.1399 13.994L17.144 15.2748L17.4935 12.3008L17.144 9.39331L15.1014 10.5186L13.6494 12.2903Z"
                  fill="#00832D"
                />
                <path
                  d="M5 14.9986V17.5322C5 18.1114 5.46915 18.5805 6.04839 18.5805H8.58198L9.10618 16.6655L8.58198 14.9986L6.84341 14.4744L5 14.9986Z"
                  fill="#0066DA"
                />
                <path
                  d="M8.58198 6L5 9.58198L6.84341 10.1062L8.58198 9.58198L9.09744 7.93777L8.58198 6Z"
                  fill="#E94235"
                />
                <path
                  d="M8.58198 9.58228H5V14.9989H8.58198V9.58228Z"
                  fill="#2684FC"
                />
                <path
                  d="M19.4318 7.51659L17.1429 9.3932V15.2746L19.4423 17.16C19.7866 17.4291 20.2898 17.1836 20.2898 16.7459V7.92197C20.2898 7.47903 19.7752 7.23615 19.4318 7.51659ZM13.6483 12.2902V14.9986H8.58105V18.5806H16.0945C16.6737 18.5806 17.1429 18.1114 17.1429 17.5322V15.2746L13.6483 12.2902Z"
                  fill="#00AC47"
                />
                <path
                  d="M16.0945 6H8.58105V9.58198H13.6483V12.2903L17.1429 9.39502V7.04839C17.1429 6.46915 16.6737 6 16.0945 6Z"
                  fill="#FFBA00"
                />
              </svg>
            }
          />
        ) : appointment.status === AppointmentStatus.PENDING ? (
          <Button
            variant="solid"
            href={`/coaching-sessions/${appointment.product.slug}/${appointment.id}/booking-details`}
            className="w-full"
            children={t("common.confirm_session")}
          />
        ) : (
          <>
            <Button
              variant="outline"
              href={`/coaching-sessions/${appointment.product.slug}/booking-details`}
              className="w-full"
              children={t("account.buy_session_again")}
            />
            {!appointment.product.is_reviewed && appointment.product.meta.reviews_enabled && (
              <Button
                className="w-full"
                color="gray"
                icon={
                  <Icon size="sm">
                    <StarIcon />
                  </Icon>
                }
                onPress={() => {
                  dispatch(setProductToReview(appointment.product));
                  dispatch(setOpenRatingModal(true));
                }}
                children={t("reviews.review_session")}
              />
            )}
          </>
        )}
      </Card.Footer>
    </Card>
  );
};

export default CoachingSessionLibraryCard;
