"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useParams } from "next/navigation";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { useResponseToastHandler } from "@/hooks";
import { APIFetchResponse, FetchErrorType } from "@/server-actions/config/base-query";
import { useSubmitAssignmentMutation } from "@/store/slices/api/assignmetSlice";
import { Assignment, Content, Course, PickArrayElement } from "@/types";

import { ArrowUpTrayIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

import { Alert, Button, Card, Form, Icon, SingleFile, Typography } from "@msaaqcom/abjad";

import { FileItem } from "../attachments";

interface Props {
  content: Content<Assignment>;
  course: Course;
}

interface IFormInputs {
  attachment: Array<SingleFile>;
  message: string;
}

const STATUS_COLOR = {
  accepted: "success",
  processing: "warning",
  rejected: "danger",
  default: "info"
};

const STATUS_TITLE = {
  accepted: "course_player:assignment_status_accepted",
  processing: "course_player:assignment_status_processing",
  rejected: "course_player:assignment_status_rejected",
  default: "course_player:assignment_status_default"
};
const AssignmentContent = ({ content, course }: Props) => {
  const t = useTranslations();
  const params = useParams<{
    slug: string;
    chapterId: string;
    contentId: string;
  }>();

  const [canSubmitAssignment, setCanSubmitAssignment] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const [uploadAssignment] = useSubmitAssignmentMutation();

  const memberAssignment = useMemo<PickArrayElement<Assignment["submissions"]> | undefined>(
    () => content.contentable.submissions[content.contentable.submissions.length - 1],
    [content]
  );

  const schema = yup.object().shape({
    attachment: yup.array().of(yup.mixed()).min(1).required(),
    message: yup.string().notRequired()
  });

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { isDirty, isValid, isSubmitting }
  } = useForm<IFormInputs>({
    defaultValues: {
      attachment: [],
      message: ""
    },
    resolver: yupResolver(schema)
  });

  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });

  useEffect(() => {
    if (course) {
      setCanSubmitAssignment(
        !memberAssignment ||
          (memberAssignment && memberAssignment.status === "rejected" && course.settings.resubmit_assignment)
      );
    }
  }, [course, memberAssignment, setCanSubmitAssignment]);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const submitAssignment = (await uploadAssignment({
      slug: params?.slug as string,
      chapterId: params?.chapterId as string,
      contentId: params?.contentId as string,
      attachment: data.attachment.map((file) => file.file).pop() as File,
      message: data.message,
      ...(memberAssignment?.status === "rejected" && {
        params: {
          _method: "PATCH"
        }
      })
    })) as APIFetchResponse<any> | FetchErrorType;

    if (displayErrors(submitAssignment)) return;

    displaySuccess(submitAssignment);
  };

  return (
    <div className="grid gap-4 border-t border-gray-400 pt-4">
      <Alert
        color={(STATUS_COLOR[memberAssignment?.status as keyof typeof STATUS_COLOR] as any) ?? STATUS_COLOR.default}
        title={t((STATUS_TITLE[memberAssignment?.status as keyof typeof STATUS_TITLE] as any) ?? STATUS_TITLE.default)}
        description={
          memberAssignment?.status === "processing"
            ? memberAssignment?.message
            : memberAssignment?.notes ?? t("course_player.assignment_default_message")
        }
        variant="soft"
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Card.Body>
            <div className="grid gap-7">
              <div
                className="prose prose-sm prose-stone sm:prose-base lg:prose-lg h-full max-w-full [&_iframe]:h-48 [&_iframe]:max-w-full sm:[&_iframe]:h-64 md:[&_iframe]:h-64 lg:[&_iframe]:h-80"
                dangerouslySetInnerHTML={{ __html: content.contentable.content }}
              />

              <div className="grid gap-2">
                <Typography.Text
                  size="xs"
                  className="font-medium"
                  children={t("course_player.assignment_attachments")}
                />
                {content.contentable.attachments.map((attachment, i: number) => (
                  <FileItem
                    key={i}
                    title={attachment.file_name}
                    children={
                      <Button
                        target="_blank"
                        href={attachment.url}
                        download
                        color="gray"
                        size="sm"
                        variant="solid"
                        className="w-full md:!w-auto"
                        icon={
                          <Icon size="md">
                            <ArrowDownTrayIcon />
                          </Icon>
                        }
                        children={t("course_player.assignment_download")}
                      />
                    }
                  />
                ))}
              </div>

              <div className="grid gap-2">
                <Typography.Text
                  size="xs"
                  children={t("course_player.assignment_upload")}
                />
                {memberAssignment && (
                  <FileItem
                    className="bg-white"
                    title={memberAssignment.attachment.file_name}
                    color={memberAssignment.status === "rejected" ? "danger" : undefined}
                    children={
                      memberAssignment.status === "rejected" && canSubmitAssignment ? (
                        <>
                          <Button
                            color="primary"
                            size="sm"
                            variant="outline"
                            className="w-full md:!w-auto"
                            icon={
                              <Icon size="sm">
                                <ArrowUpTrayIcon />
                              </Icon>
                            }
                            children={t("course_player.assignment_retry_upload")}
                            onPress={() => {
                              if (fileRef.current) fileRef.current.click();
                            }}
                          />
                          <input
                            ref={fileRef}
                            type="file"
                            className="hidden"
                            name="attachment"
                            id="attachment"
                            onChange={(e) => {
                              if (e.target.files) {
                                setValue("attachment", [
                                  {
                                    id: memberAssignment.id,
                                    name: e.target.files[0].name,
                                    file: e.target.files[0],
                                    size: e.target.files[0].size,
                                    mime: e.target.files[0].type
                                  }
                                ]);
                              }
                            }}
                          />
                        </>
                      ) : (
                        <Button
                          target="_blank"
                          href={memberAssignment.attachment.url}
                          download
                          color="gray"
                          size="sm"
                          variant="solid"
                          className="w-full md:!w-auto"
                          icon={
                            <Icon size="md">
                              <DocumentArrowDownIcon />
                            </Icon>
                          }
                          children={t("course_player.assignment_download")}
                        />
                      )
                    }
                  />
                )}
                {canSubmitAssignment && (
                  <>
                    {!memberAssignment && (
                      <Controller
                        name="attachment"
                        control={control}
                        render={({ field: { onChange, ...rest } }) => (
                          <Form.File
                            maxFiles={1}
                            className=""
                            onChange={(files: SingleFile[]) => {
                              onChange(files);
                            }}
                            {...rest}
                            accept={["*"]}
                          />
                        )}
                      />
                    )}
                    <Controller
                      name="message"
                      control={control}
                      render={({ field }) => (
                        <Form.Textarea
                          className="mb-0"
                          classNames={{
                            inputWrapper: "rounded-lg"
                          }}
                          label={t("course_player.assignment_message_input_label")}
                          placeholder={t("course_player.assignment_message_input_placeholder")}
                          rows={5}
                          style={{ resize: "none" }}
                          {...field}
                        />
                      )}
                    />
                  </>
                )}
              </div>
            </div>
          </Card.Body>

          {canSubmitAssignment && (
            <Card.Footer>
              <Button
                color="primary"
                isLoading={isSubmitting}
                type="submit"
                isDisabled={!isDirty || !isValid || isSubmitting}
                children={t(
                  memberAssignment?.status === "rejected"
                    ? "course_player:assignment_resubmit"
                    : "course_player:assignment_submit"
                )}
              />
            </Card.Footer>
          )}
        </Card>
      </Form>
    </div>
  );
};

export default AssignmentContent;
