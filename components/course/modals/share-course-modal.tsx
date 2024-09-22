"use client";

import { Dispatch, SetStateAction } from "react";

import { useTranslations } from "next-intl";

import { useTenant } from "@/components/store/TenantProvider";
import { useCopyToClipboard } from "@/hooks/helpers";
import { Course } from "@/types";

import { DocumentCheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

import { Button, Form, Icon, Modal, Typography } from "@msaaqcom/abjad";

import SocialIcon from "../../social-icons";

interface Props {
  openModal: boolean;
  course: Course;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

const ShareCourseModal = ({ openModal, course, setOpenModal }: Props) => {
  const t = useTranslations();
  const [copy, values] = useCopyToClipboard();
  const tenant = useTenant()((state) => state.tenant);

  const courseLink = `${tenant?.domain}/courses/${course?.slug}`;
  const directPurchaseLink = `${tenant?.domain}/cart/checkout/express/course/${course?.id}`;

  const onModalDismiss = () => {
    setOpenModal(!openModal);
  };

  return (
    <Modal
      open={openModal}
      onDismiss={onModalDismiss}
      bordered
    >
      <Modal.Header
        dismissible
        title={t("share.title")}
      />
      <Modal.Body>
        <Form.Input
          readOnly
          value={courseLink}
          label={t("course_player.course_link")}
          dir="ltr"
          append={
            <Button
              onPress={() => copy(courseLink)}
              variant="link"
              className="px-0"
              color="gray"
              icon={
                !values.includes(courseLink) ? (
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
          className="mb-0 mt-3"
        />
        <Form.Input
          readOnly
          value={directPurchaseLink}
          label={t("course_player.direct_checkout_url")}
          dir="ltr"
          append={
            <Button
              onPress={() => copy(directPurchaseLink)}
              variant="link"
              className="px-0"
              color="gray"
              icon={
                !values.includes(directPurchaseLink) ? (
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
          className="mb-0 mt-3"
        />
        <div className="mt-4 space-y-4 rounded bg-gray-100 p-4">
          <Typography.Body
            as="span"
            size="sm"
          >
            {t("share.share_on_social_media")}
          </Typography.Body>
          <div className="flex flex-col items-start">
            <Button
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(courseLink)}`}
              size="md"
              className="px-0 text-primary"
              target="_blank"
              variant="link"
              icon={
                <SocialIcon
                  className="h-5 w-5 text-primary"
                  kind="facebook"
                />
              }
            >
              {t("share.share_on_facebook")}
            </Button>
            <Button
              href={`https://twitter.com/intent/tweet?url=${courseLink}`}
              size="md"
              className="px-0 text-primary"
              target="_blank"
              variant="link"
              icon={
                <SocialIcon
                  className="h-5 w-5 text-primary"
                  kind="twitter"
                />
              }
            >
              {t("share.share_on_twitter")}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShareCourseModal;
