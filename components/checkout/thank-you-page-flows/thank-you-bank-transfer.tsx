"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

import { useSession } from "@/providers/session-provider";
import { TenantLogo } from "@/ui/images";

import { Button, Card, Typography } from "@msaaqcom/abjad";

const ThankYouBankTransfer = () => {
  const t = useTranslations();

  const { member } = useSession();

  return (
    <>
      <header className="bg-white py-6">
        <div className="container mx-auto flex items-center gap-4">
          <TenantLogo />
        </div>
      </header>
      <Card className="mx-auto sm:w-[418px] md:w-[518px] lg:w-[618px]">
        <Card.Body className="flex flex-col justify-center p-6">
          <div className="mb-4 flex flex-col items-center">
            <Image
              className="mb-3 select-none"
              src={"/images/check-success.gif"}
              alt={"check-success"}
              width={200}
              height={200}
            />
            <div className="flex flex-col items-center gap-1">
              <Typography.Text
                size="sm"
                className="font-semibold"
                children={t("thank_you_page.bank_transfer_title")}
              />
              <Typography.Body
                as="p"
                size="base"
                className="text-center font-normal text-gray-700"
                children={t("thank_you_page.bank_transfer_description")}
              />
            </div>
          </div>
          {member ? (
            <Button
              href="/library/courses"
              variant="solid"
              color="primary"
              className="mx-auto"
            >
              {t("thank_you_page.bank_transfer_action")}
            </Button>
          ) : (
            <Button
              href="/login?callbackUrl=/library/courses"
              variant="solid"
              color="primary"
              className="mx-auto"
            >
              {t("thank_you_page.bank_transfer_action")}
            </Button>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ThankYouBankTransfer;
