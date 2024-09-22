"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import DatePicker from "@/components/date-picker";
import { LoadingScreen } from "@/components/loading-screen";
import { ProductPrice } from "@/components/product";
import dayjs from "@/lib/dayjs";
import { useLazyFetchCoachingSessionAppointmentsQuery } from "@/store/slices/api/productSlice";
import { Product } from "@/types";
import { decimalToTime } from "@/utils";

import { ClockIcon, CurrencyDollarIcon, GlobeAltIcon, VideoCameraIcon } from "@heroicons/react/24/outline";

import { Avatar, Button, Card, Form, Icon, Title, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

export interface ActionProps {
  canConfirm: boolean;
  product_id: string | number;
  user_id: string;
  start_at: string;
  member_timezone: string;
}

export default function BookingDetailsLayout({
  renderBookActions,
  product
}: {
  product: Product;
  renderBookActions: (p: ActionProps) => React.ReactNode;
}) {
  const t = useTranslations();

  const { slug } =
    useParams<{
      slug?: string;
    }>() ?? {};

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<number | undefined>(undefined);
  const [month, setMonth] = useState<string>(dayjs().format("YYYY-MM"));
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  const [fetchAppointments, { data, isFetching }] = useLazyFetchCoachingSessionAppointmentsQuery();

  const activeDays = useMemo(() => Object.keys(data ?? {}), [data]);

  const onMonthChange = (date: Date) => {
    setMonth(dayjs(date).format("YYYY-MM"));
  };

  useEffect(() => {
    if (selectedUser && month) {
      fetchAppointments({
        slug: slug as string,
        month,
        user_id: selectedUser
      });
    }
  }, [month, selectedUser]);

  useEffect(() => {
    if (activeDays.length > 0) {
      const filteredDays = activeDays
        .filter((day) => dayjs(day).isSameOrAfter(dayjs(), "day"))
        .sort((a, b) => dayjs(a).diff(dayjs(b)));

      setSelectedDate(dayjs(filteredDays[0]).toDate());
    }
  }, [activeDays, setSelectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const activeDay = dayjs(selectedDate).format("YYYY-MM-DD");
      const day = activeDays.find((day) => dayjs(day).isSame(activeDay, "day"));

      if (day && data) {
        setAvailableTimes(data[day].map((h) => dayjs(h).format("h:mm A")));
      }
    }
  }, [selectedDate, setAvailableTimes]);

  const duration = useMemo(
    () =>
      product
        ? decimalToTime(product.duration)
        : {
            hours: 0,
            minutes: 0
          },
    [product]
  );

  const canConfirm = useMemo(() => {
    return !!(selectedDate && selectedTime && selectedUser);
  }, [selectedDate, selectedTime, selectedUser]);

  useEffect(() => {
    if (product && product.consultants && product.consultants.length > 0) {
      setSelectedUser(product.consultants[0].id);
    }
  }, [product, setSelectedUser]);

  return (
    <Card className="mx-auto max-w-full lg:!max-w-[1050px]">
      <Card.Body>
        <div className="flex flex-col gap-4 lg:!flex-row">
          <div className="w-full lg:!w-[35%]">
            <Card className="border-0 bg-gray-50">
              <Card.Body>
                <div className="mb-4 flex flex-col">
                  <Typography.Body
                    className="text-xl font-semibold"
                    children={product.title}
                  />
                  <Typography.Body
                    className="text-gray-750 text-sm"
                    children={t("sessions.chose_consultants")}
                  />
                </div>
                {product.consultants && (
                  <div className="mb-4 flex flex-col gap-4">
                    {product.consultants.map((user) => (
                      <div
                        key={user.uuid}
                        className={cn(
                          "flex cursor-pointer rounded-2xl bg-white p-4",
                          selectedUser === user.id && "ring-1 ring-primary"
                        )}
                      >
                        <Form.Radio
                          id={user.id.toString()}
                          value={user.id.toString()}
                          name="instructors"
                          checked={selectedUser === user.id}
                          onChange={() => {
                            setSelectedUser(user.id);
                          }}
                          classNames={{
                            base: "flex-grow"
                          }}
                          label={
                            <div className="flex cursor-pointer gap-4">
                              <div>
                                <Avatar
                                  size="lg"
                                  imageUrl={user.avatar}
                                  name={user.name}
                                />
                              </div>
                              <Typography.Body
                                as="h6"
                                size="base"
                                className="ms-2 font-medium"
                              >
                                {user.name}
                              </Typography.Body>
                            </div>
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="rounded-2xl bg-white p-4">
                  <Title
                    className="items-center p-2"
                    title={
                      <ProductPrice
                        classNames={{
                          price: "text-primary",
                          currency: "text-primary"
                        }}
                        price={product?.price}
                        salesPrice={product?.sales_price}
                      />
                    }
                    prepend={
                      <Icon
                        size="sm"
                        color="primary"
                      >
                        <CurrencyDollarIcon />
                      </Icon>
                    }
                  />
                  <Title
                    className="p-2"
                    title={
                      <>
                        <Typography.Body
                          size="md"
                          as="span"
                          className="font-normal text-primary"
                        >
                          {t.rich("sessions:session_time", {
                            strong: (children) => <strong>{children}</strong>,
                            hour: duration.hours,
                            minute: duration.minutes
                          })}
                        </Typography.Body>
                      </>
                    }
                    prepend={
                      <Icon
                        size="sm"
                        color="primary"
                      >
                        <ClockIcon />
                      </Icon>
                    }
                  />
                  <Title
                    className="p-2"
                    title={
                      <>
                        <Typography.Body
                          size="md"
                          as="span"
                          className="font-normal text-primary"
                        >
                          {t.rich("sessions:place", {
                            strong: (children) => <strong>{children}</strong>
                          })}
                        </Typography.Body>
                      </>
                    }
                    prepend={
                      <Icon
                        size="sm"
                        color="primary"
                      >
                        <VideoCameraIcon />
                      </Icon>
                    }
                  />
                  <Title
                    className="p-2"
                    title={
                      <>
                        <Typography.Body
                          size="md"
                          as="span"
                          className="font-normal text-primary"
                        >
                          {t.rich("sessions:time_zone", {
                            strong: (children) => <strong>{children}</strong>,
                            tz: dayjs.tz.guess()
                          })}
                        </Typography.Body>
                      </>
                    }
                    prepend={
                      <Icon
                        size="sm"
                        color={"primary"}
                      >
                        <GlobeAltIcon />
                      </Icon>
                    }
                  />
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="w-full lg:!w-[65%]">
            <Card className="h-full border-0 bg-gray-50">
              <Card.Header>{t("sessions.select_date_and_time")}</Card.Header>
              <Card.Body>
                <div className="flex flex-col gap-6 lg:!flex-row">
                  <div className="range-date-picker relative w-full lg:!w-[60%]">
                    <DatePicker
                      className="w-full rounded-lg bg-white p-4"
                      numberOfMonths={1}
                      value={selectedDate}
                      onChange={setSelectedDate}
                      onNavigate={onMonthChange}
                      activeDays={activeDays}
                    />
                    {isFetching && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70">
                        <LoadingScreen />
                      </div>
                    )}
                  </div>
                  <div className="relative flex max-h-[400px] w-full  flex-col gap-4 overflow-y-auto lg:!w-[40%]">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        className="w-full"
                        size="sm"
                        //@ts-ignore
                        dir="auto"
                        isFetching={isFetching}
                        variant={selectedTime === time ? "solid" : "outline"}
                        children={time}
                        onPress={() => setSelectedTime(time)}
                      />
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <div className="flex justify-between">
          <Button
            color="gray"
            href={`/coaching-sessions/${product.slug}`}
            children={t("common.cancel")}
          />
          {renderBookActions({
            canConfirm,
            product_id: product.id,
            user_id: selectedUser?.toString() ?? "",
            start_at: dayjs(selectedDate).format("YYYY-MM-DD") + " " + selectedTime,
            member_timezone: dayjs.tz.guess()
          })}
        </div>
      </Card.Footer>
    </Card>
  );
}
