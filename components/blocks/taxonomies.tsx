"use client";

import { useMemo } from "react";

import { CategoryType, PageBlock } from "@/types";

import { Button } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import BaseSection, { justifyAlignment } from "./base-section";

export default function Taxonomies({ block }: { block: PageBlock<"taxonomies"> }) {
  const taxonomies = useMemo(
    () =>
      block.data?.data?.map((taxonomy) => {
        let path = "";

        switch (taxonomy.type) {
          case CategoryType.COURSE_CATEGORY:
            path = `/courses/categories/${taxonomy.slug}`;
            break;
          case CategoryType.COURSE_DIFFICULTY:
            path = `/courses/difficulties/${taxonomy.slug}`;
            break;
          case CategoryType.POST_CATEGORY:
            path = `/blog/categories/${taxonomy.slug}`;
            break;
          case CategoryType.PRODUCT_CATEGORY:
            path = `/products/categories/${taxonomy.slug}`;
            break;
        }

        return {
          ...taxonomy,
          path
        };
      }),
    [block.data.data]
  );

  return (
    <BaseSection block={block}>
      <div className={cn("col-span-12 flex flex-wrap gap-3", justifyAlignment(block))}>
        {taxonomies?.map((taxonomy, index) => (
          <Button
            key={index}
            href={taxonomy.path}
            variant="solid"
            color="primary"
            size="sm"
          >
            {taxonomy.name}
          </Button>
        ))}
      </div>
    </BaseSection>
  );
}
