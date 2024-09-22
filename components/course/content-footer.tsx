"use client";

import { useEffect, useMemo, useState } from "react";

import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import useCompleteContent from "@/hooks/use-complete-content";
import { useSession } from "@/providers/session-provider";
import { Content, Meeting } from "@/types";

import { Form } from "@msaaqcom/abjad";

import MediaContentCompletedModal from "./modals/media-content-completed-modal";
import PrevNextContentButtons from "./prev-next-content-buttons";

interface Props {
  contentCompleted: boolean;
  content: Content;
}

const ContentFooter = ({ contentCompleted, content }: Props) => {
  const t = useTranslations();
  const [completeContent] = useCompleteContent();
  const { member } = useSession();
  const [show, setShow] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = useForm<{
    completed: boolean;
  }>();

  useEffect(() => {
    reset({
      completed: contentCompleted
    });
  }, [contentCompleted]);

  const onSubmit = handleSubmit(async (data) => {
    await completeContent(data.completed);
    reset({
      completed: data.completed
    });
  });

  const meetingIsNotEnded = useMemo(() => {
    return !(content?.type === "meeting" && !(content?.contentable as Meeting)?.is_ended);
  }, [content]);

  return (
    <>
      <div className="md:flex-center mb-10 mt-8 flex flex-col justify-between py-2 md:!flex-row md:items-center">
        {member && content?.type !== "video" && content?.type !== "audio" && meetingIsNotEnded && (
          <Controller
            render={({ field: { value, onChange, ...field } }) => (
              <Form.Checkbox
                id="completed"
                label={t("course_player.complete_content")}
                checked={value}
                value={value ? "true" : "false"}
                disabled={isSubmitting}
                onChange={async (e) => {
                  onChange(e);
                  await onSubmit(e);
                }}
                {...field}
              />
            )}
            name={"completed"}
            control={control}
          />
        )}
        <PrevNextContentButtons />
        <MediaContentCompletedModal
          open={show}
          onDismiss={() => setShow(false)}
        />
      </div>
    </>
  );
};

export default ContentFooter;
