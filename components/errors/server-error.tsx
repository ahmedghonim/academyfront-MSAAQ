"use client";

import ErrorImg from "@/public/images/internal-server-error.svg";

import { Typography } from "@msaaqcom/abjad";

export default function ServerError() {
  return (
    <>
      <ErrorImg className="h-56 w-56 md:h-60 md:w-60 lg:h-72 lg:w-72" />
      <div className="flex flex-col ">
        <Typography.Title
          size="lg"
          className="font-semibold"
        >
          عذرًا، حدث خطأ ما، نعمل على إصلاحه.
        </Typography.Title>
        <Typography.Title
          size="sm"
          className="text-[20px] font-normal text-gray-800"
        >
          خلال بضع دقائق يمكنك:
          <ul>
            <li>إعادة تحميل الصفحة (تُساعد أحيانًا)</li>
            <li>حاول مجددًا خلال 30 دقيقة</li>
            <li>أو اتصل بنا للمساعدة.</li>
          </ul>
        </Typography.Title>
      </div>
    </>
  );
}
