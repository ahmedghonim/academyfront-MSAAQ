"use client";

import ErrorImg from "@/public/images/global-error.svg";
import MsaaqLogo from "@/public/images/msaaq-new-logo.svg";

import { Button, Typography } from "@msaaqcom/abjad";

export default function Forbidden() {
  return (
    <>
      <div className=" flex h-[120px] w-[120px] items-center justify-center rounded-full bg-white p-6">
        <MsaaqLogo
          height={68}
          width={68}
        />
      </div>
      <ErrorImg className="h-56 w-56 md:h-60 md:w-60 lg:h-72 lg:w-72" />
      <div className="flex flex-col items-center justify-center text-center">
        <Typography.Text
          size="lg"
          as="div"
          className="mb-2 !text-xl font-semibold lg:!text-3xl"
        >
          تم اغلاق هذه المنصة لمخالفة المعايير والشروط الخاصة بمساق.
        </Typography.Text>
        <Typography.Text
          size="sm"
          as={"div"}
          className="!text-base font-normal leading-8 text-gray-800 lg:!text-xl"
        >
          <div className="text-paragraph-sm text-xl font-normal text-gray-800">
            <div className="leading-8">
              هل تعتقد أنه يوجد خطأ ما؟
              <br />
              تواصل مع فريق
              <a
                href={"mailto:help@msaaq.com"}
                className="text-primary underline"
              >
                الدعم الفني
              </a>
              في مساق
            </div>
          </div>
        </Typography.Text>
        <Button
          target="_blank"
          size="lg"
          color={"primary"}
          href="https://msaaq.com"
          className="mt-6 !bg-black px-11"
        >
          تعرف على مساق
        </Button>
        <Typography.Text
          size="sm"
          className="mt-8 text-[14px] font-normal  text-gray-800"
        >
          يمكن اغلاق المنصات لاسباب عدة مثل بيع منتجات غير شرعية أو فتح منصة عبر بطاقة مسروقة وغيرها من الاسباب.
        </Typography.Text>
      </div>
    </>
  );
}
