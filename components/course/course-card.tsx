"use client";

import { ReactNode } from "react";

import { useTranslations } from "next-intl";

import { AddToCartButton, ExpressCheckoutButton } from "@/components/cart";
import { ProductPrice } from "@/components/product";
import StarsRating from "@/components/stars-rating";
import dayjs from "@/lib/dayjs";
import { ProgressBarLink } from "@/providers/progress-bar";
import { Course, DAY_MON_YEAR_FORMAT } from "@/types";
import { Thumbnail } from "@/ui/images";
import transWithCount from "@/utils/trans-with-count";

import { AcademicCapIcon, MapPinIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

import { Alert, Badge, Button, Card, Icon, Typography } from "@msaaqcom/abjad";

import ContinueCourseAction from "./continue-course-action";

type CourseCardProps = {
  course: Course;
  children?: ReactNode;
  hasFooter?: boolean;
  hasBadge?: boolean;
};

const CourseCard = ({ course, hasFooter = true, hasBadge = true }: CourseCardProps) => {
  const t = useTranslations();

  return (
    <Card className="group relative h-full transform duration-150 ease-linear hover:-translate-y-2 hover:shadow-[12px_32px_32px_0px_rgba(0,0,0,0.12)]">
      {course.course_type == "on_site" && (
        <Badge
          color={"primary"}
          className="absolute left-6  top-6 z-10"
        >
          <div>
            <div className="flex gap-3">
              <Icon className="text-white">
                <MapPinIcon />
              </Icon>
              <span className="text-sm text-white">{t("common.on_site_course")}</span>
            </div>
          </div>
        </Badge>
      )}
      <Card.Body className="relative flex h-full flex-col p-4">
        <Thumbnail
          src={course.thumbnail}
          alt={course.title}
        />
        <div className="mt-4 flex flex-1 flex-col space-y-2">
          <div className="flex items-start justify-between gap-4">
            <Typography.Body
              as="h3"
              size="base"
              className="break-words font-semibold group-hover:text-primary"
            >
              <ProgressBarLink href={`/courses/${course.slug}`}>
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                />
                {course.title}
              </ProgressBarLink>
            </Typography.Body>
            {hasBadge && (
              <Badge
                rounded="full"
                variant="soft"
                color="gray"
                size="md"
                className="flex-shrink-0 px-5"
                children={t("common.course")}
              />
            )}
          </div>
          <div className="flex flex-1 flex-col justify-end space-y-2">
            <div className="flex items-center justify-between">
              {course.contents_count ? (
                <div className="flex items-center gap-2">
                  <Icon
                    className="text-gray-700"
                    size="sm"
                    children={<AcademicCapIcon />}
                  />
                  <Typography.Body
                    size="md"
                    className="font-medium text-gray-700"
                    children={t(transWithCount("chapter_contents.WithCount", course.contents_count), {
                      count: course.contents_count
                    })}
                  />
                </div>
              ) : null}
              {course.settings.reviews_enabled && (
                <StarsRating
                  className="mr-auto"
                  value={course?.avg_rating ?? 0}
                  size="sm"
                  isReadOnly
                />
              )}
            </div>
            <ProductPrice
              className="py-2"
              price={course.price}
              salesPrice={course.sales_price}
            />
          </div>
        </div>
      </Card.Body>
      {hasFooter && (
        <Card.Footer className="mt-auto flex-col space-y-4">
          {!course.enrolled ? (
            course.settings?.close_enrollments || !course.in_stock ? (
              <Button
                isDisabled
                color="primary"
                size="md"
                variant="solid"
                className="w-full"
                children={t("common.course_enrollment_closed")}
              />
            ) : (
              <div className="flex gap-4">
                <ExpressCheckoutButton
                  product_type="course"
                  product_id={course.id}
                  color="primary"
                  size="md"
                  variant="solid"
                  className="w-full"
                  label={course.price == 0 ? t("common.join_now_for_free") : t("common.buy_now")}
                />
                <AddToCartButton
                  product={course}
                  product_type="course"
                  product_id={course.id}
                  color="gray"
                  size="md"
                  icon={
                    <Icon>
                      <ShoppingCartIcon />
                    </Icon>
                  }
                />
              </div>
            )
          ) : course.course_type == "online" ? (
            course.is_started ? (
              <ContinueCourseAction
                course={course}
                variant="outline"
                className="w-full"
              >
                <span className="absolute -inset-2.5 z-10"></span>
                <span className="relative">{t("common.continue_course")}</span>
              </ContinueCourseAction>
            ) : (
              <Alert
                variant="soft"
                color="gray"
                children={t("common.course_starts_at", {
                  date: dayjs(course.publish_at).format(DAY_MON_YEAR_FORMAT)
                })}
              />
            )
          ) : (
            <Button
              variant="solid"
              href={course.location.url}
              target="_blank"
              color="primary"
              className="w-full"
            >
              {t("common.show_on_google_map")}
            </Button>
          )}
        </Card.Footer>
      )}
    </Card>
  );
};

export default CourseCard;
