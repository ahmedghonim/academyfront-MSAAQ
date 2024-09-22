"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { setToggleCourseSidebar } from "@/store/slices/courses-slice";
import { Chapter, Course } from "@/types";

import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

import { Button, Icon, Tooltip, Typography } from "@msaaqcom/abjad";

interface Props {
  title: string;
  course: Course;
}

const ContentHeader = ({ title, course }: Props) => {
  const t = useTranslations();
  const params = useParams<{
    chapterId: string;
    contentId: string;
    slug: string;
  }>();
  const { toggleContentSideBar } = useAppSelector((state) => state.courses);
  const dispatch = useAppDispatch();
  const [currentChapter, setCurrentChapter] = useState<Chapter>();

  useEffect(() => {
    const chapter = course?.chapters.find((chapter) => chapter.id.toString() === params?.chapterId);

    setCurrentChapter(chapter);
  }, [params?.chapterId, course, setCurrentChapter]);

  return (
    <div className="mb-4 mr-auto flex items-center justify-between">
      {params?.contentId ? (
        <div className="flex flex-col items-start justify-start gap-2">
          <Typography.Body
            size="lg"
            className="font-medium"
            children={t("course_player.content_title", { title: title })}
          />
          <Typography.Text
            as="span"
            size="xs"
            className="font-normal text-gray-700"
            children={t("course_player.content_subtitle", { subtitle: currentChapter?.title })}
          />
        </div>
      ) : (
        <Typography.Body
          size="lg"
          className="font-medium"
          children={t("course_player.content_subtitle", { subtitle: currentChapter?.title })}
        />
      )}

      <Tooltip placement="bottom-end">
        <Tooltip.Trigger>
          <Button
            color="gray"
            size="sm"
            icon={<Icon>{toggleContentSideBar ? <ArrowsPointingInIcon /> : <ArrowsPointingOutIcon />}</Icon>}
            onPress={() => dispatch(setToggleCourseSidebar(!toggleContentSideBar))}
            className="ms-4 hidden lg:!block"
          />
        </Tooltip.Trigger>
        <Tooltip.Content>
          {t(toggleContentSideBar ? "course_player:exit_full_screen" : "course_player:full_screen")}
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
};

export default ContentHeader;
