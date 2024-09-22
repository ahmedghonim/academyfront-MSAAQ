"use client";

import { useTranslations } from "next-intl";

import { ProgressBarLink } from "@/providers/progress-bar";

import { Breadcrumbs as BaseBreadcrumbs, Typography } from "@msaaqcom/abjad";

const ProductBreadcrumbs = ({
  title,
  path,
  pathLabel,
  className
}: {
  className?: string;
  title: string;
  pathLabel: string;
  path: string;
}) => {
  const t = useTranslations();

  return (
    <BaseBreadcrumbs className={className}>
      <ProgressBarLink href="/">
        <Typography.Body className="font-normal text-gray-700">{t("common.section_titles_home_page")}</Typography.Body>
      </ProgressBarLink>
      <ProgressBarLink href={path}>
        <Typography.Body className="font-normal text-gray-700">{pathLabel}</Typography.Body>
      </ProgressBarLink>
      <Typography.Body className="font-normal text-gray-700">{title}</Typography.Body>
    </BaseBreadcrumbs>
  );
};

export default ProductBreadcrumbs;
