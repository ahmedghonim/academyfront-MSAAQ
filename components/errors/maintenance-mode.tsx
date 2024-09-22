"use client";

import ErrorImg from "@/public/images/service-unavailable.svg";

import { Typography } from "@msaaqcom/abjad";

export default function MaintenanceMode() {
  return (
    <>
      <ErrorImg className="h-56 w-56 md:h-60 md:w-60 lg:h-72 lg:w-72" />
      <div className="flex flex-col text-center">
        <Typography.Title
          size="lg"
          className="font-semibold"
        >
          صيانة سريعة!
        </Typography.Title>
        <Typography.Title
          size="sm"
          className="mt-2.5 text-[16px] font-normal text-gray-800"
        >
          موقعنا في حالة تأمل رقمي. التأمل يعني نتائج عظيمة &quot;في أغلب الأوقات&quot;... سنعود قبل أن تلاحظ غيابنا.
        </Typography.Title>
      </div>
    </>
  );
}
