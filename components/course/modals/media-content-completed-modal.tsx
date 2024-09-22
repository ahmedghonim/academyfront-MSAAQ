"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { useAppSelector, useCountdown } from "@/hooks";
import { CourseSliceStateType } from "@/store/slices/courses-slice";
import { useRouter } from "@/utils/navigation";

import { Button, Modal, ModalProps, Typography } from "@msaaqcom/abjad";

const MediaContentCompletedModal = ({ open, onDismiss, ...props }: ModalProps) => {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [show, setShow] = useState<boolean>(false);

  const { content } = useAppSelector<CourseSliceStateType>((state) => state.courses);

  const { startCountdown, stopCountdown, currentTime, resetCountdown } = useCountdown(
    3,
    () => {},
    async () => {
      setShow(false);
      if (content.next.nextable) {
        router.push(`/courses/${params?.slug}/chapters/${content.next.chapter_id}/contents/${content.next.content_id}`);
      }
    }
  );

  useEffect(() => {
    setShow(open ?? false);
  }, [open]);

  useEffect(() => {
    if (!show) {
      stopCountdown();

      return;
    }

    resetCountdown();
    startCountdown();
  }, [show]);

  return (
    <Modal
      open={show}
      onDismiss={onDismiss}
      {...props}
      size="sm"
      rounded="2xl"
    >
      <Modal.Body className="flex flex-col items-center justify-center gap-5">
        <Image
          src={"/images/check-success.gif"}
          alt={"check-success"}
          width={250}
          height={250}
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <Typography.Body
            as="h3"
            size="lg"
            children={t("course_player.content_completed_alert_title")}
          />
          <Typography.Body
            as="span"
            className="text-center font-normal text-gray-700"
          >
            {t.rich("course_player:content_completed_alert_description", {
              strong: (c) => <strong>{c}</strong>,
              seconds: currentTime
            })}
          </Typography.Body>
        </div>
        <div className="flex w-full flex-col gap-3">
          <Button
            className="w-full"
            children={t("course_player.content_completed_alert_confirm")}
          />
          <Button
            color="gray"
            className="w-full"
            onPress={onDismiss}
            children={t("course_player.content_completed_alert_cancel")}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MediaContentCompletedModal;
