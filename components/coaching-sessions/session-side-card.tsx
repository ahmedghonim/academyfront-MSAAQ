"use client";

import React from "react";

import { useTranslations } from "next-intl";

import TamaraWidget, { TamaraWidgetType } from "@/components/TamaraWidget";
import { ProductMobileImages, ProductPrice, ProductProfileCard } from "@/components/product";
import { useFormatPrice } from "@/hooks";
import { Appointment, Product } from "@/types";
import { calculateDiscount, decimalToTime } from "@/utils";
import transWithCount from "@/utils/trans-with-count";

import { ClockIcon, UsersIcon, VideoCameraIcon } from "@heroicons/react/24/outline";

import { Alert, Badge, Button, Typography } from "@msaaqcom/abjad";

interface Props {
  product: Product;
  pendingAppointments?: Appointment[];
}

const SessionSideCard = ({ product, pendingAppointments }: Props) => {
  const t = useTranslations();

  const { formatPlainPrice } = useFormatPrice();

  const duration = decimalToTime(product.duration);

  return (
    <ProductProfileCard
      reviewsEnabled={product.meta.reviews_enabled}
      append={<ProductMobileImages product={product} />}
      badge={
        product?.sales_price > 0 ? (
          <Badge
            color="warning"
            variant="soft"
            size="md"
            rounded="full"
          >
            {t("common.discount", {
              discount: calculateDiscount(product.sales_price, product.price)
            })}
          </Badge>
        ) : null
      }
      title={product?.title}
      summary={product?.summary}
      ratings={product.avg_rating ?? 0}
      category={product.category}
      categoryHref={product.category ? `/coaching-sessions/categories/${product.category.slug}` : undefined}
      totalReviews={product.review_count ?? 0}
      ratingsDetails={
        product.meta.show_downloads_count && (
          <Typography.Body
            size="sm"
            className="text-gray-700"
            children={t(transWithCount("students.WithCount", product?.appointments_count || 0), {
              count: product.appointments_count
            })}
          />
        )
      }
      list={{
        items: [
          {
            icon: <ClockIcon />,
            text: t.rich("sessions:session_time", {
              strong: (children) => <strong>{children}</strong>,
              hour: duration.hours,
              minute: duration.minutes
            })
          },
          ...(product.meta.show_downloads_count
            ? [
                {
                  icon: <UsersIcon />,
                  text: t.rich("sessions:booking_number", {
                    strong: (children) => <strong>{children}</strong>,
                    count: product.appointments_count
                  })
                }
              ]
            : []),
          {
            icon: <VideoCameraIcon />,
            text: t.rich("sessions:place", {
              strong: (children) => <strong>{children}</strong>
            })
          }
        ]
      }}
      price={
        <ProductPrice
          price={product?.price}
          salesPrice={product?.sales_price}
        />
      }
      actions={
        pendingAppointments && pendingAppointments.length > 0 ? (
          <>
            <Alert
              variant="soft"
              color="info"
              className="mb-4"
            >
              <Typography.Text
                size="sm"
                className="font-bold text-gray-950"
              >
                {t.rich("sessions:pending_session_alert", {
                  count: pendingAppointments.length
                })}
              </Typography.Text>
            </Alert>
            <Button
              href={`/coaching-sessions/${product.slug}/${pendingAppointments[0].id}/booking-details`}
              className="w-full"
            >
              {t("common.confirm_session")}
            </Button>
          </>
        ) : (
          <Button
            href={`/coaching-sessions/${product.slug}/booking-details`}
            className="w-full"
          >
            {product.can_download ? t("sessions.book_new_session") : t("common.book_it_for_free")}
          </Button>
        )
      }
    >
      <TamaraWidget
        className="mt-4"
        price={formatPlainPrice(product.price)}
        type={TamaraWidgetType.SPILT_AMOUNT_PRODUCT_PAGE}
      />
    </ProductProfileCard>
  );
};

export default SessionSideCard;
