"use client";

import React, { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { AnyObject } from "yup";

import { useInfiniteScroll, useResponseToastHandler } from "@/hooks";
import { ProgressBarLink } from "@/providers/progress-bar";
import { APIFetchResponse, FetchErrorType, FetchReturnValue } from "@/server-actions/config/base-query";
import { fetchMemberAssignments } from "@/server-actions/services/member-service";
import { useSubmitAssignmentMutation } from "@/store/slices/api/assignmetSlice";
import { useLazyFetchCourseQuery } from "@/store/slices/api/courseSlice";
import { Course } from "@/types";
import { Thumbnail } from "@/ui/images";
import { getLastViewedPath } from "@/utils";
import { redirect } from "@/utils/navigation";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

import { Badge, Button, Card, Dropdown, Form, Icon, Modal, SingleFile, Typography } from "@msaaqcom/abjad";

interface IFormInputs {
  attachment: Array<SingleFile>;
  message: string;
}

const MemberAssignments = ({
  initialData,
  initialFilters
}: {
  initialData: APIFetchResponse<
    {
      id: number;
      course: Course;
      content_id: number;
      chapter_id: number;
      title: string;
    }[]
  >;
  initialFilters: AnyObject;
}) => {
  const t = useTranslations();

  const { data, canLoadMore, loadMore, isLoading, refetch } = useInfiniteScroll<{
    id: number;
    title: string;
    course: Course;
    content_id: number;
    chapter_id: number;
  }>(initialData, fetchMemberAssignments, initialFilters);

  const [trigger, result] = useLazyFetchCourseQuery();

  useEffect(() => {
    if (result.isSuccess) {
      redirect(getLastViewedPath(result.data));
    }
  }, [result]);

  const [openModal, setOpenModal] = useState(false);
  const [assignment, setAssignment] = useState<
    | {
        id: number;
        title: string;
        course: Course;
        content_id: number | string;
        chapter_id: number | string;
      }
    | undefined
  >(undefined);

  const [uploadAssignment] = useSubmitAssignmentMutation();
  const schema = yup.object().shape({
    attachment: yup.array().of(yup.mixed()).min(1).required(),
    message: yup.string().min(6).required()
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<IFormInputs>({
    defaultValues: {
      attachment: [],
      message: ""
    },
    resolver: yupResolver(schema)
  });

  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    if (!assignment) return;

    const submitAssignment = (await uploadAssignment({
      slug: assignment.course.slug as string,
      chapterId: assignment.chapter_id as string,
      contentId: assignment.content_id as string,
      attachment: data.attachment.map((file) => file.file).pop() as File,
      message: data.message
    })) as FetchReturnValue<
      {
        message?: { title?: string; body: string };
      },
      FetchErrorType
    >;

    if (displayErrors(submitAssignment)) return;

    displaySuccess(submitAssignment);

    await refetch();
    setOpenModal(false);
  };

  if (!data || !data.length) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-6">
      {data.map((assignment) => (
        <Card
          key={assignment.id}
          className="border-0 bg-gray-100"
        >
          <Card.Body className="flex justify-between gap-4">
            {assignment.course.thumbnail && (
              <div className="hidden h-20 w-20 md:block">
                <Thumbnail
                  rounded="xl"
                  className="h-20 w-20"
                  src={assignment.course.thumbnail}
                  alt={assignment.course.title}
                />
              </div>
            )}
            <div className="flex shrink grow basis-auto flex-col items-start">
              <Badge
                color="primary"
                variant="soft"
              >
                {t("library.upcoming_assignment")}
              </Badge>
              <div className="mt-2 flex flex-col">
                <Typography.Body
                  size="base"
                  className="font-semibold text-black"
                >
                  {assignment.title}
                </Typography.Body>
                <Typography.Body
                  size="md"
                  className="text-gray-800"
                >
                  {assignment.course.title}
                </Typography.Body>
              </div>
            </div>
            <Dropdown>
              <Dropdown.Trigger>
                <Button
                  color="gray"
                  variant="solid"
                  icon={
                    <Icon size="md">
                      <EllipsisHorizontalIcon />
                    </Icon>
                  }
                />
              </Dropdown.Trigger>
              <Dropdown.Menu>
                <Dropdown.Item wrapperClassName="relative">
                  <ProgressBarLink
                    href={`/courses/${assignment.course.slug}/chapters/${assignment.chapter_id}/contents/${assignment.content_id}`}
                    className="w-full"
                  >
                    <span className="absolute inset-0" />
                    {t("library.view_assignment")}
                  </ProgressBarLink>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  children={
                    <Typography.Body
                      size="md"
                      children={t("course_player.assignment_submit")}
                    />
                  }
                  onClick={() => {
                    setAssignment(assignment);
                    setOpenModal(true);
                  }}
                />
                <Dropdown.Divider />
                {assignment.course.enrollment?.last_viewed ? (
                  <Dropdown.Item wrapperClassName="relative">
                    <ProgressBarLink
                      href={getLastViewedPath(assignment.course)}
                      className="w-full"
                    >
                      <span className="absolute inset-0" />
                      {t("library.continue_course")}
                    </ProgressBarLink>
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item onClick={() => trigger({ slug: assignment.course.slug })}>
                    {t("library.continue_course")}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Card.Body>
        </Card>
      ))}
      {canLoadMore && (
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          onPress={() => loadMore()}
          color="primary"
          variant="outline"
          className="mx-auto w-full md:!w-auto"
        >
          {t("common.load_more")}
        </Button>
      )}
      <Modal
        size="lg"
        open={openModal}
        onDismiss={() => setOpenModal(false)}
        bordered
      >
        <Modal.Header
          dismissible
          title={t("course_player.assignment_submit")}
        />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Form.Group
              label={t("course_player.assignment_upload")}
              required
              errors={errors.attachment?.message}
            >
              <Controller
                name="attachment"
                control={control}
                render={({ field: { onChange, ...rest } }) => (
                  <Form.File
                    maxFiles={1}
                    className="mt-2"
                    onChange={(files: SingleFile[]) => {
                      onChange(files);
                    }}
                    {...rest}
                    accept={["*"]}
                  />
                )}
              />
            </Form.Group>
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Form.Textarea
                  className="mb-0"
                  classNames={{
                    inputWrapper: "rounded-lg"
                  }}
                  error={errors.message?.message}
                  label={t("course_player.assignment_message_input_label")}
                  placeholder={t("course_player.assignment_message_input_placeholder")}
                  rows={5}
                  style={{ resize: "none" }}
                  {...field}
                />
              )}
            />
          </Modal.Body>
          <Modal.Footer className="flex justify-between">
            <Button
              type="submit"
              color="primary"
              variant="solid"
              children={t("course_player.assignment_submit")}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            />
            <Button
              color="gray"
              variant="solid"
              onPress={() => {
                setOpenModal(false);
              }}
              children={t("common.cancel")}
            />
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberAssignments;
