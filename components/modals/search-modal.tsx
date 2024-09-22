import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Select } from "@/components/select";
import { useRouter } from "@/utils/navigation";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { Button, Form, Icon, Modal, ModalProps } from "@msaaqcom/abjad";

interface IFormInputs {
  q: string;
  type: {
    label: string;
    value: "courses" | "products" | "posts";
  };
}

const SearchModal = ({ open, onDismiss }: ModalProps) => {
  const t = useTranslations();
  const [show, setShow] = useState<boolean>(false);

  const router = useRouter();

  const schema = yup.object({
    q: yup.string().required(),
    type: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required()
      })
      .required()
  });
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { isValid, isSubmitting }
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      type: {
        label: t("common.courses_title"),
        value: "courses"
      }
    }
  });

  useEffect(() => {
    setFocus("q");
  }, [setFocus]);

  const onSubmit = (data: IFormInputs) => {
    if (isSubmitting) return;
    router.push(`/search?q=${data.q}&type=${data.type.value}`);
    onDismiss?.();
  };

  useEffect(() => {
    setShow(open ?? false);
  }, [open]);

  return (
    <Modal
      open={show}
      onDismiss={onDismiss}
      size="2xl"
      rounded="2xl"
    >
      <Modal.Body>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full"
        >
          <div className="flex flex-col items-center gap-4 md:!flex-row">
            <Form.Group className="!mb-0 w-full md:!w-[250px]">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    isSearchable={false}
                    autoFocus={false}
                    placeholder={t("common.search_type")}
                    options={[
                      {
                        label: t("common.courses_title"),
                        value: "courses"
                      },
                      {
                        label: t("common.products_title"),
                        value: "products"
                      },
                      {
                        label: t("common.articles_title"),
                        value: "posts"
                      }
                    ]}
                    {...field}
                  />
                )}
              />
            </Form.Group>

            <Controller
              name="q"
              control={control}
              render={({ field }) => (
                <Form.Input
                  className="!mb-0 w-full"
                  type="text"
                  autoFocus
                  aria-labelledby="search"
                  onClear={() => field.onChange("")}
                  placeholder={t("common.search_modal_placeholder")}
                  prepend={
                    <Icon size="md">
                      <MagnifyingGlassIcon />
                    </Icon>
                  }
                  clearable
                  {...field}
                />
              )}
            />
            <Button
              color="primary"
              size="md"
              className="w-full md:!w-auto"
              type="submit"
              children={t("common.search")}
              isDisabled={!isValid || isSubmitting}
            />
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SearchModal;
