"use client";

import { useTranslations } from "next-intl";

import { ProgressBarLink } from "@/providers/progress-bar";
import { Category } from "@/types";

import { Breadcrumbs, Typography } from "@msaaqcom/abjad";

const CourseBreadcrumbs = ({ taxonomy }: { taxonomy: Category }) => {
  const t = useTranslations();

  return (
    <Breadcrumbs className="mb-4 text-gray-700 md:!mb-8">
      <ProgressBarLink href="/">
        <Typography.Body className="font-normal text-gray-700">{t("common.section_titles_home_page")}</Typography.Body>
      </ProgressBarLink>
      <ProgressBarLink href="/courses">
        <Typography.Body className="font-normal text-gray-700">{t("common.section_titles_courses")}</Typography.Body>
      </ProgressBarLink>
      <Typography.Body className="font-normal text-gray-700">{taxonomy.name}</Typography.Body>
    </Breadcrumbs>
  );
};

export default CourseBreadcrumbs;
