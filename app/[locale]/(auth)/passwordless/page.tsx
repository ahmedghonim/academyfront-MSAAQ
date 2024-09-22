"use client";

import { useCallback, useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { LoadingScreen } from "@/components/loading-screen";
import { useServerAction } from "@/hooks";
import { anonymousMutation } from "@/lib/mutations";
import { useRouter } from "@/utils/navigation";

export default function Passwordless() {
  const searchParams = useSearchParams();
  const url = searchParams?.get("url");
  const router = useRouter();
  const [anonymousMut, { isSuccess, isError }] = useServerAction(anonymousMutation);

  const auth = useCallback(async () => {
    if (!url) {
      return router.push("/login");
    }

    await anonymousMut(url, "POST", {});

    return router.push("/login");
  }, [url, router]);

  useEffect(() => {
    if (isSuccess) {
      window.location.replace("/");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      router.push("/login");
    }
  }, [isError]);

  useEffect(() => {
    if (url) {
      auth();
    }
  }, [url, auth]);

  return <LoadingScreen />;
}
