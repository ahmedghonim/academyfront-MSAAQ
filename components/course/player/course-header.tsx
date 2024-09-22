"use client";

import { useState } from "react";

import { useLocale, useTranslations } from "next-intl";
import { isRtlLang } from "rtl-detect";

import { useAppDispatch, useAppSelector, useDownloadFile } from "@/hooks";
import { setOpenRatingModal } from "@/store/slices/courses-slice";
import { Course } from "@/types";

import { ArrowLeftIcon, BookmarkSquareIcon, ShareIcon, StarIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";

import { Button, Dropdown, Icon, Progress, Tooltip, Typography } from "@msaaqcom/abjad";

import { TenantLogo } from "../../../ui/images";
import ShareCourseModal from "../modals/share-course-modal";

export default function CourseHeader({ course }: { course: Course }) {
  const t = useTranslations();
  const locale = useLocale();

  const isRTL = isRtlLang(locale);

  const { downloading, downloadFile } = useDownloadFile();

  const { percentageCompleted } = useAppSelector((state) => state.courses);

  const dispatch = useAppDispatch();

  const [openShareCourseModal, setOpenShareCourseModal] = useState<boolean>(false);
  const handleShareModal = () => {
    setOpenShareCourseModal(!openShareCourseModal);
  };

  return (
    <>
      <nav className="course-player-nav sticky top-0 z-10 max-h-[105px] w-full border-b border-b-gray-400 bg-white">
        <div className="mx-auto px-6 py-4 md:!px-8 md:!py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <TenantLogo className="me-2 md:!me-10" />
              {course && (
                <div className="hidden w-full items-center md:!flex">
                  <div className="relative ml-4 mr-12 hidden md:!flex">
                    <Progress.Ring
                      color="success"
                      value={percentageCompleted}
                      size={60}
                    />
                  </div>
                  <Typography.Text
                    size="sm"
                    children={course?.title}
                    className="font-bold text-success"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Button
                href="/library"
                color="gray"
                icon={<Icon size="md">{isRTL ? <ArrowRightIcon /> : <ArrowLeftIcon />}</Icon>}
                variant="solid"
                size="sm"
              >
                {t("common.my_library")}
              </Button>
              <Dropdown>
                <Dropdown.Trigger>
                  <Button
                    color="gray"
                    variant="outline"
                    icon={
                      <Icon size="sm">
                        <EllipsisVerticalIcon />
                      </Icon>
                    }
                    size="sm"
                    className="ms-2"
                  />
                </Dropdown.Trigger>
                <Dropdown.Menu>
                  <Dropdown.Item
                    children={t("course_player.share_course")}
                    icon={
                      <Icon size="sm">
                        <ShareIcon />
                      </Icon>
                    }
                    onClick={handleShareModal}
                  />
                  <Dropdown.Divider />
                  {course?.is_reviewed ? (
                    <Tooltip>
                      <Tooltip.Trigger>
                        <Dropdown.Item
                          children={t("course_player.review_course")}
                          icon={
                            <Icon size="sm">
                              <StarIcon />
                            </Icon>
                          }
                          disabled
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Content>{t("course_player.already_reviewed_course_tooltip")}</Tooltip.Content>
                    </Tooltip>
                  ) : percentageCompleted < 50 ? (
                    <Tooltip>
                      <Tooltip.Trigger>
                        <Dropdown.Item
                          children={t("course_player.review_course")}
                          icon={
                            <Icon size="sm">
                              <StarIcon />
                            </Icon>
                          }
                          disabled
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Content>{t("course_player.review_course_tooltip")}</Tooltip.Content>
                    </Tooltip>
                  ) : (
                    course?.settings.reviews_enabled && (
                      <Dropdown.Item
                        children={t("course_player.review_course")}
                        icon={
                          <Icon size="sm">
                            <StarIcon />
                          </Icon>
                        }
                        onClick={() => {
                          //TODO:update reviews list after review from content page
                          dispatch(setOpenRatingModal(true));
                        }}
                      />
                    )
                  )}
                  {course?.eligible_for_certificate && (
                    <>
                      <Dropdown.Divider />
                      {percentageCompleted < 100 ? (
                        <Tooltip>
                          <Tooltip.Trigger>
                            <Dropdown.Item
                              children={t("course_player.course_certificate")}
                              icon={
                                <Icon size="sm">
                                  <BookmarkSquareIcon />
                                </Icon>
                              }
                              disabled
                            />
                          </Tooltip.Trigger>
                          <Tooltip.Content>{t("course_player.course_certificate_tooltip")}</Tooltip.Content>
                        </Tooltip>
                      ) : (
                        <Dropdown.Item
                          onClick={async () => {
                            if (course) {
                              await downloadFile(`/courses/${course.slug}/certificate`, `${course.title}-certificate`);
                            }
                          }}
                          children={t("course_player.course_certificate")}
                          icon={
                            <Icon size="sm">
                              <BookmarkSquareIcon />
                            </Icon>
                          }
                          disabled={downloading}
                        />
                      )}
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </nav>
      <ShareCourseModal
        course={course}
        openModal={openShareCourseModal}
        setOpenModal={setOpenShareCourseModal}
      />
      {/*
      <RatingCourseModal product={course as Course} /> 
      */}
    </>
  );
}
