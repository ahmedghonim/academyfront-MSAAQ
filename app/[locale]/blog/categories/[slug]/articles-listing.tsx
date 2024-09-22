"use client";

import { useTranslations } from "next-intl";

import { ArticleCard } from "@/components/article";
import EmptyStateImage from "@/public/images/empty-state-image.svg";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { Article } from "@/types";

import { Card, Grid, Typography } from "@msaaqcom/abjad";

type Props = {
  articles: APIFetchResponse<Article[]>;
  title: string;
};
const ArticlesListing = ({ articles, title }: Props) => {
  const t = useTranslations();

  const isEmpty = !articles.data.length;

  return (
    <>
      {articles.data.length > 0 && (
        <Card className="bg-gray-100">
          <Card.Body>
            <Typography.Heading
              level="h5"
              as="h2"
              children={title}
              className="mb-8 mt-6"
            />
            <div className="grid gap-8">
              {articles.data.length > 0 && (
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
                  {articles.data.map((article) => (
                    <Grid.Cell key={article.id}>
                      <ArticleCard article={article} />
                    </Grid.Cell>
                  ))}
                </Grid>
              )}
            </div>
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
