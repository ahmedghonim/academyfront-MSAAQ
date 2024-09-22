"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { useProgressBar } from "@/providers/progress-bar";
import { APIFetchResponse, FetchErrorType } from "@/server-actions/config/base-query";

export const useServerAction = <P extends any[], R>(
  action: (...args: P) => Promise<APIFetchResponse<R>>,
  onFinished?: (_: R | undefined) => void
): [
  (...args: P) => Promise<R | undefined>,
  {
    data: R | undefined;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error?: FetchErrorType;
  }
] => {
  const { start, done } = useProgressBar();

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<APIFetchResponse<R> | FetchErrorType>();
  const [finished, setFinished] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<FetchErrorType | undefined>();
  const resolver = useRef<(value?: R | PromiseLike<R>) => void>();
  const rejector = useRef<(reason?: any) => void>();

  useEffect(() => {
    if (!finished) return;

    if (onFinished) onFinished(result);
    resolver.current?.(result);
  }, [result, finished]);

  const runAction = async (...args: P): Promise<APIFetchResponse<R> | undefined> => {
    start();
    startTransition(() => {
      action(...args)
        .then((data: APIFetchResponse<R>) => {
          setResult(data);
          console.log("data Form ACtion>>>> ", data);
          if (data.error) {
            setIsError(true);
            setError(data.error);
          } else {
          }

          setFinished(true);
          setIsSuccess(true);
        })

        .finally(() => {
          done();
        });
    });

    return new Promise((resolve, reject) => {
      resolver.current = resolve;
      rejector.current = reject;
    });
  };

  return [
    runAction,
    {
      data: result,
      isLoading: isPending,
      isSuccess,
      isError,
      error
    }
  ];
};
