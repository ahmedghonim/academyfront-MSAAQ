"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { useConfirmableDelete, useResponseToastHandler } from "@/hooks";
import dayjs from "@/lib/dayjs";
import { useCommentsStore } from "@/providers/comments-store-provider";
import { useSession } from "@/providers/session-provider";
import { Comment, Member } from "@/types";
import { randomUUID } from "@/utils";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Avatar, Badge, Button, Form, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface Props {
  comment: Comment;
  toggleReplayInput?: () => void;
}

interface IFormInputs {
  content: string;
}

const CommentItem = ({ comment, toggleReplayInput }: Props) => {
  const t = useTranslations();
  const params = useParams();

  const [isEditingComment, setIsEditingComment] = useState<boolean>(false);
  const {
    comments,
    getComments,
    updateComment: updateCommentMutation,
    setComments,
    deleteComment
  } = useCommentsStore((state) => state);

  const { member } = useSession();

  const toggleUpdateCommentInput = () => {
    setIsEditingComment((prev) => !prev);
  };

  const [confirmableDelete] = useConfirmableDelete({
    action: deleteComment
  });

  const displayConfirmableDeleteModal = () => {
    return confirmableDelete({
      id: comment.id,
      ...(params?.chapterId && {
        payload: {
          slug: params.slug as string,
          chapterId: params.chapterId as string,
          contentId: params.contentId as string
        }
      }),
      title: t("comments.comment_confirm_delete_alert_title"),
      description: t("comments.comment_confirm_delete_alert_description"),
      okLabel: t("comments.comment_confirm_delete_alert_confirm"),
      callback: () => {
        setComments(getComments().filter((c) => c.id !== comment.id));
      }
    });
  };

  const isCommentOwnedByAuthMember = useMemo<boolean>(
    () => comment.user?.type === "member" && member && member.id === comment.user.id,
    [comment]
  );

  const isCommentOwnedByInstructor = useMemo<boolean>(() => comment.user?.type === "user", [comment]);

  const schema = yup.object().shape({
    content: yup.string().required()
  });

  const { handleSubmit, control, setError, reset } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    reset({
      content: comment.content
    });
  }, [comment]);

  const { displayErrors } = useResponseToastHandler({ setError });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const content = data.content;

    const TEMP_ID = randomUUID();

    reset({ content: "" });

    const tempComment: Comment = {
      user: member ?? ({} as Member),
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      id: TEMP_ID
    };

    setComments([tempComment, ...comments]);
    setIsEditingComment(false);

    const updateComment = await updateCommentMutation({
      comment_id: comment.id,
      ...(params?.chapterId && {
        slug: params.slug as string,
        chapterId: params.chapterId as string,
        contentId: params.contentId as string
      }),
      content: data.content
    });

    if (displayErrors(updateComment)) {
      setComments(getComments().filter((c) => c.id !== TEMP_ID));

      reset({ content });
      setIsEditingComment(true);

      return;
    }
    if (updateComment.data) {
      const index = getComments().findIndex((c) => c.id == TEMP_ID);
      let updated = getComments();

      updated[index] = {
        ...updateComment.data.data
      };
      setComments(updated);
    }
  };

  return (
    <>
      <div
        className={cn(
          "gap-3 md:!bg-transparent",
          comment.replies &&
            comment.replies.length > 0 &&
            "!z-10 first:!-mx-4 first:!-mt-4 first:bg-gray-100 first:px-4 first:py-4"
        )}
      >
        <div className="grid grid-cols-12">
          <div className="col-span-12 mb-3 flex md:col-span-8">
            <div
              className={cn(
                "comment-border-item flex items-center gap-3",
                comment.replies && comment.replies.length > 0 && "after:!border-0"
              )}
            >
              {comment.user && (
                <>
                  <Avatar
                    imageUrl={comment.user.avatar}
                    name={comment.user.username}
                    size="md"
                    className="z-10 flex-shrink-0"
                  />
                  <Typography.Body
                    as="h6"
                    children={comment.user.name}
                  />
                </>
              )}
              {(isCommentOwnedByAuthMember || isCommentOwnedByInstructor) && (
                <Badge
                  color={isCommentOwnedByAuthMember ? "gray" : "info"}
                  rounded="full"
                  size="sm"
                  variant="soft"
                  className="px-4"
                >
                  {t(isCommentOwnedByAuthMember ? "comments:my_comment" : "comments:instructor")}
                </Badge>
              )}
            </div>
          </div>
          <div className="order-3 col-span-12 mt-3 flex flex-wrap md:order-2 md:col-span-4 md:ms-auto md:mt-0 md:justify-end">
            {isCommentOwnedByAuthMember &&
              (isEditingComment ? (
                <>
                  <Button
                    color="primary"
                    onPress={() => handleSubmit(onSubmit)()}
                    size="sm"
                    variant="solid"
                  >
                    {t("common.save")}
                  </Button>
                  <Button
                    color="gray"
                    variant="outline"
                    size="sm"
                    className="ms-2"
                    onPress={() => toggleUpdateCommentInput()}
                  >
                    {t("common.cancel")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="gray"
                    type="button"
                    size="sm"
                    variant="outline"
                    icon={
                      <Icon size="xs">
                        <PencilSquareIcon />
                      </Icon>
                    }
                    iconAlign="start"
                    onPress={() => toggleUpdateCommentInput()}
                    children={t("common.edit")}
                  />
                  <Button
                    color="gray"
                    variant="outline"
                    size="sm"
                    icon={
                      <Icon size="xs">
                        <TrashIcon />
                      </Icon>
                    }
                    iconAlign="start"
                    className="ms-2 text-danger"
                    onPress={() => displayConfirmableDeleteModal()}
                    children={t("common.delete")}
                  />
                </>
              ))}
            {member && toggleReplayInput && (
              <Button
                type="submit"
                color="gray"
                variant="outline"
                size="sm"
                className="ms-2"
                onPress={() => toggleReplayInput()}
                children={t("comments.reply")}
              />
            )}
          </div>
          <div className="order-2 col-span-12 ps-0 md:ps-11 lg:order-3">
            {isEditingComment ? (
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <Form.Input
                      clearable
                      onClear={() => {
                        field.onChange("");
                      }}
                      id="content"
                      type="text"
                      placeholder={t("comments.edit_comment_input_placeholder")}
                      className="mb-0 bg-white"
                      aria-label="reply"
                      {...field}
                    />
                  )}
                />
              </Form>
            ) : (
              <>
                <Typography.Body
                  as="span"
                  size="sm"
                  className="text-gray-700"
                  children={dayjs(comment.created_at).fromNow(false)}
                />
                <Typography.Body
                  as="p"
                  size="md"
                  className="break-words font-normal text-gray-800"
                >
                  {comment.content}
                </Typography.Body>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentItem;
