"use client";

import { useTranslations } from "next-intl";

import { ProductSectionCard } from "@/components/product";
import { Article } from "@/types";

import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

import { Grid } from "@msaaqcom/abjad";

import ArticleCard from "./article-card";

const OtherArticles = ({ articles }: { articles: Article[] | null }) => {
  const t = useTranslations();

  if (!articles?.length) {
    return null;
  }

  return (
    <ProductSectionCard
      align="center"
      vertical
      title={t("blog.other_articles")}
      icon={<ArrowTrendingUpIcon />}
      children={
        <Grid
          columns={{
            md: 3,
            sm: 1
          }}
          gap={{
            xs: "1rem",
            sm: "1rem",
            md: "1rem",
            lg: "1rem",
            xl: "1rem"
          }}
          className="grid-flow-row-dense"
        >
          {articles?.map((article, i) => (
            <Grid.Cell key={i}>{<ArticleCard article={article} />}</Grid.Cell>
          ))}
        </Grid>
      }
      hasDivider
      dividerPosition="top"
      className="!px-8 !py-12"
    />
  );
};

export default OtherArticles;
