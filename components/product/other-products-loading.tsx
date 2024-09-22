"use client";

import { useTranslations } from "next-intl";

import { LoadingCard } from "@/components/loading-card";

import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

import { Grid } from "@msaaqcom/abjad";

import ProductSectionCard from "./product-section-card";

const OtherProductsLoading = ({ type }: { type: "course" | "product" }) => {
  const t = useTranslations();

  return (
    <div className="mt-8 hidden md:block">
      <ProductSectionCard
        align="center"
        vertical
        title={type == "product" ? t("common.other_products") : t("common.other_courses")}
        icon={<ArrowTrendingUpIcon />}
        children={
          <Grid
            columns={{
              lg: 12,
              xl: 12,
              md: 12
            }}
            gap={{
              xs: "1rem",
              sm: "1rem",
              md: "1rem",
              lg: "1rem",
              xl: "1rem"
            }}
          >
            {Array.from({ length: 3 }, (_, index) => (
              <Grid.Cell
                key={index}
                columnSpan={{
                  lg: 4,
                  md: 6
                }}
                className="h-full"
              >
                <LoadingCard />
              </Grid.Cell>
            ))}
          </Grid>
        }
        hasDivider
        dividerPosition="top"
        className="!px-8 !py-12"
      />
    </div>
  );
};

export default OtherProductsLoading;
