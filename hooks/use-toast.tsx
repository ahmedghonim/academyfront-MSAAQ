import React, { ReactNode } from "react";

import { toast } from "react-toastify";
import { ToastOptions as DefaultOptions, Id } from "react-toastify/dist/types";

import { Alert } from "@msaaqcom/abjad";
import { AlertProps } from "@msaaqcom/abjad/dist/components/alert/Alert";

interface ToastOptions
  extends Omit<Omit<DefaultOptions, "closeButton">, "icon">,
    Pick<AlertProps, "dismissible">,
    Pick<AlertProps, "title">,
    Pick<AlertProps, "icon">,
    Pick<AlertProps, "color"> {
  message: string | ReactNode;
}

function useToast() {
  const setToast = ({ color = "success", message, icon, title, dismissible = true, ...props }: ToastOptions) => {
    return toast(
      <>
        <Alert
          icon={icon}
          color={color}
          title={title}
          description={message}
          dismissible={dismissible}
        />
      </>,
      props
    );
  };

  setToast.error = ({ ...props }: ToastOptions) => setToast({ ...props, color: "danger" });
  setToast.success = ({ ...props }: ToastOptions) => setToast({ ...props, color: "success" });
  setToast.info = ({ ...props }: ToastOptions) => setToast({ ...props, color: "info" });
  setToast.warning = ({ ...props }: ToastOptions) => setToast({ ...props, color: "warning" });
  setToast.default = ({ ...props }: ToastOptions) => setToast({ ...props, color: "gray" });

  setToast.dismiss = (id?: Id | undefined) => toast.dismiss(id);
  setToast.update = (id: number, options: ToastOptions) => toast.update(id, options);
  setToast.clearWaitingQueue = () => toast.clearWaitingQueue();

  return [setToast];
}

export default useToast;
