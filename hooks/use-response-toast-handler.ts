import { UseFormSetError } from "react-hook-form/dist/types/form";

import { APIFetchResponse, FetchErrorType, FetchReturnValue } from "@/server-actions/config/base-query";

import useToast from "./use-toast";

type Color = "error" | "success" | "info" | "warning" | "default";

interface ReturnType {
  display: (_: FetchErrorType) => void;
  displayErrors: (_: FetchErrorType) => boolean;
  displaySuccess: (_: APIFetchResponse<unknown>, color?: Color) => boolean;
}

type Props = {
  setError?: UseFormSetError<any>;
};

const useResponseToastHandler = ({ setError }: Props): ReturnType => {
  const [toast] = useToast();

  const displayErrors = (response: FetchErrorType): boolean => {
    if (!response.error) {
      return false;
    }

    if (response.error.status === "FETCH_ERROR") {
      toast.error({
        message: response.error.errors as string
      });

      return true;
    }

    if (!response.error.errors) {
      toast.error({
        message: typeof response.error.message === "string" ? response.error.message : response.error.message?.body
      });

      return true;
    }

    Object.keys(response.error.errors).forEach((key) => {
      if (response.error.status !== "FETCH_ERROR") {
        response.error.errors?.[key].forEach((message: string) => {
          if (response.error?.status === 422) {
            setError?.(key, { message, type: "manual" });
          }

          toast.error({
            message
          });
        });
      }
    });

    return true;
  };

  const displaySuccess = (response: APIFetchResponse<unknown>, color: Color = "success"): boolean => {
    const { message, errors } = response;

    if (errors) {
      return false;
    }

    // Check if message is an object with body and title
    if (typeof message === "object" && message !== null && "body" in message && "title" in message) {
      const { body, title } = message;

      if (!body || !title) {
        return false;
      }

      toast[color]({
        message: body,
        title: title
      });

      return true;
    }

    // If message is a string or doesn't contain both body and title, return false
    return false;
  };

  const display = (response: FetchErrorType | APIFetchResponse<unknown>) => {
    displayErrors(response as FetchErrorType);
    displaySuccess(response as APIFetchResponse<unknown>);
  };

  return {
    display,
    displayErrors,
    displaySuccess
  };
};

export default useResponseToastHandler;
