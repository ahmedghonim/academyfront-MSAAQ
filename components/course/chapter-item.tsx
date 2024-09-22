"use client";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { useDrippable } from "@/hooks";
import { ProgressBarLink } from "@/providers/progress-bar";
import { Chapter } from "@/types";
import transWithCount from "@/utils/trans-with-count";

import { ChevronUpIcon, ClockIcon } from "@heroicons/react/24/outline";

import { Button, Collapse, Icon, Tooltip, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import ContentItem from "./content-item";

interface Props {
  chapter: Chapter;
  className?: string;
  reverseContrast?: boolean;
  displayAccessIcon?: boolean;
  defaultOpen?: boolean;
  courseRef: string | number;
  showActions?: boolean;
}

const ChapterItem = ({
  chapter,
  displayAccessIcon = false,
  reverseContrast = false,
  showActions = false,
  defaultOpen,
  className,
  courseRef
}: Props) => {
  const t = useTranslations();
  const { chapterId, contentId } =
    useParams<{
      chapterId: string;
      contentId: string;
    }>() ?? {};

  const drippable = useDrippable(chapter);

  return (
    <Collapse
      defaultOpen={defaultOpen ?? chapter.id.toString() === chapterId}
      className={cn("rounded-lg ", reverseContrast ? "bg-white" : "bg-gray-200", className)}
    >
      {({ isOpen }) => (
        <>
          <Collapse.Button
            className={cn(
              chapter.contents.length > 0 && "hover:bg-gray-400transition-all transition-all hover:bg-gray-400"
            )}
          >
            <div className="flex flex-grow flex-row items-center justify-between">
              <div className="flex items-center">
                <div className="flex flex-col items-start">
                  <Typography.Text
                    as="h3"
                    size="sm"
                    className="line-clamp-1"
                  >
                    {chapter.title}
                  </Typography.Text>
                  <Typography.Body
                    as="span"
                    size="md"
                    className="font-normal text-gray-700"
                    children={t(transWithCount("chapter_contents.WithCount", chapter.contents.length), {
                      count: chapter.contents.length
                    })}
                  />
                </div>
              </div>
              <div className="flex items-center">
                {drippable && (
                  <Tooltip placement="bottom-end">
                    <Tooltip.Trigger>
                      <Icon
                        size="sm"
                        className={cn(reverseContrast ? "px-3" : "px-1")}
                      >
                        <ClockIcon />
                      </Icon>
                    </Tooltip.Trigger>
                    <Tooltip.Content>{drippable}</Tooltip.Content>
                  </Tooltip>
                )}
                <Icon
                  size="md"
                  variant={reverseContrast ? "soft" : "transparent"}
                  color="gray"
                >
                  <ChevronUpIcon
                    className={cn("transition-all duration-300 ease-in-out", !isOpen ? "rotate-180 transform" : "")}
                  />
                </Icon>
              </div>
            </div>
          </Collapse.Button>
          <Collapse.Content className="gap-3 p-4">
            {chapter.contents.map((content) =>
              content.can_access ? (
                <ProgressBarLink
                  href={`/courses/${courseRef}/chapters/${chapter.id}/contents/${content.id}`}
                  key={content.id}
                >
                  <ContentItem
                    reverseContrast={reverseContrast}
                    displayAccessIcon={displayAccessIcon}
                    content={content}
                    prepend={
                      showActions &&
                      !contentId &&
                      !chapterId &&
                      content.type == "video" &&
                      content.can_access && (
                        <Button
                          color="gray"
                          children={t("common.display_video")}
                        />
                      )
                    }
                  />
                </ProgressBarLink>
              ) : (
                <ContentItem
                  key={content.id}
                  reverseContrast={reverseContrast}
                  displayAccessIcon={displayAccessIcon}
                  content={content}
                  prepend={
                    showActions &&
                    !contentId &&
                    !chapterId &&
                    content.type == "video" &&
                    content.can_access && (
                      <Button
                        color="gray"
                        children={t("common.display_video")}
                      />
                    )
                  }
                />
              )
            )}
          </Collapse.Content>
        </>
      )}
    </Collapse>
  );
};

export default ChapterItem;
