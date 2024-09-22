"use client";

import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useResponseToastHandler } from "@/hooks";
import { updatePassword } from "@/server-actions/actions/profile-actions";

import { Button, Card, Form } from "@msaaqcom/abjad";

interface IFormInputs {
  password: string;
}

const EditPasswordInput = () => {
  const t = useTranslations();
  const [inputEnabled, setInputEnabled] = useState<boolean>(false);
  const schema = yup.object({
    password: yup.string().min(8)
  });
  const {
    handleSubmit,
    setError,
    control,
    reset,
    formState: { isDirty, isValid, isSubmitting }
  } = useForm<IFormInputs>({
    defaultValues: {
      password: ""
    },
    resolver: yupResolver(schema)
  });

  const { displayErrors, displaySuccess } = useResponseToastHandler({ setError });

  useEffect(() => {
    reset({
      password: ""
    });
  }, [inputEnabled]);

  const onSubmit = handleSubmit(async (data) => {
    const { password } = data;
    const response = await updatePassword({
      password: password
    });

    // if (displayErrors(response)) return;

    // displaySuccess(response);
    setInputEnabled(false);
  });

  return (
    <Form onSubmit={onSubmit}>
      <Card className="!rounded-xl border-0">
        <Card.Body className="flex flex-col items-end gap-4 rounded-xl bg-gray-100 p-4 md:!flex-row">
          <Controller
            name={"password"}
            control={control}
            render={({ field }) => (
              <Form.Password
                isDisabled={!inputEnabled}
                label={t("common.password")}
                className="mb-0 w-full"
                {...field}
              />
            )}
          />
          <div className="flex gap-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || (!isDirty && inputEnabled) || (!isValid && inputEnabled)}
              color={inputEnabled ? "primary" : "gray"}
              children={t(inputEnabled ? "common.save_modifications" : "common.edit")}
              onPress={() => {
                if (!isDirty || !inputEnabled) {
                  setInputEnabled(true);
                }
              }}
            />
            {inputEnabled && (
              <Button
                type="button"
                isDisabled={isSubmitting}
                color={"gray"}
                children={t("common.cancel")}
                onPress={() => {
                  reset({
                    password: ""
                  });
                  setInputEnabled(false);
                }}
              />
            )}
          </div>
        </Card.Body>
      </Card>
    </Form>
  );
};

export default EditPasswordInput;
