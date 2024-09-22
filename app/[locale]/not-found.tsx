"use client";

import NotFoundImg from "@/public/images/404.svg";

import { Button, Grid, Typography } from "@msaaqcom/abjad";

export default function NotFound() {
  return (
    <Grid
      columns={{
        md: 5
      }}
      gap={{
        md: "1rem",
        sm: "1rem",
        lg: "1rem",
        xs: "1rem",
        "2xl": "1rem",
        xl: "1rem"
      }}
    >
      <Grid.Cell
        columnSpan={{ md: 2 }}
        className="order-2 flex flex-col items-start justify-start space-y-6 px-4 md:order-1 md:mx-auto md:!justify-center md:space-y-8 md:px-0"
      >
        <Typography.Title
          size="sm"
          className="font-bold"
          children={"رابط الصفحة غير متوفر."}
        />
        <Button
          href="/"
          color="gray"
          className="flex md:hidden"
          children="الرجوع إلى الصفحة الرئيسية"
        />
        <div className="flex flex-col space-y-2">
          <Typography.Text
            size="lg"
            className="font-semibold"
            children={" قد يكون بسبب الآتي:"}
          />
          <ol className="list-disc ps-4 text-gray-700">
            <li>
              <Typography.Body
                className="font-normal text-gray-700"
                children={"عنوان URL غير صالح أو غير موجود، حاول التأكُّد من صحته."}
              />
            </li>
            <li>
              <Typography.Body
                className="font-normal text-gray-700"
                children={"تم تعطيل رابط الصفحة من قبل صاحب المنصة أو الموقع."}
              />
            </li>
            <li>
              <Typography.Body
                className="font-normal text-gray-700"
                children={"تم إزالة الرابط لأنه ينتهك شروط الاستخدام أو انتهى اشتراكه."}
              />
            </li>
          </ol>
        </div>
        <Button
          href="/"
          color="gray"
          className="hidden md:!flex"
          children="الرجوع إلى الصفحة الرئيسية"
        />
      </Grid.Cell>
      <Grid.Cell
        columnSpan={{ md: 3 }}
        className="order-1 flex items-center justify-center bg-gray-100 md:order-2 md:h-screen"
      >
        <NotFoundImg className="h-[143px] w-[192px] md:h-[480px] md:w-[480px]" />
      </Grid.Cell>
    </Grid>
  );
}
