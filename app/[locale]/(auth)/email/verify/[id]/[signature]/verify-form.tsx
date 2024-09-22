"use client";

import { useCallback, useEffect } from "react";

import { LoadingScreen } from "@/components/loading-screen";
import { useResponseToastHandler } from "@/hooks";
import { emailVerify } from "@/lib/auth";
import { AnyObject } from "@/types";
import { useRouter } from "@/utils/navigation";

export default function VerifyForm({ params }: { params: AnyObject }) {
  const router = useRouter();
  const { id, signature } = params;

  const { displayErrors, displaySuccess } = useResponseToastHandler({});

  const verify = useCallback(async () => {
    const res = (await emailVerify({
      id: id as string,
      signature: signature as string
    })) as any;

    if (displayErrors(res)) return;

    displaySuccess(res);

    router.replace("/");
  }, [router]);

  useEffect(() => {
    if (id && signature) {
      verify();
    }
  }, [id, signature, verify]);

  return <LoadingScreen />;
}
