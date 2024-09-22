"use client";

import { ReactNode, useState } from "react";

//@ts-ignore
import { confirmable, createConfirmation } from "react-confirm";

import { XCircleIcon } from "@heroicons/react/24/solid";

import { Button, Icon, Modal, Typography } from "@msaaqcom/abjad";
import { AlertProps } from "@msaaqcom/abjad/dist/components/alert/Alert";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface ConfirmOptions extends Pick<AlertProps, "color"> {
  title: string;
  description?: string;
  children?: ReactNode | any;
  okLabel: string;
  cancelLabel?: string;
  proceed: (value: boolean) => void;
  enableConfirmCheckbox?: boolean;
  checkboxLabel?: string;
  show: boolean;
  icon?: ReactNode;
}

const Confirmation = ({
  okLabel,
  cancelLabel,
  children,
  title,
  description,
  proceed,
  show,
  icon = <XCircleIcon />,
  color,
  checkboxLabel,
  enableConfirmCheckbox
}: ConfirmOptions) => {
  const [confirm, setConfirm] = useState(false);
  const resolvedChildren =
    typeof children === "string" ? <span dangerouslySetInnerHTML={{ __html: children }}></span> : children;

  return (
    <Modal
      open={show}
      onDismiss={() => {
        proceed(false);
      }}
      size="sm"
      rounded="2xl"
      className={cn(`border border-${color} bg-${color}-100`)}
    >
      <Modal.Header
        dismissible
        title={
          <div className="flex items-start">
            <Icon
              className={cn("ml-3", `text-${color}`)}
              children={icon}
            />
            <div className="grid gap-3">
              <Typography.Body
                size="sm"
                children={title}
                className="font-semibold"
              />
              <Typography.Body
                size="md"
                children={description}
                className="font-normal text-gray-800"
              />
            </div>
          </div>
        }
        className="items-start [&>button]:h-[30px] [&>button]:min-w-[30px]"
      />
      <Modal.Footer className="flex !ps-[3.25rem] !pt-0">
        <Button
          color={color}
          size="sm"
          onPress={() => proceed(true)}
          children={okLabel}
          isDisabled={enableConfirmCheckbox && !confirm}
        />
        {cancelLabel && (
          <Button
            color="gray"
            variant="link"
            size="sm"
            onPress={() => proceed(false)}
            children={cancelLabel}
          />
        )}
      </Modal.Footer>
    </Modal>
  );
};

export function confirm(options: Omit<ConfirmOptions, "proceed" | "show">) {
  return createConfirmation(confirmable(Confirmation))(options);
}
