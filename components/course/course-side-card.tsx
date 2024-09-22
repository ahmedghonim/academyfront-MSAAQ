"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import TamaraWidget, { TamaraWidgetType } from "@/components/TamaraWidget";
import { AddToCartButton, ExpressCheckoutButton } from "@/components/cart";
import { ProductPrice, ProductProfileCard } from "@/components/product";
import { useFormatPrice } from "@/hooks";
import dayjs from "@/lib/dayjs";
import { Course, DAY_MON_YEAR_FORMAT, ReviewsAverage } from "@/types";
import { Thumbnail } from "@/ui/images";
import Player from "@/ui/player";
import { calculateDiscount, decimalToTime } from "@/utils";
import transWithCount from "@/utils/trans-with-count";

import {
  BoltIcon,
  BookmarkSquareIcon,
  CalendarIcon,
  ClockIcon,
  ListBulletIcon,
  RectangleStackIcon,
  ShoppingCartIcon,
  UsersIcon,
  VideoCameraIcon
} from "@heroicons/react/24/outline";

import { Alert, Badge, Button, Icon, Typography } from "@msaaqcom/abjad";

import GumletPlayer from "../gumlet-player";
import ContinueCourseAction from "./continue-course-action";

interface Props {
  course: Course;
  reviewsDistribution?: {
    reviews: ReviewsAverage[];
    average: number;
    total: number;
  };
}

const CourseSideCard = ({ course, reviewsDistribution }: Props) => {
  const t = useTranslations();
  const [dataLength, setDataLength] = useState<{ quizzesLength: number; meetingsLength: number }>();

  const { formatPlainPrice } = useFormatPrice();

  const getMeetingAndQuiz = () => {
    //TODO: refactor this function
    const contentList: any[] = course?.chapters
      .flatMap((chapter) => {
        return chapter.contents.filter((content) => {
          return content.type === "quiz" || content.type === "meeting";
        });
      })
      .filter((content) => content !== undefined);

    const quizzesLength = contentList.filter((content) => content.type === "quiz").length;
    const meetingsLength = contentList.filter((content) => content.type === "meeting").length;

    setDataLength({
      quizzesLength: quizzesLength,
      meetingsLength: meetingsLength
    });

    return dataLength;
  };

  useEffect(() => {
    getMeetingAndQuiz();
  }, [course]);

  return (
    <ProductProfileCard
      reviewsEnabled={course.settings.reviews_enabled}
      append={
        course.intro_video ? (
          course.intro_video.provider == "gumlet" ? (
            <GumletPlayer
              iframeClass="rounded-2xl"
              videoId={course.intro_video.provider_id}
            />
          ) : (
            <div
              dir="ltr"
              className="ms-player-wrapper-toggled-width overflow-hidden rounded-2xl"
            >
              <Player
                rel="0"
                src={course.intro_video.url}
              />
            </div>
          )
        ) : (
          <Thumbnail
            alt={course.title}
            src={course.thumbnail}
            size="lg"
          />
        )
      }
      badge={
        course.sales_price > 0 ? (
          <Badge
            color="warning"
            variant="soft"
            size="md"
            rounded="full"
          >
            {t("common.discount", {
              discount: calculateDiscount(course.sales_price, course.price)
            })}
          </Badge>
        ) : undefined
      }
      title={course.title}
      summary={course.summary}
      category={course.category}
      categoryHref={`/courses/categories/${course.category.slug}`}
      ratings={reviewsDistribution?.average ?? 0}
      totalReviews={reviewsDistribution?.total ?? 0}
      ratingsDetails={
        course.settings.show_enrollments_count && (
          <Typography.Body
            size="sm"
            className="text-gray-700"
            children={t(transWithCount("students.WithCount", course.enrollments_count), {
              count: course.enrollments_count
            })}
          />
        )
      }
      list={{
        label: t("course_page.course_details"),
        className: "course-details-list",
        items: [
          ...(course.timing
            ? [
                {
                  icon: <CalendarIcon />,
                  text: t.rich("course_page.course_date", {
                    strong: (children) => <strong>{children}</strong>,
                    code: (children) => (
                      <Badge
                        color="gray"
                        variant="soft"
                        size="sm"
                      >
                        {children}
                      </Badge>
                    ),
                    from: course.timing.from,
                    to: course.timing.to
                  }),
                  className: "course-timing-item"
                }
              ]
            : []),
          ...(course.course_type == "online"
            ? [
                {
                  icon: <ClockIcon />,
                  text: t.rich(
                    decimalToTime(course.duration).hours > 0
                      ? "course_page.duration_with_hours"
                      : "course_page.duration",
                    {
                      strong: (children) => <strong>{children}</strong>,
                      ...(decimalToTime(course.duration).hours > 0
                        ? {
                            hour: decimalToTime(course.duration).hours,
                            minute: decimalToTime(course.duration).minutes
                          }
                        : {
                            minute: decimalToTime(course.duration).minutes
                          })
                    }
                  ),
                  className: "course-duration-item"
                }
              ]
            : []),
          ...(course.course_type == "on_site"
            ? [
                {
                  icon: <RectangleStackIcon />,
                  text: t.rich(
                    transWithCount(
                      "course_page.days_WithCount",
                      dayjs(course.timing.to).diff(dayjs(course.timing.from))
                    ),
                    {
                      strong: (children) => <strong>{children}</strong>,
                      count: dayjs(course.timing.to).diff(dayjs(course.timing.from), "days")
                    }
                  ),
                  className: "course-days-item"
                }
              ]
            : []),
          ...(course.course_type == "on_site" && course.enrollments_count
            ? [
                {
                  icon: <UsersIcon />,
                  text: t.rich(transWithCount("course_page.enrollments_WithCount", course.enrollments_count), {
                    strong: (children) => <strong>{children}</strong>,
                    count: course.enrollments_count
                  }),
                  className: "course-enrollments-count-item"
                }
              ]
            : []),
          ...(course.course_type == "online"
            ? [
                {
                  icon: <RectangleStackIcon />,
                  text: t.rich(transWithCount("course_page.contents_WithCount", course.contents_count), {
                    strong: (children) => <strong>{children}</strong>,
                    count: course.contents_count
                  }),
                  className: "course-contents-count-item"
                }
              ]
            : []),
          ...(course.difficulty
            ? [
                {
                  icon: <BoltIcon />,
                  text: t.rich("course_page.difficulty", {
                    strong: (children) => <strong>{children}</strong>,
                    difficulty: course.difficulty.name
                  }),
                  className: "course-difficulty-item"
                }
              ]
            : []),
          ...(course.settings.certificate_enabled && course.course_type !== "on_site"
            ? [
                {
                  icon: <BookmarkSquareIcon />,
                  text: t("course_page.certification"),
                  className: "course-certification-item"
                }
              ]
            : []),
          ...(dataLength && dataLength?.meetingsLength > 0
            ? [
                {
                  icon: <VideoCameraIcon />,
                  text: t(transWithCount("course_page.meeting_WithCount", dataLength?.meetingsLength), {
                    count: dataLength?.meetingsLength
                  }),
                  className: "course-meetings-count-item"
                }
              ]
            : []),
          ...(dataLength && dataLength?.quizzesLength > 0
            ? [
                {
                  icon: <ListBulletIcon />,
                  text: t(transWithCount("course_page.quiz_WithCount", dataLength?.quizzesLength), {
                    count: dataLength?.quizzesLength
                  }),
                  className: "course-quizzes-count-item"
                }
              ]
            : []),
          ...(course.settings.limit_seats
            ? [
                {
                  icon: <UsersIcon />,
                  text: t(transWithCount("course_page.seats_WithCount", course.settings.seats), {
                    count: course.settings.seats
                  }),
                  className: "course-seats-count-item"
                }
              ]
            : [])
        ]
      }}
      price={
        <ProductPrice
          price={course.price}
          salesPrice={course.sales_price}
        />
      }
      actions={
        course.enrolled ? (
          <>
            {course.course_type == "online" ? (
              course.is_started ? (
                <ContinueCourseAction
                  course={course}
                  variant="solid"
                  color="primary"
                  className="w-full"
                />
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
          </>
        ) : (
          <>
            {course.settings.close_enrollments || !course.in_stock ? (
              <Button
                isDisabled
                color="primary"
                size="md"
                variant="solid"
                className="w-full"
                children={t("common.course_enrollment_closed")}
              />
            ) : (
              (course.is_started || (!course.is_started && course.settings.early_access)) && (
                <div className="flex flex-wrap items-center gap-4">
                  <ExpressCheckoutButton
                    product_type="course"
                    product_id={course.id}
                    color="primary"
                    size="md"
                    variant="solid"
                    className="shrink grow basis-auto break-words"
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
            )}
          </>
        )
      }
    >
      <TamaraWidget
        className="mt-4"
        price={formatPlainPrice(course.price)}
        type={TamaraWidgetType.SPILT_AMOUNT_PRODUCT_PAGE}
      />
    </ProductProfileCard>
  );
};

export default CourseSideCard;
