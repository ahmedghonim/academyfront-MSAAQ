"use client";

import { useEffect } from "react";

import * as Sentry from "@sentry/nextjs";
import { useLocale } from "next-intl";
import { getLangDir } from "rtl-detect";

import { BaseError } from "@/components/errors";
import { ErrorType } from "@/server-actions/config/error-handler";

import { Card } from "@msaaqcom/abjad";

export const errorsTitles = {
  [ErrorType.SUBSCRIPTION_EXPIRED]: "اشتراك منتهي - مساق",
  [ErrorType.INTERNAL_SERVER_ERROR]: "عذرًا، حدث خطأ ما، نعمل على إصلاحه.",
  [ErrorType.SERVICE_UNAVAILABLE]: "صيانة سريعة!",
  [ErrorType.TOO_MANY_ATTEMPTS]: "عذرًا، حدث خطأ ما، نعمل على إصلاحه.",
  [ErrorType.FORBIDDEN]: "تم اغلاق هذه المنصة لمخالفة المعايير والشروط الخاصة بمساق."
};

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = useLocale();
  const dir = getLangDir(locale);

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html
      lang={locale}
      dir={dir}
    >
      <head>
        <title>{errorsTitles[error.message]}</title>
      </head>
      <body className="flex min-h-screen flex-col justify-between">
        <main className="my-auto">
          <div className="container mx-auto px-4 md:px-0">
            <Card className="bg-gray-100">
              <Card.Body className="flex flex-col items-center justify-center space-y-8 p-8">
                <BaseError error={error} />
              </Card.Body>
            </Card>
          </div>
        </main>
      </body>
    </html>
  );
}
