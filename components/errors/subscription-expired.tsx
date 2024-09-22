"use client";

import ErrorImg from "@/public/images/global-error.svg";

import { Button, Typography } from "@msaaqcom/abjad";

export default function SubscriptionExpired() {
  return (
    <>
      <ErrorImg className="h-56 w-56 md:h-60 md:w-60 lg:h-72 lg:w-72" />
      <div className="flex flex-col items-center justify-center text-center">
        <Typography.Title
          size="lg"
          className="font-semibold"
        >
          لا يمكنك الوصول!
        </Typography.Title>
        <Typography.Title
          size="sm"
          className="text-[20px] font-normal text-gray-800"
        >
          لا يمكنك الوصول إلى المنصة في الوقت الحالي، بسبب انتهاء صلاحية اشتراكها.
        </Typography.Title>
        <Button
          href="https://msaaq.com"
          className="mt-6 px-12"
        >
          العودة إلى صفحة مساق
        </Button>
      </div>
    </>
  );
}
