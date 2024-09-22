"use client";

import React, { useState } from "react";

import { useLocale, useTranslations } from "next-intl";
import { getLangDir } from "rtl-detect";
import { Swiper, SwiperSlide } from "swiper/react";

import { CoachingSessionAppointmentCard, MeetingAppointmentCard } from "@/components/library";
import { LibraryAppointment } from "@/types";
import { SwiperButtons } from "@/ui/buttons";

import { Button, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

const before =
  "before:pointer-events-none before:absolute before:inset-0 before:z-[2] ltr:before:bg-gradient-to-r rtl:before:bg-gradient-to-l before:from-white before:from-0% before:to-transparent before:to-10%";

const after =
  "after:pointer-events-none after:absolute after:inset-0 after:z-[1] ltr:after:bg-gradient-to-l rtl:after:bg-gradient-to-r after:from-white after:from-0% after:to-transparent after:to-10%";

const UpcomingAppointments = ({ upcomingAppointments }: { upcomingAppointments: any[] }) => {
  const t = useTranslations();
  const lang = useLocale();
  const [appointments, setAppointments] = useState<Array<LibraryAppointment> | undefined>(
    upcomingAppointments.slice(0, 2)
  );

  const [cnBefroe, setCnBefroe] = useState<string>("");
  const [cnAfter, setCnAfter] = useState<string>(after);
  const [slidesLength, setSlidesLength] = useState<number>(0);

  if (!upcomingAppointments.length) {
    return null;
  }
  const dir = getLangDir(lang);

  return (
    <div className="mb-6 space-y-4">
      <Typography.Title
        size="sm"
        className="font-semibold"
      >
        {t("library.upcoming_appointments")}
      </Typography.Title>
      <Swiper
        key={dir}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 16
          },
          1024: {
            slidesPerView: 2.4,
            spaceBetween: 16
          }
        }}
        onInit={(s) => {
          setSlidesLength(s.slides.length);
        }}
        onTransitionStart={(s) => {
          if (s.isBeginning) {
            setCnBefroe("");
            setCnAfter(after);
          }
          if (s.isEnd) {
            setCnAfter("");
            setCnBefroe(before);
          }
        }}
        onTransitionEnd={(s) => {
          if (s.isBeginning) {
            setCnBefroe("");
            setCnAfter(after);
          }
          if (s.isEnd) {
            setCnAfter("");
            setCnBefroe(before);
          }
        }}
        onSliderMove={(s) => {
          if (!s.isBeginning) {
            setCnBefroe(before);
          } else {
            setCnBefroe("");
          }
          if (!s.isEnd) {
            setCnAfter(after);
          } else {
            setCnAfter("");
          }
        }}
        grabCursor
        className={cn("relative hidden md:block", cnBefroe, cnAfter)}
      >
        {upcomingAppointments?.map((appointment) => (
          <SwiperSlide key={appointment.id}>
            {appointment.type === "coaching_session" ? (
              <CoachingSessionAppointmentCard appointment={appointment} />
            ) : (
              <MeetingAppointmentCard appointment={appointment} />
            )}
          </SwiperSlide>
        ))}
        <SwiperButtons
          slidesLength={slidesLength}
          color="primary"
        />
      </Swiper>
      <div className="flex flex-col space-y-4 md:hidden">
        {appointments &&
          appointments.map((appointment) =>
            appointment.type === "coaching_session" ? (
              <CoachingSessionAppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ) : (
              <MeetingAppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            )
          )}
        {appointments && appointments.length > 2 && (
          <Button
            variant="outline"
            color="primary"
            size="sm"
            children={t("library.view_more")}
            onPress={() => setAppointments(upcomingAppointments)}
          />
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
