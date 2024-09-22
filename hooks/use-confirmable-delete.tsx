import { ReactNode } from "react";

import { useTranslations } from "next-intl";

import { confirm } from "@/components/confirm";

import useResponseToastHandler from "./use-response-toast-handler";

type Props = {
  children?: ReactNode | any;
  id: string | number;
  payload?: object;
  title: string;
  description?: string;
  label?: string;
  okLabel?: string;
  callback?: () => void;
  beforeCallback?: () => void;
};

type ReturnType = [(props: Props) => void];

type HookProps = {
  action: any;
};

const useConfirmableDelete = ({ action }: HookProps): ReturnType => {
  const t = useTranslations();
  const { display } = useResponseToastHandler({});

  const handleDelete = async ({
    title,
    label,
    description,
    okLabel,
    id,
    callback,
    beforeCallback,
    children,

    payload = {}
  }: Props) => {
    if (
      !(await confirm({
        title,
        description,
        color: "danger",
        okLabel: okLabel ? okLabel : t("common.delete"),
        cancelLabel: t("common.cancel_and_back")
      }))
    ) {
      return;
    }

    beforeCallback?.();
    const response = await action({ id, ...payload });

    display(response);

    if (response.error) {
      return;
    }

    callback?.();
  };

  return [handleDelete];
};

export default useConfirmableDelete;
