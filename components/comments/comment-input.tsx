"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { UseFormReturn } from "react-hook-form/dist/types";

import { useSession } from "@/providers/session-provider";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

import { Avatar, Button, Form, Icon } from "@msaaqcom/abjad";

interface Props {
  form: UseFormReturn<any>;
}

const CommentInput = ({ form }: Props) => {
  const t = useTranslations();
  const { member } = useSession();

  const {
    formState: { isDirty, isValid, isSubmitting, errors },
    control
  } = form;

  return (
    <div className="md!:items-center flex !flex-col items-start gap-4 md:!flex-row">
      <Avatar
        size="lg"
        className="!h-8 !w-8 flex-shrink-0 md:!h-12 md:!w-12"
        imageUrl={member?.avatar}
        name={member?.name ?? ""}
      />
      <div className="flex w-full items-center gap-4">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Form.Input
              id="content"
              aria-label="content"
              clearable
              onClear={() => {
                field.onChange("");
              }}
              error={errors.content?.message as string}
              type="text"
              placeholder={t("comments.comment_input_placeholder")}
              className="mb-0 flex-grow"
              {...field}
            />
          )}
        />
        <Button
          type="submit"
          color="primary"
          size="md"
          isDisabled={!isDirty || isSubmitting || !isValid}
          className="mb-auto flex-shrink-0"
          icon={
            <Icon size="md">
              <PaperAirplaneIcon className="transform rtl:-scale-100" />
            </Icon>
          }
        />
      </div>
    </div>
  );
};

export default CommentInput;
