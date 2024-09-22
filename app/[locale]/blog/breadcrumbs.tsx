"use client";

import { useTranslations } from "next-intl";

import { ProgressBarLink } from "@/providers/progress-bar";

import { Breadcrumbs, Typography } from "@msaaqcom/abjad";

const BlogListingBreadcrumb = () => {
  const t = useTranslations();

  return (
    <Breadcrumbs className="mb-4 text-gray-700 md:!mb-8">
      <ProgressBarLink href="/">
        <Typography.Body className="font-normal text-gray-700">{t("common.section_titles_home_page")}</Typography.Body>
      </ProgressBarLink>
      <Typography.Body className="font-normal text-gray-700">{t("common.section_titles_blog")}</Typography.Body>
    </Breadcrumbs>
  );
};

export default BlogListingBreadcrumb;
