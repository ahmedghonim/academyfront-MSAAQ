"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { AnyObject } from "yup";

import { ArticleCard } from "@/components/article";
import { LoadingCard } from "@/components/loading-card";
import { useInfiniteScroll, useMediaQuery } from "@/hooks";
import EmptyStateImage from "@/public/images/empty-state-image.svg";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { fetchArticles } from "@/server-actions/services/article-service";
import { Article, BREAKPOINTS } from "@/types";

import { Button, Card, Grid, Typography } from "@msaaqcom/abjad";

type Props = {
  initialArticles: APIFetchResponse<Article[]>;
  initialFilters: AnyObject;
};
const ArticlesListing = ({ initialArticles, initialFilters }: Props) => {
  const t = useTranslations();
  const { data, canLoadMore, loadMore, isLoading } = useInfiniteScroll<Article>(
    initialArticles,
    fetchArticles,
    initialFilters
  );

  const [articles, setArticles] = useState<{
    latest: Article[];
    featured: Article[];
    rest: Article[];
  }>({
    latest: data.length >= 5 ? data.slice(0, 2) : [],
    featured: data.length >= 5 ? data.slice(2, 5) : data.slice(0, 3),
    rest: data.length >= 5 ? data.slice(5) : data.slice(3)
  });

  const isMD = useMediaQuery(BREAKPOINTS.md);

  useEffect(() => {
    if (data) {
      setArticles({
        latest: data.length >= 5 ? data.slice(0, 2) : [],
        featured: data.length >= 5 ? data.slice(2, 5) : data.slice(0, 3),
        rest: data.length >= 5 ? data.slice(5) : data.slice(3)
      });
    }
  }, [data]);

  const isEmpty = !articles.latest.length && !articles.featured.length && !articles.rest.length;

  return (
    <>
      {articles.latest.length > 0 && (
        <Card className="mb-8 bg-gray-100">
          <Card.Body>
            <Typography.Title
              size="lg"
              as="h2"
              children={t("blog.latest_articles")}
              className="mb-8 mt-6 font-semibold"
            />
            <Grid
              columns={{
                md: 2,
                sm: 1
              }}
              gap={{
                xs: "1rem",
                sm: "1rem",
                md: "1rem",
                lg: "1rem",
                xl: "1rem"
              }}
            >
              {articles.latest.map((article) => (
                <Grid.Cell key={article.id}>
                  <ArticleCard article={article} />
                </Grid.Cell>
              ))}
            </Grid>
          </Card.Body>
        </Card>
      )}
      {(articles.featured.length > 0 || articles.rest.length > 0) && (
        <Card className="bg-gray-100">
          <Card.Body>
            <Typography.Heading
              level="h5"
              as="h2"
              children={t("blog.all_articles")}
              className="mb-8 mt-6"
            />
            <div className="grid gap-8">
              {articles.featured.length > 0 && (
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
                >
                  {articles.featured.map((article) => (
                    <Grid.Cell key={article.id}>
                      <ArticleCard article={article} />
                    </Grid.Cell>
                  ))}
                </Grid>
              )}
              <Grid
                columns={{
                  md: 4,
                  sm: 1
                }}
                gap={{
                  xs: "1rem",
                  sm: "1rem",
                  md: "1rem",
                  lg: "1rem",
                  xl: "1rem"
                }}
              >
                {articles.rest.map((article) => (
                  <Grid.Cell key={article.id}>
                    <ArticleCard article={article} />
                  </Grid.Cell>
                ))}
              </Grid>
            </div>
            {isLoading && (
              <Grid
                columns={{
                  md: 4,
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
                {Array.from({ length: isMD ? 4 : 1 }, (_, index) => (
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
                className="mx-auto mt-4 flex"
                isLoading={isLoading}
                onPress={loadMore}
              >
                {t("blog.load_more")}
              </Button>
            )}
          </Card.Body>
        </Card>
      )}
      {isEmpty && (
        <Card className="bg-gray-100">
          <Card.Body className="flex flex-col items-center justify-center space-y-8 p-8">
            <EmptyStateImage className="h-56 w-56 text-primary md:!h-64 md:!w-64 lg:!h-80 lg:!w-80" />
            <Typography.Title
              as="p"
              size="md"
              className="font-semibold"
            >
              {t("blog.empty")}
            </Typography.Title>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default ArticlesListing;
