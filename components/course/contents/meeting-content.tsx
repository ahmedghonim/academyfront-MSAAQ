"use client";

import { useTranslations } from "next-intl";

import { useCopyToClipboard } from "@/hooks";
import dayjs from "@/lib/dayjs";
import ZoomLogo from "@/public/images/zoom-logo.svg";
import { Content, Meeting } from "@/types";

import { DocumentCheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

import { Badge, Button, Card, Form, Icon, Typography } from "@msaaqcom/abjad";

interface Props {
  content: Content<Meeting>;
}

export const MeetingStatus = ({ content, className }: Props & { className?: string }) => {
  const t = useTranslations();

  if (content.contentable.is_upcoming) {
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
  } else if (content.contentable.is_live) {
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
      className={className}
      size="sm"
      children={t("meeting.is_ended")}
    />
  );
};
const MeetingSection = ({ content }: Props) => {
  const t = useTranslations();
  const [copy, values] = useCopyToClipboard();

  const meetingUrl = content.contentable.is_ended ? content.contentable.replay_url : content.contentable.join_url;

  const show =
    (content.contentable.is_ended && content.contentable.replay_url) ||
    (!content.contentable.is_ended && content.contentable.join_url);

  return (
    <>
      <Card className="rounded-none rounded-b-lg">
        <Card.Header className="rounded-none">
          <Typography.Text
            as="h3"
            size="sm"
            className="font-semibold"
            children={t("meeting.zoom_link")}
          />
        </Card.Header>
        <Card.Body>
          <ZoomLogo className="mb-6 h-auto w-20" />
          <div className="flex flex-col space-y-4">
            <div className="flex gap-10">
              <div className="grid gap-2">
                <Typography.Body
                  as="span"
                  size="sm"
                  className="text-gray-700"
                  children={t("common.a_day")}
                />
                <div className="flex items-center gap-2">
                  <Typography.Body
                    as="span"
                    size="md"
                    children={dayjs(content.contentable.start_at).format("DD MMMM")}
                  />
                  <MeetingStatus
                    className="hidden md:block"
                    content={content}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Typography.Body
                  as="span"
                  size="sm"
                  className="text-gray-700"
                  children={t("common.an_hour")}
                />
                <Typography.Body
                  as="span"
                  size="md"
                  dir="ltr"
                  children={dayjs(content.contentable.start_at)
                    .tz(content.contentable.timezone)
                    .format("h:mm A [UTC] Z")}
                />
              </div>
            </div>
            <div className="grid gap-2 md:hidden">
              <Typography.Body
                as="span"
                size="sm"
                className="text-gray-700"
                children={t("meeting.status")}
              />
              <MeetingStatus
                className="inline-block w-fit"
                content={content}
              />
            </div>
            {show && (
              <Form.Input
                dir="ltr"
                className="mb-0"
                aria-label={content.title}
                value={meetingUrl}
                append={
                  <Button
                    onPress={() => copy(meetingUrl)}
                    variant="link"
                    className="px-0"
                    color="gray"
                    icon={
                      !values.includes(meetingUrl) ? (
                        <Icon
                          size="sm"
                          children={<DocumentDuplicateIcon />}
                        />
                      ) : (
                        <Icon
                          size="sm"
                          className="text-success"
                          children={<DocumentCheckIcon />}
                        />
                      )
                    }
                  />
                }
                readOnly
              />
            )}
          </div>
        </Card.Body>
        {show && (
          <Card.Footer>
            {content.contentable.is_ended ? (
              <Button
                color="primary"
                size="sm"
                href={content.contentable.replay_url}
                target="_blank"
                children={t("meeting.watch_replay")}
              />
            ) : (
              <Button
                color="primary"
                size="sm"
                href={content.contentable.join_url}
                target="_blank"
                isDisabled={content.contentable.is_upcoming}
                children={t("meeting.start")}
              />
            )}
          </Card.Footer>
        )}
      </Card>
    </>
  );
};

export default MeetingSection;
