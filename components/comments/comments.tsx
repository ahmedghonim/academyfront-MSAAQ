"use client";

import { useEffect } from "react";

import { useParams } from "next/navigation";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { useResponseToastHandler } from "@/hooks";
import { useCommentsStore } from "@/providers/comments-store-provider";
import { useSession } from "@/providers/session-provider";
import NoReviews from "@/public/images/no-reviews.svg";
import { Comment, Member } from "@/types";
import { randomUUID } from "@/utils";

import { Button, Form, Typography } from "@msaaqcom/abjad";

import CommentCard from "./comment-card";
import CommentInput from "./comment-input";

interface IFormInputs {
  content: string;
}

const Comments = () => {
  const t = useTranslations();
  const params = useParams();

  const { comments, createComment, setComments, getComments } = useCommentsStore((state) => state);

  useEffect(() => {}, [comments]);

  const { member } = useSession();

  const schema = yup.object().shape({
    content: yup.string().min(3).required()
  });

  const form = useForm<IFormInputs>({
    mode: "onSubmit",
    defaultValues: {
      content: ""
    },
    resolver: yupResolver(schema)
  });

  const { handleSubmit, reset, setError } = form;

  const { displayErrors } = useResponseToastHandler({ setError });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const content = data.content;
    const TEMP_ID = randomUUID();

    reset({ content: "" });

    const tempComment: Comment = {
      user: member ?? ({} as Member),
      content: content,

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      id: TEMP_ID
    };

    setComments([tempComment, ...comments]);

    const submitComment = await createComment({
      content: content,
      ...(params?.chapterId && {
        slug: params.slug as string,
        chapterId: params.chapterId as string,
        contentId: params.contentId as string
      })
    });

    if (displayErrors(submitComment)) {
      setComments(getComments().filter((c) => c.id !== TEMP_ID));

      reset({ content });

      return;
    }

    if (submitComment.data) {
      const index = getComments().findIndex((c) => c.id === TEMP_ID);
      const updated = getComments();

      updated[index] = {
        ...submitComment.data.data
      };
      setComments(updated);
    }
  };
  const isEmpty = comments.length === 0;

  return (
    <div className="flex flex-col space-y-6">
      {member && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <CommentInput form={form} />
        </Form>
      )}
      {isEmpty && !member ? (
        <div className="flex flex-col items-center justify-center space-y-8 rounded-3xl bg-gray-100 px-8 py-12">
          <div className="mx-auto w-60 md:!w-96">
            <NoReviews />
          </div>
          <Typography.Title
            as="p"
            className="text-center"
            children={t("comments.empty")}
          />
          <Button
            href="/login"
            children={t("common.login")}
          />
        </div>
      ) : (
        comments.map((comment, i) => (
          <CommentCard
            comment={comment}
            key={i}
          />
        ))
      )}
    </div>
  );
};

export default Comments;
