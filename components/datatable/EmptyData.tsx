"use client";

import { FC, useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import TableEmptyState, { EmptyStateProps } from "@/components/table-empty-state";
import { useDynamicSearchParams } from "@/hooks";

import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";

import { Button, Icon } from "@msaaqcom/abjad";

const EmptyStateTable: FC<EmptyStateProps> = ({
  title: providedTitle,
  content: providedContent,
  children,
  icon,
  ...props
}) => {
  const [title, setTitle] = useState<string | undefined>(providedTitle);
  const [content, setContent] = useState<string | undefined>(providedContent);
  const t = useTranslations();
  const searchParams = useDynamicSearchParams();
  const { search, filters } = searchParams.unflattenParams;

  useEffect(() => {
    if (search || filters) {
      setTitle("ليس لديك أي طلبات!");
      setContent("لم يتمّ العثور على أي طلبات حتى الآن، يمكنك العودة للمنصة لشراء منتجك الأول.");
    } else {
      setTitle(providedTitle);
      setContent(providedContent);
    }

    return () => {
      setTitle(providedTitle);
      setContent(providedContent);
    };
  }, [providedTitle, providedContent, search, filters]);

  return (
    <TableEmptyState
      title={title}
      content={content}
      className="min-h-[theme(spacing.64)]"
      icon={
        search || filters ? (
          <Icon
            children={<MagnifyingGlassCircleIcon />}
            className="h-12 w-12 text-gray-600"
          />
        ) : (
          icon
        )
      }
      {...props}
    >
      {search || filters ? (
        <Button
          children={t("empty_sections.no_results_found")}
          onPress={() => searchParams.clear()}
        />
      ) : (
        children
      )}
    </TableEmptyState>
  );
};

export default EmptyStateTable;
