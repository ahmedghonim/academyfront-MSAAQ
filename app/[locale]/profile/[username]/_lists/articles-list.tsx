"use client";

import { useTranslations } from "next-intl";
import { AnyObject } from "yup";

import { ArticleCard } from "@/components/article";
import { LoadingCard } from "@/components/loading-card";
import { useInfiniteScroll, useMediaQuery } from "@/hooks";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { fetchArticles } from "@/server-actions/services/article-service";
import { Article, BREAKPOINTS } from "@/types";

import { Button, Card, Grid, Typography } from "@msaaqcom/abjad";

type Props = {
  initialArticles: APIFetchResponse<Article[]>;
  initialFilters: AnyObject;
};
const ArticlesList = ({ initialArticles, initialFilters }: Props) => {
  const t = useTranslations();
  const {
    data: articles,
    canLoadMore,
    loadMore,
    isLoading,
    total
  } = useInfiniteScroll<Article>(initialArticles, fetchArticles, initialFilters);

  const isMD = useMediaQuery(BREAKPOINTS.md);

  if (!articles || !articles.length) {
    return null;
  }

  return (
    <Card className="articles-section-card h-full border-0 bg-gray-100">
      <Card.Body className="articles-section-card-body flex flex-col space-y-6 p-6">
        <Typography.Title
          size="md"
          className="articles-section-title font-semibold"
          children={t("instructors.the_blog", { count: total }) as string}
        />
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
          className="articles-section-grid"
        >
          {articles.map((article) => (
            <Grid.Cell key={article.id}>
              <ArticleCard article={article} />
            </Grid.Cell>
          ))}
        </Grid>
        {isLoading && (
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
            className="mt-4"
          >
            {Array.from({ length: isMD ? 3 : 1 }, (_, index) => (
              <Grid.Cell key={index}>
                <LoadingCard key={index} />
              </Grid.Cell>
            ))}
          </Grid>
        )}
        {canLoadMore && (
          <Button
            size="md"
            variant="solid"
            color="primary"
            className="load-more-articles-btn mx-auto mt-4 flex"
            isLoading={isLoading}
            onPress={loadMore}
          >
            {t("blog.load_more")}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ArticlesList;
