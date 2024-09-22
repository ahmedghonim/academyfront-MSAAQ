"use client";

import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { useResponseToastHandler } from "@/hooks";
import { useCommentsStore } from "@/providers/comments-store-provider";
import { useSession } from "@/providers/session-provider";
import { Comment, Member } from "@/types";
import { randomUUID } from "@/utils";

import { Card, Form } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import CommentInput from "./comment-input";
import CommentItem from "./comment-item";

interface Props {
  comment: Comment;
}

interface IFormInputs {
  content: string;
}

const CommentCard = ({ comment }: Props) => {
  const [showReplayInput, setShowReplayInput] = useState<boolean>(false);
  const { member } = useSession();

  const { comments, setComments, createCommentReplay } = useCommentsStore((state) => state);

  const schema = yup.object().shape({
    content: yup.string().min(3).trim().required()
  });

  const toggleReplayInput = () => {
    if (!member) return;

    setShowReplayInput((prev) => !prev);
  };

  const form = useForm<IFormInputs>({
    mode: "onSubmit",
    defaultValues: {
      content: ""
    },
    resolver: yupResolver(schema)
  });

  const { handleSubmit, setError, reset } = form;

  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const content = data.content;
    const TEMP_ID = randomUUID();

    reset({ content: "" });
    setShowReplayInput(false);

    const tempComment: Comment = {
      user: member ?? ({} as Member),
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      id: TEMP_ID
    };

    const index = comments.findIndex((c) => c.id === comment.id);

    comments[index].replies = [tempComment, ...(comments[index].replies || [])];

    setComments(comments);

    const submitReplay = await createCommentReplay({
      comment_id: comment.id,
      content
    });

    if (displayErrors(submitReplay)) {
      comments[index].replies = comments[index].replies?.filter((reply) => reply.id !== TEMP_ID);
      setComments(comments);

      reset({ content });
      setShowReplayInput(true);

      return;
    }

    displaySuccess(submitReplay);
  };

  return (
    <Card className="bg-transparent">
      <Card.Body>
        <div
          className={cn("relative grid gap-5", comment.replies && comment.replies.length > 0 && "comment-border-body")}
        >
          <CommentItem
            comment={comment}
            toggleReplayInput={toggleReplayInput}
          />
          {comment.replies?.map((replay: any) => (
            <div
              key={replay.id}
              className="ms-11"
            >
              <CommentItem
                comment={replay}
                toggleReplayInput={toggleReplayInput}
              />
            </div>
          ))}
          {showReplayInput && (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <CommentInput form={form} />
            </Form>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CommentCard;
