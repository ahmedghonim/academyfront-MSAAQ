"use client";

import { ReactNode, useMemo } from "react";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import dayjs from "@/lib/dayjs";
import { Content, Meeting, Video } from "@/types";
import { decimalToTime, stripHtmlTags } from "@/utils";

import {
  Bars3BottomRightIcon,
  CalendarIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  LockClosedIcon,
  MicrophoneIcon,
  QuestionMarkCircleIcon,
  VideoCameraIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

import { Badge, Card, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface Props {
  content: Content;
  displayAccessIcon?: boolean;
  prepend?: ReactNode;
  joinUrl?: ReactNode;
  reverseContrast?: boolean;
  className?: string;
  titleClassName?: string;
  showIcon?: boolean;
}

const MeetingStatus = ({ content, className }: { content: Content; className?: string }) => {
  const t = useTranslations();

  if (!content.contentable) {
    return null;
  }

  if ((content as Content<Meeting>).contentable.is_upcoming) {
    return (
      <Badge
        className={className}
        rounded="full"
        variant="soft"
        color="primary"
        size="sm"
        children={t("meeting.is_upcoming")}
      />
    );
  } else if ((content as Content<Meeting>).contentable.is_live) {
    return (
      <Badge
        className={className}
        rounded="full"
        variant="soft"
        color="secondary"
        size="sm"
        children={t("meeting.is_live")}
      />
    );
  }

  return (
    <Badge
      rounded="full"
      variant="soft"
      color="success"
      size="sm"
      className={className}
      children={t("meeting.is_ended")}
    />
  );
};

const MeetingTime = ({ content }: { content: Content<Meeting> }) => {
  const date = useMemo(() => dayjs(content.contentable.start_at).tz(content.contentable.timezone), [content]);

  return (
    <div className="flex items-center gap-1.5">
      <Typography.Body
        dir="ltr"
        as="span"
        size="sm"
        className="font-normal text-gray-700"
      >
        {date.format("D/M/YYYY")}
      </Typography.Body>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="4"
        height="4"
        viewBox="0 0 4 4"
        fill="none"
      >
        <path
          d="M1.77616 3.44006C0.816164 3.44006 0.368164 2.89606 0.368164 2.16006V1.84006C0.368164 1.10406 0.816164 0.560059 1.77616 0.560059C2.73616 0.560059 3.18416 1.10406 3.18416 1.84006V2.16006C3.18416 2.89606 2.73616 3.44006 1.77616 3.44006Z"
          fill="#171717"
        />
      </svg>
      <Typography.Body
        dir="ltr"
        as="span"
        size="sm"
        className="font-normal text-gray-700"
      >
        {date.format("h:mm A")}
      </Typography.Body>
      -
      <Typography.Body
        dir="ltr"
        as="span"
        size="sm"
        className="font-normal text-gray-700"
      >
        {date.add(content.contentable.duration, "seconds").format("h:mm A")}
      </Typography.Body>
    </div>
  );
};

const ContentItem = ({
  content,
  displayAccessIcon,
  reverseContrast,
  prepend,
  joinUrl,
  className,
  titleClassName,
  showIcon = true
}: Props) => {
  const t = useTranslations();
  const contentIcons = useMemo<any>(
    () => ({
      video: <VideoCameraIcon />,
      pdf: <DocumentTextIcon />,
      audio: <MicrophoneIcon />,
      meeting: <CalendarIcon />,
      text: <Bars3BottomRightIcon />,
      quiz: <DocumentCheckIcon />,
      survey: <QuestionMarkCircleIcon />,
      assignment: <DocumentDuplicateIcon />
    }),
    []
  );
  const { contentId } =
    useParams<{
      contentId?: string;
    }>() ?? {};

  const itemSelected = content.id.toString() == contentId;

  return (
    <>
      <Card
        className={cn(
          "rounded-xl transition-all",
          itemSelected ? "border border-primary" : "border border-transparent",
          reverseContrast ? "bg-gray-100 hover:bg-gray-400 " : "bg-white hover:bg-gray-400"
        )}
      >
        <Card.Body className={cn("flex items-center justify-between", className)}>
          <div className="flex w-full items-center gap-4">
            {showIcon && (
              <div className="relative">
                <Icon
                  className={cn(itemSelected ? "border border-dashed border-primary" : "border border-transparent")}
                  color="gray"
                  rounded="full"
                  size="md"
                  variant="soft"
                >
                  {contentIcons[content.type]}
                </Icon>
                {content.completed && (
                  <Icon
                    size="xs"
                    color="success"
                    className="absolute bottom-0 left-0 rounded-full bg-white"
                  >
                    <CheckCircleIcon />
                  </Icon>
                )}
              </div>
            )}
            {displayAccessIcon && (
              <Icon
                size="sm"
                color="gray"
              >
                {content.can_access ? <GlobeAltIcon /> : <LockClosedIcon />}
              </Icon>
            )}

            <div className="flex w-full flex-col">
              <div className={cn("flex w-full flex-row justify-between", titleClassName)}>
                {content.type !== "meeting" && (
                  <Typography.Text
                    as="h4"
                    size="sm"
                    className="font-semibold"
                  >
                    {content.title}
                  </Typography.Text>
                )}

                {content.type === "meeting" && content.contentable && (
                  <div className="flex flex-col">
                    <div className="mb-1 flex w-full items-center gap-2">
                      <MeetingStatus content={content} />
                      {(content as Content<Meeting>).contentable.is_recurring && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="4"
                            height="4"
                            viewBox="0 0 4 4"
                            fill="none"
                          >
                            <path
                              d="M1.77616 3.44006C0.816164 3.44006 0.368164 2.89606 0.368164 2.16006V1.84006C0.368164 1.10406 0.816164 0.560059 1.77616 0.560059C2.73616 0.560059 3.18416 1.10406 3.18416 1.84006V2.16006C3.18416 2.89606 2.73616 3.44006 1.77616 3.44006Z"
                              fill="#171717"
                            />
                          </svg>
                          <Typography.Body
                            dir="ltr"
                            as="span"
                            size="sm"
                            className="font-normal text-gray-700"
                          >
                            {t("meeting.occurrence", {
                              current: (content as Content<Meeting>).contentable.occurrence?.current,
                              total: (content as Content<Meeting>).contentable.occurrence?.total
                            })}
                          </Typography.Body>
                        </>
                      )}
                      {joinUrl}
                    </div>
                    <Typography.Text
                      as="h4"
                      size="sm"
                      className="font-semibold"
                    >
                      {content.title}
                    </Typography.Text>
                  </div>
                )}
              </div>

              {content.type === "meeting" && content.contentable && (
                <MeetingTime content={content as Content<Meeting>} />
              )}
              {content.type === "video" && (content as Content<Video>).contentable?.duration && (
                <Typography.Body
                  as="span"
                  size="sm"
                  className="font-normal text-gray-700"
                >
                  {decimalToTime((content as Content<Video>).contentable.duration).formatted}
                </Typography.Body>
              )}
              {content.description && (
                <Typography.Body
                  as="span"
                  size="sm"
                  className="font-normal text-gray-700"
                  children={stripHtmlTags(content.description)}
                />
              )}
            </div>
          </div>
          {prepend}
        </Card.Body>
      </Card>
    </>
  );
};

export default ContentItem;
