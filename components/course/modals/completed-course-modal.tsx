"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { setCourseIsCompleted, setOpenRatingModal } from "@/store/slices/courses-slice";
import { Course } from "@/types";

import { Button, Modal, Typography } from "@msaaqcom/abjad";

const CompletedCourseModal = ({ course }: { course: Course }) => {
  const t = useTranslations();
  const { courseIsCompleted } = useAppSelector((state) => state.courses);

  const dispatch = useAppDispatch();
  const onDismissModal = (opensRatingModal: boolean = false) => {
    dispatch(setCourseIsCompleted(false));
    if (opensRatingModal) {
      dispatch(setOpenRatingModal(true));
    }
  };

  if (!courseIsCompleted) return null;

  return (
    <Modal
      open
      onDismiss={onDismissModal}
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
            children={t("course_player.course_completed_alert_title")}
          />
          <Typography.Body
            as="span"
            children={t("course_player.course_completed_alert_description")}
            className="text-center font-normal text-gray-700"
          />
        </div>
        <div className="flex w-full flex-col gap-3">
          <Button
            href="/library/certificates"
            color="primary"
            className="w-full"
            children={t("course_player.course_completed_alert_confirm")}
          />
          {course?.settings.reviews_enabled && (
            <Button
              color="gray"
              className="w-full"
              onPress={() => onDismissModal(true)}
              children={t("course_player.course_completed_alert_cancel")}
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CompletedCourseModal;
