"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import { useTranslations } from "next-intl";

import { useAppSelector } from "@/hooks";
import dayjs from "@/lib/dayjs";
import { ProgressBarLink } from "@/providers/progress-bar";
import { CourseSliceStateType } from "@/store/slices/courses-slice";
import { Chapter, Content, Course, Meeting } from "@/types";

import {
  Bars3Icon,
  CalendarIcon,
  ChevronUpIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

import { Button, Collapse, Form, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import EmptyState from "../../empty-state";
import ChapterItem from "../chapter-item";
import ContentItem from "../content-item";
import EmptyChapterItem from "../empty-chapter-item";

const Drawer = dynamic(() => import("@/components/drawer").then((mod) => mod.Drawer), {
  ssr: false
});

type EditedContent = Content<Meeting> & {
  chapter_id: Chapter["id"];
};
const Meetings = ({ course }: { course: Course }) => {
  const t = useTranslations();

  const [meetingContents, setMeetingContents] = useState<{
    today: EditedContent[];
    all: EditedContent[];
  }>({
    today: [],
    all: []
  });

  useEffect(() => {
    if (course) {
      const allMeetings = course.chapters.flatMap((chapter) => {
        return chapter.contents
          .filter((content) => {
            return content.type === "meeting";
          })
          .map((content) => {
            return {
              ...content,
              chapter_id: chapter.id
            };
          });
      }) as EditedContent[];

      setMeetingContents({
        today: allMeetings.filter((content) => dayjs((content.contentable as Meeting).start_at).isToday()),
        all: allMeetings
      });
    }
  }, [course]);

  if (meetingContents.today.length > 0) {
    return (
      <Collapse className={cn("rounded-lg bg-gray-200")}>
        {({ isOpen }) => (
          <>
            <Collapse.Button>
              <div className="flex flex-grow flex-row items-center justify-between">
                <div className="flex items-center  gap-4">
                  <Icon
                    color="primary"
                    rounded="full"
                    size="md"
                    variant="solid"
                  >
                    <CalendarIcon />
                  </Icon>
                  <div className="flex flex-col items-start">
                    <Typography.Text
                      as="h3"
                      size="sm"
                      className="line-clamp-1"
                    >
                      {t("meeting.contents")}
                    </Typography.Text>
                    <Typography.Body
                      as="span"
                      size="md"
                      className="font-normal text-gray-700"
                      children={t("meeting.count", {
                        count: meetingContents.today.length
                      })}
                    />
                  </div>
                </div>
                <Icon
                  size="md"
                  variant={"transparent"}
                  color="gray"
                >
                  <ChevronUpIcon
                    className={cn("transition-all duration-300 ease-in-out", !isOpen ? "rotate-180 transform" : "")}
                  />
                </Icon>
              </div>
            </Collapse.Button>
            <Collapse.Content className="gap-3 p-4">
              {meetingContents.today.map((content) =>
                content.can_access ? (
                  <ProgressBarLink
                    href={
                      content.contentable.is_live
                        ? content.contentable.join_url
                        : `/courses/${course.slug}/chapters/${content.chapter_id}/contents/${content.id}`
                    }
                    target={content.contentable.is_live ? "_blank" : "_self"}
                    key={content.id}
                  >
                    <ContentItem
                      reverseContrast={false}
                      displayAccessIcon={false}
                      content={content}
                      className="flex-col items-end space-y-3"
                      titleClassName="flex-col-reverse items-start justify-start"
                      showIcon={false}
                      joinUrl={
                        content.contentable.is_live && (
                          <Button
                            color="primary"
                            size="sm"
                            className="mr-auto"
                            href={content.contentable.join_url}
                            target="_blank"
                            isDisabled={content.contentable.is_upcoming}
                            children={t("meeting.start")}
                          />
                        )
                      }
                    />
                  </ProgressBarLink>
                ) : (
                  <ContentItem
                    key={content.id}
                    reverseContrast={false}
                    displayAccessIcon={false}
                    content={content}
                  />
                )
              )}
            </Collapse.Content>
          </>
        )}
      </Collapse>
    );
  }

  if (meetingContents.all.length > 0) {
    return (
      <div className="flex flex-row items-center justify-between rounded-lg bg-gray-200 p-4">
        <div className="flex items-center  gap-4">
          <Icon
            color="gray"
            rounded="full"
            size="md"
            variant="solid"
          >
            <CalendarIcon />
          </Icon>
          <div className="flex flex-col items-start">
            <Typography.Text
              as="h3"
              size="sm"
              className="line-clamp-1"
            >
              {t("meeting.empty_contents")}
            </Typography.Text>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
const CourseSidebar = ({ course }: { course: Course }) => {
  const t = useTranslations();
  //   const router = useRouter();
  const { toggleContentSideBar } = useAppSelector<CourseSliceStateType>((state) => state.courses);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  function searchByTitle(title: string) {
    return chapters.filter((chapter) => {
      return chapter.title.includes(title) || chapter.contents.some((content) => content.title.includes(title));
    });
  }

  const [openContentModal, setOpenContentModal] = useState(false);
  const openCart = () => setOpenContentModal(true);
  const closeCart = () => setOpenContentModal(false);

  useEffect(() => {
    if (searchTerm) {
      const match = searchByTitle(searchTerm);

      setChapters(match);
    } else {
      setChapters(course.chapters ?? []);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (course) {
      setChapters(course.chapters);
    }
  }, [course]);

  //   useEffect(() => {
  //     router.events.on("routeChangeComplete", closeCart);

  //     return () => {
  //       router.events.off("routeChangeComplete", closeCart);
  //     };
  //   }, [router.events]);

  return (
    <>
      {/* In Mobile Size */}
      <div className="mt-4 block lg:!hidden">
        <Button
          rounded="full"
          icon={
            <Icon>
              <Bars3Icon />
            </Icon>
          }
          onPress={openCart}
          className="fixed bottom-[110px] left-4 z-10"
        >
          {t("course_player.course_contents")}
        </Button>
        <Drawer
          styleClass="drawer md:!rounded-t-none rounded-t-2xl"
          isOpen={openContentModal}
          onClose={closeCart}
          title={t("course_player.course_contents")}
        >
          <div className="flex flex-col gap-3 px-4 pb-12 pt-4">
            <Form.Input
              id="search"
              aria-describedby="search"
              clearable
              placeholder={t("course_player.search_input_placeholder")}
              prepend={
                <Icon size="md">
                  <MagnifyingGlassIcon />
                </Icon>
              }
              type="text"
              className="mb-4"
              aria-label="chapter-search"
              value={searchTerm}
              onValueChange={(value) => setSearchTerm(value)}
              onClear={() => setSearchTerm("")}
            />
            <Meetings course={course} />
            {chapters.length > 0 ? (
              chapters.map((chapter: Chapter) =>
                chapter.contents.length > 0 ? (
                  <ChapterItem
                    showActions
                    courseRef={course?.slug ?? ""}
                    key={chapter.id}
                    chapter={chapter}
                  />
                ) : (
                  <EmptyChapterItem
                    key={chapter.id}
                    chapter={chapter}
                  />
                )
              )
            ) : (
              <EmptyState
                className="mt-4"
                iconClassName="text-gray-700"
                title={t("empty_sections.no_products")}
                description={t("empty_sections.no_products_description")}
                icon={<MagnifyingGlassCircleIcon />}
              />
            )}
          </div>
        </Drawer>
      </div>
      {/* In Desktop Size */}
      <div
        className={cn(
          "hidden h-full pt-2 transition-all lg:!block",
          toggleContentSideBar ? "w-0" : "me-4 w-full max-w-[450px]"
        )}
      >
        <div
          className={cn("scrollbar-hide border-gray-300 ps-2 lg:!border-e lg:!pe-4", toggleContentSideBar && "hidden")}
        >
          <Form.Input
            id="search"
            aria-describedby="search"
            clearable
            placeholder={t("course_player.search_input_placeholder")}
            prepend={
              <Icon size="md">
                <MagnifyingGlassIcon />
              </Icon>
            }
            type="text"
            className="mb-4"
            aria-label="chapter-search"
            value={searchTerm}
            onValueChange={(value) => setSearchTerm(value)}
            onClear={() => setSearchTerm("")}
          />
          <div className="scrollbar-hide flex flex-col gap-3 overflow-y-scroll pb-10 md:h-[calc(100vh-175px)] [&>*:last-child]:mb-10">
            <Meetings course={course} />
            {chapters.length > 0 ? (
              chapters.map((chapter: Chapter) =>
                chapter.contents.length > 0 ? (
                  <ChapterItem
                    showActions
                    courseRef={course?.slug ?? ""}
                    key={chapter.id}
                    chapter={chapter}
                  />
                ) : (
                  <EmptyChapterItem
                    key={chapter.id}
                    chapter={chapter}
                  />
                )
              )
            ) : (
              <EmptyState
                iconClassName="text-gray-700"
                title={t("common.no_results_found")}
                icon={<MagnifyingGlassCircleIcon />}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseSidebar;
