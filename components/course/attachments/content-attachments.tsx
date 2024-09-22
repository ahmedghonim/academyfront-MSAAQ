"use client";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { FileItem } from "@/components/product";
import { useDownloadFile } from "@/hooks";
import { Content, ContentAttachment } from "@/types";

import { ArrowDownTrayIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

import { Button, Card, Icon } from "@msaaqcom/abjad";

interface Props {
  attachments: ContentAttachment[];
  content: Content;
}

const ContentAttachments = ({ attachments, content }: Props) => {
  const t = useTranslations();
  const params = useParams<{
    slug: string;
    chapterId: string;
    contentId: string;
  }>();
  const { downloadFile, isDownloading } = useDownloadFile();

  return (
    <Card>
      <Card.Body className="grid gap-3">
        {attachments.map((attachment, i: number) => (
          <FileItem
            key={i}
            title={attachment.file_name}
            children={
              <Button
                color="gray"
                size="sm"
                variant="solid"
                className="w-full md:!w-auto"
                icon={
                  <Icon size="md">
                    <DocumentArrowDownIcon />
                  </Icon>
                }
                isLoading={isDownloading(
                  `/courses/${params?.slug}/chapters/${params?.chapterId}/contents/${params?.contentId}/download/${attachment.uuid}`
                )}
                onPress={() =>
                  downloadFile(
                    `/courses/${params?.slug}/chapters/${params?.chapterId}/contents/${params?.contentId}/download/${attachment.uuid}`,
                    attachment.file_name
                  )
                }
                children={t("course_player.attachments_download")}
              />
            }
          />
        ))}
      </Card.Body>
      <Card.Footer>
        <Button
          onPress={() =>
            downloadFile(
              `/courses/${params?.slug}/chapters/${params?.chapterId}/contents/${params?.contentId}/download`,
              content.title
            )
          }
          isLoading={isDownloading(
            `/courses/${params?.slug}/chapters/${params?.chapterId}/contents/${params?.contentId}/download`
          )}
          icon={
            <Icon size="md">
              <ArrowDownTrayIcon />
            </Icon>
          }
          children={t("course_player.attachments_download_all_attachments")}
        />
      </Card.Footer>
    </Card>
  );
};

export default ContentAttachments;
