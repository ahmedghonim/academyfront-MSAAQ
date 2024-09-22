"use client";

import { useTranslations } from "next-intl";

import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";

import { Button, Card, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

const NelcCard = () => {
  const t = useTranslations();

  return (
    <>
      <Card className={cn("rounded-xl bg-gray-100", "mb-4 rounded-2xl bg-white px-4 last:mb-0")}>
        <Card.Body className="flex flex-col items-start justify-between gap-3 md:mb-0 md:!flex-row md:!items-center">
          <div className="flex w-full items-center justify-start gap-3">
            <Icon
              color="gray"
              rounded="full"
              size="sm"
              variant="soft"
            >
              <DocumentTextIcon />
            </Icon>
            <Typography.Body
              as="h6"
              size="base"
              children={t("course_page.guides")}
            />
          </div>
          <Button
            target="_blank"
            href="https://nelcdemo.msaaq.net/guides101"
            className="w-full underline md:!w-auto"
            color="gray"
            icon={
              <Icon size="md">
                <ArrowUpRightIcon />
              </Icon>
            }
            children={t("course_page.browse_guides")}
          />
        </Card.Body>
      </Card>
      <Card className={cn("rounded-xl bg-gray-100", "mb-4 rounded-2xl bg-white px-4 last:mb-0")}>
        <Card.Body className="flex flex-col items-start justify-between gap-3 md:mb-0 md:!flex-row md:!items-center">
          <div className="flex w-full items-center justify-start gap-3">
            <Icon
              color="gray"
              rounded="full"
              size="sm"
              variant="soft"
            >
              <DocumentTextIcon />
            </Icon>
            <Typography.Body
              as="h6"
              size="base"
              children={t("course_page.getting_started")}
            />
          </div>
          <Button
            target="_blank"
            href="https://nelcdemo.msaaq.net/getting-started"
            className="w-full underline md:!w-auto"
            color="gray"
            icon={
              <Icon size="md">
                <ArrowUpRightIcon />
              </Icon>
            }
            children={t("course_page.get_started_here")}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default NelcCard;
