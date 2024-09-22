"use client";

import { useTranslations } from "next-intl";

import { useDrippable } from "@/hooks";
import { Chapter } from "@/types";
import transWithCount from "@/utils/trans-with-count";

import { ClockIcon } from "@heroicons/react/24/outline";

import { Card, Icon, Tooltip, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface Props {
  chapter: Chapter;
  className?: string;
  reverseContrast?: boolean;
}

const EmptyChapterItem = ({ chapter, reverseContrast = false, className }: Props) => {
  const t = useTranslations();
  const drippable = useDrippable(chapter);

  return (
    <Card className={cn("rounded-lg border-0", reverseContrast ? "bg-white" : "bg-gray-200", className)}>
      <Card.Body>
        <div className="flex flex-grow flex-row items-center justify-between">
          <div className="flex w-full items-center justify-between">
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
                children={t(transWithCount("chapter_contents.WithCount", 0), {
                  count: 0
                })}
              />
            </div>
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
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EmptyChapterItem;
