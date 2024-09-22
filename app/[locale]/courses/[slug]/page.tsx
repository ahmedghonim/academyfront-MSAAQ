import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import DynamicPage from "@/components/blocks/dynamic-page";
import { AddToCartButton, ExpressCheckoutButton } from "@/components/cart";
import {
  ChapterItem,
  ContinueCourseAction,
  CourseInstructors,
  CourseOnsiteLocation,
  CourseOutcomes,
  CourseSideCard,
  EmptyChapterItem
} from "@/components/course";
import GumletPlayer from "@/components/gumlet-player";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import RootLayout from "@/components/layout/root-layout";
import {
  FloatingActions,
  OtherProductsCard,
  ProductBreadcrumbs,
  ProductPageLayout,
  ProductReviewsSection,
  ProductSectionCard
} from "@/components/product";
import dayjs from "@/lib/dayjs";
import { fetchCourse, fetchInterestingCourses } from "@/server-actions/services/course-service";
import { fetchReviews, fetchReviewsDistribution } from "@/server-actions/services/reviews-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject, Chapter, Course, DAY_MON_YEAR_FORMAT } from "@/types";
import { Thumbnail } from "@/ui/images";
import Player from "@/ui/player";
import { stripHtmlTags } from "@/utils";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { breadcrumbListJsonLd, courseJsonLd } from "@/utils/jsonLd";

import {
  InformationCircleIcon,
  ListBulletIcon,
  MapPinIcon,
  PuzzlePieceIcon,
  RectangleStackIcon,
  ShoppingCartIcon,
  StarIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

import { Alert, Button, Icon, Typography } from "@msaaqcom/abjad";

import CustomPageHeader from "./custom-page-header";
import NelcCard from "./nelc-card";

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata | null> {
  const data = await fetchTenant();
  const course = await fetchCourse(slug);

  if (!data || !course) {
    return null;
  }

  return generateCommonMetadata({
    tenant: data,
    asPath: `/courses/${slug}`,
    title: course.title,
    description: course.meta_description,
    keywords: course.meta_keywords,
    image: course.thumbnail
  });
}

export default async function Page({ params }: { params: AnyObject }) {
  const tenant = await fetchTenant();

  if (!tenant) {
    notFound();
  }

  const course = await fetchCourse(params.slug);

  if (!course) {
    notFound();
  }

  const reviews = await fetchReviews({ limit: 3, relation_type: "course", relation_id: course.id });
  const courses = await fetchInterestingCourses({
    limit: 3,
    slug: params.slug
  });
  const reviewsDistribution = await fetchReviewsDistribution({ relation_type: "course", relation_id: course.id });

  const t = await getTranslations();

  return (
    <RootLayout
      params={params}
      className={`course-page course-page-${course?.id}`}
    >
      <BaseLayout
        renderHeader={() => <Header className={course.page ? "mb-0" : ""} />}
        renderFooter={() => <Footer className={course.page ? "mt-0" : "mt-4 md:mt-8"} />}
        renderMobileNavigation={() => <MobileNavigation />}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                breadcrumbListJsonLd([
                  {
                    name: t("common.section_titles_home_page"),
                    id: `https://${tenant.domain}`
                  },
                  {
                    name: t("common.section_titles_courses"),
                    id: `https://${tenant.domain}/courses`
                  },
                  {
                    name: course?.title as string,
                    id: `https://${tenant.domain}/courses/${course.slug}`
                  }
                ]),
                courseJsonLd(course, tenant, course.avg_rating, course.review_count)
              ]
            })
          }}
        />
        <Container>
          {course.page && course.enrolled && <CustomPageHeader course={course} />}
          {course.page ? (
            <DynamicPage page={course.page} />
          ) : (
            <div className="relative">
              <ProductBreadcrumbs
                className="mb-4 text-gray-700 md:!mb-8"
                path="/courses"
                pathLabel={t("common.section_titles_courses")}
                title={course.title}
              />
              <ProductPageLayout
                sideCard={
                  <CourseSideCard
                    course={course}
                    reviewsDistribution={reviewsDistribution?.data}
                  />
                }
              >
                <div className="hidden md:!block">
                  {course.intro_video ? (
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
                  )}
                </div>
                {course.course_type == "on_site" && (
                  <ProductSectionCard
                    title={t("course_page.onsite_course.details")}
                    icon={<InformationCircleIcon />}
                    children={<CourseOnsiteLocation course={course} />}
                    hasDivider
                  />
                )}
                {course.settings.show_content_instructor && (
                  <ProductSectionCard
                    title={t("course_page.instructors")}
                    icon={<UserGroupIcon />}
                    className="flex flex-col space-y-4"
                    children={<CourseInstructors instructors={course.instructors} />}
                    hasDivider
                  />
                )}
                {tenant.nelc_compliant && (
                  <ProductSectionCard
                    title={t("course_page.guides_getting_started")}
                    icon={<StarIcon />}
                    children={<NelcCard />}
                    hasDivider
                  />
                )}
                {stripHtmlTags(course.description) && (
                  <ProductSectionCard
                    title={t("course_page.description")}
                    icon={<InformationCircleIcon />}
                    children={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: course.description
                        }}
                        className="prose prose-sm prose-stone sm:prose-base lg:prose-lg h-full max-w-full [&_iframe]:h-48 [&_iframe]:max-w-full sm:[&_iframe]:h-64 md:[&_iframe]:h-64 lg:[&_iframe]:h-80"
                      />
                    }
                    hasDivider
                  />
                )}
                {course.outcomes.length > 0 && (
                  <ProductSectionCard
                    title={t("course_page.outcomes")}
                    icon={<PuzzlePieceIcon />}
                    children={<CourseOutcomes outcomes={course.outcomes} />}
                    hasDivider
                  />
                )}
                {course.requirements.length > 0 && (
                  <ProductSectionCard
                    title={t("course_page.requirements")}
                    icon={<ListBulletIcon />}
                    children={<CourseOutcomes outcomes={course.requirements} />}
                    hasDivider
                  />
                )}
                {course.course_type == "online" && (
                  <ProductSectionCard
                    title={t("course_page.chapters")}
                    icon={<RectangleStackIcon />}
                    children={
                      <div className="flex flex-col space-y-4">
                        {course.chapters.map((chapter: Chapter, index) =>
                          chapter.contents.length > 0 ? (
                            <ChapterItem
                              courseRef={course.slug}
                              defaultOpen={index === 0}
                              key={chapter.id}
                              chapter={chapter}
                              reverseContrast={true}
                              displayAccessIcon={true}
                            />
                          ) : (
                            <EmptyChapterItem
                              reverseContrast={true}
                              key={chapter.id}
                              chapter={chapter}
                            />
                          )
                        )}
                      </div>
                    }
                    hasDivider
                  />
                )}
                <ProductReviewsSection
                  reviewsDistribution={reviewsDistribution.data}
                  initialReviews={reviews}
                  product={course}
                  reviewsEnabled={course.settings.reviews_enabled}
                />
              </ProductPageLayout>
              <OtherProductsCard
                products={courses.data}
                type="course"
              />
            </div>
          )}
        </Container>
        <FloatingActions
          product={course as Course}
          type="course"
          actions={
            course.enrolled ? (
              <>
                {course.course_type == "online" ? (
                  course.is_started ? (
                    <>
                      {course.page && (
                        <div className="mb-2 flex flex-col gap-2">
                          <Typography.Body
                            size="md"
                            className="font-semibold text-success"
                          >
                            {t("course_page.you_are_enrolled_in_this_course")}
                          </Typography.Body>
                          <Typography.Body
                            size="lg"
                            className="font-bold"
                          >
                            {course.title}
                          </Typography.Body>
                        </div>
                      )}
                      <ContinueCourseAction
                        course={course}
                        variant="solid"
                        color="primary"
                        className="w-full"
                      />
                    </>
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
                    variant="outline"
                    icon={
                      <Icon>
                        <MapPinIcon />
                      </Icon>
                    }
                    href={course.location.url}
                    target="_blank"
                    color="primary"
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
                        className="shrink grow basis-auto break-words"
                        product_type="course"
                        product_id={course.id}
                        color="primary"
                        size="md"
                        variant="solid"
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
        />
      </BaseLayout>
    </RootLayout>
  );
}
