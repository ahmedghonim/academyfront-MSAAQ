"use client";

import React, { useMemo } from "react";

import { useTranslations } from "next-intl";

import { ContinueCourseAction } from "@/components/course";
import { ProductPrice } from "@/components/product";
import { useDownloadFile } from "@/hooks";
import dayjs from "@/lib/dayjs";
import { useSession } from "@/providers/session-provider";
import { CartItem as CartItemType, Course, Product, ProductType } from "@/types";
import { Thumbnail } from "@/ui/images";
import { decimalToTime } from "@/utils";

import { CalendarDaysIcon, ClockIcon, GlobeAsiaAustraliaIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

import { Button, Card, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

type CarItemProductProps = {
  className?: string;
  thumbnail: string | null;
  title: string;
  price: number;
  type: string;
  product: Course | Product;
};
type CarItemSessionProps = {
  start_at: string;
  member_timezone: string;
  duration: number;
};
const ProductAction = ({ product }: { product: Product }) => {
  const { downloadFile, isDownloading } = useDownloadFile();
  const t = useTranslations();

  /*TODO: refactor product `ProductAction` to be global one action */
  return product.meta.custom_url ? (
    <Button
      href={product.meta.custom_url}
      target="_blank"
      variant="solid"
      color="primary"
      children={t("common.download_file")}
    />
  ) : (
    <Button
      onPress={() => downloadFile(`/products/${product.slug}/download`, product.title)}
      isLoading={isDownloading(`/products/${product.slug}/download`)}
      icon={
        <Icon size="md">
          <ArrowDownTrayIcon />
        </Icon>
      }
      color="gray"
    >
      {t("common.download_file")}
    </Button>
  );
};

const CarItemProduct = ({ className, thumbnail, title, price, type, product }: CarItemProductProps) => {
  const t = useTranslations();
  const { member } = useSession();

  return (
    <div className={cn("flex flex-col gap-4 rounded-xl p-3 lg:!flex-row lg:items-center", className)}>
      <div className="flex w-full items-center gap-4 rounded-xl p-3">
        <div className="h-20 w-20">
          <Thumbnail
            rounded="md"
            className="h-20 w-20"
            src={thumbnail}
            alt={title}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex w-full items-start justify-between gap-2.5">
            <Typography.Text
              as="h3"
              size="sm"
              className="break-words font-medium lg:w-3/4"
              children={title}
            />
            {!member && (
              <ProductPrice
                classNames={{
                  price: price ? "text-gray-800" : "",
                  currency: price ? "text-gray-800" : ""
                }}
                price={price}
              />
            )}
          </div>
          <Typography.Body
            size="sm"
            className="font-normal text-gray-800"
            children={type}
          />
        </div>
      </div>
      {member ? (
        product.type === "course" ? (
          <ContinueCourseAction
            course={product as Course}
            color="gray"
          />
        ) : product.type === ProductType.DIGITAL ? (
          <ProductAction product={product} />
        ) : product.type === ProductType.COACHING_SESSION ? (
          <Button
            href={
              product.appointment
                ? `/coaching-sessions/${product.slug}/${product.appointment.id}/booking-details`
                : `/coaching-sessions/${product.slug}/booking-details`
            }
            icon={
              <Icon size="md">
                <CalendarDaysIcon />
              </Icon>
            }
            color="gray"
          >
            {t("common.book_it_for_free")}
          </Button>
        ) : null
      ) : null}
    </div>
  );
};

const CarItemSession = ({ start_at, member_timezone, duration }: CarItemSessionProps) => {
  const t = useTranslations();
  const $duration = useMemo(
    () =>
      duration
        ? decimalToTime(duration)
        : {
            hours: 0,
            minutes: 0
          },
    [duration]
  );

  return (
    <Card>
      <Card.Body>
        <ul>
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
                children={dayjs(start_at).format("dddd، D MMMM، YYYY")}
              />
              <Typography.Body
                size="md"
                dir="auto"
                className="font-normal text-black"
                children={dayjs(start_at).format("h:mm A")}
              />
            </div>
          </li>
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
                children={t.rich("sessions:session_time", {
                  strong: (c) => <strong>{c}</strong>,
                  hour: $duration.hours,
                  minute: $duration.minutes
                })}
              />
            </div>
          </li>
          <li className="flex gap-2 py-2">
            <Icon
              size="sm"
              children={<VideoCameraIcon />}
            />
            <div className="flex flex-col">
              <Typography.Body
                size="md"
                dir="auto"
                className="font-normal text-black"
                children={t.rich("sessions:place", {
                  strong: (c) => <strong>{c}</strong>
                })}
              />
            </div>
          </li>
          <li className="flex gap-2 py-2">
            <Icon
              size="sm"
              children={<GlobeAsiaAustraliaIcon />}
            />
            <div className="flex flex-col">
              <Typography.Body
                size="md"
                dir="auto"
                className="font-normal text-black"
                children={t.rich("sessions:time_zone", {
                  strong: (c) => <strong>{c}</strong>,
                  tz: member_timezone
                })}
              />
            </div>
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
};

const CartItem = ({
  className,
  item
}: {
  isLink?: boolean;
  className?: string;

  item: CartItemType;
}) => {
  const t = useTranslations();

  if (item.product.type === ProductType.BUNDLE) {
    return (
      <>
        {item.product.items.map((bundleItem) => (
          <CarItemProduct
            key={bundleItem.id}
            className={className}
            thumbnail={bundleItem.thumbnail}
            title={bundleItem.title}
            price={bundleItem.price}
            type={t(`common.${bundleItem.type}`) as string}
            product={bundleItem}
          />
        ))}
      </>
    );
  }

  return item.meta ? (
    <CarItemSession
      start_at={item.meta.appointment.start_at}
      member_timezone={item.meta.appointment.member_timezone}
      duration={item.meta.appointment.duration}
    />
  ) : (
    <CarItemProduct
      className={className}
      thumbnail={item.product.thumbnail}
      title={item.product.title}
      price={item.product.price}
      type={
        item.type == "course"
          ? (t(`common.${(item.product as Course).course_type}_course`) as string)
          : (t(`common.${item.type}`) as string)
      }
      product={item.product}
    />
  );
};

export default CartItem;
