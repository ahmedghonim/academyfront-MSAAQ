"use client";

import { useTranslations } from "next-intl";

import { useIsRouteActive } from "@/hooks";
import { ProgressBarLink } from "@/providers/progress-bar";
import { Content, Course } from "@/types";

import {
  Bars3BottomRightIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  DocumentArrowDownIcon
} from "@heroicons/react/24/outline";

import { Navbar } from "@msaaqcom/abjad";

interface LibraryLayoutProps {
  params: {
    slug: string;
    chapterId: string;
    contentId: string;
  };
  content: Content<any>;
  course: Course;
}

const TabsLayout = ({ params, course, content }: LibraryLayoutProps) => {
  const t = useTranslations();
  const { isActive } = useIsRouteActive();

  console.log("course?.settings.disable_comments", course.settings.disable_comments);
  return (
    <Navbar className="scrollbar-hide w-fit overflow-x-scroll">
      <Navbar.Item
        as={ProgressBarLink}
        href={`/courses/${params.slug}/chapters/${params.chapterId}/contents/${params.contentId}`}
        isActive={isActive([`/courses/${params.slug}/chapters/${params.chapterId}/contents/${params.contentId}`])}
        iconAlign="start"
        icon={<Bars3BottomRightIcon />}
      >
        {t("course_player.content_tab")}
      </Navbar.Item>
      {!course?.settings.disable_comments && (
        <Navbar.Item
          as={ProgressBarLink}
          href={`/courses/${params.slug}/chapters/${params.chapterId}/contents/${params.contentId}/comments`}
          isActive={isActive([
            `/courses/${params.slug}/chapters/${params.chapterId}/contents/${params.contentId}/comments`
          ])}
          className="account-courses"
          iconAlign="start"
          icon={<ChatBubbleOvalLeftEllipsisIcon />}
        >
          {t("course_player.comments_tab")}
        </Navbar.Item>
      )}
      {content.attachments && content.attachments.length > 0 && (
        <Navbar.Item
          as={ProgressBarLink}
          href={`/courses/${params.slug}/chapters/${params.chapterId}/contents/${params.contentId}/attachments`}
          isActive={isActive([
            `/courses/${params.slug}/chapters/${params.chapterId}/contents/${params.contentId}/attachments`
          ])}
          iconAlign="start"
          icon={<DocumentArrowDownIcon />}
        >
          {t("course_player.attachments_tab")}
        </Navbar.Item>
      )}
    </Navbar>
  );
};

export default TabsLayout;
