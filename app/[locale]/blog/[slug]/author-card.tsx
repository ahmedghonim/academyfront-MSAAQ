"use client";

import dayjs from "@/lib/dayjs";
import { ProgressBarLink } from "@/providers/progress-bar";
import { Article } from "@/types";

import { Avatar, Badge, Card, Typography } from "@msaaqcom/abjad";

const AuthorCard = ({ article }: { article: Article }) => {
  return (
    <Card className="rounded-3xl border-0 bg-gray-100">
      <Card.Body className="p-6">
        <Typography.Title
          as="h1"
          size="sm"
          className="mb-4 font-bold lg:mb-2"
          children={article.title}
        />
        <div className="flex flex-wrap items-center justify-between gap-0 xs:!justify-start xs:!gap-2">
          <ProgressBarLink
            className="order-1"
            href={`/@${article.created_by.username ?? article.created_by.uuid}`}
          >
            <div className="flex items-center gap-1">
              <Avatar
                imageUrl={article.created_by.avatar}
                name={article.created_by.name as string}
                size="md"
              />
              <Typography.Body
                as="span"
                children={article.created_by.name}
                size="md"
              />
            </div>
          </ProgressBarLink>
          <span className="order-2 hidden xs:!block">•</span>
          <Typography.Body
            as="span"
            children={dayjs(article.published_at).format("DD MMM YYYY")}
            size="md"
            className="order-3 mr-9 xs:order-2 xs:mr-0"
          />
          {article.taxonomies.length > 0 && (
            <div className="order-2 flex flex-wrap gap-x-1 gap-y-2 xs:order-3">
              {article.taxonomies.map((taxonomy, i) => (
                <Badge
                  //@ts-ignore
                  as={ProgressBarLink}
                  href={`/blog/categories/${taxonomy.slug}`}
                  key={i}
                  rounded="full"
                  color="gray"
                  variant="soft"
                  className="px-5"
                  children={taxonomy.name}
                />
              ))}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default AuthorCard;
