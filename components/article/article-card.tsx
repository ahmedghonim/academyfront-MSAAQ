import dayjs from "@/lib/dayjs";
import { ProgressBarLink } from "@/providers/progress-bar";
import { Article } from "@/types";
import { Thumbnail } from "@/ui/images";

import { Badge, Card, Typography } from "@msaaqcom/abjad";

interface Props {
  article: Article;
}

const ArticleCard = ({ article }: Props) => {
  return (
    <Card className="blog-card group h-full transform duration-150 ease-linear hover:-translate-y-2 hover:shadow-[12px_32px_32px_0px_rgba(0,0,0,0.12)]">
      <Card.Body className="blog-card-body relative flex h-full flex-col p-4">
        <Thumbnail
          src={article.thumbnail}
          alt={article.title}
          className="blog-card-thumbnail"
        />
        <div className="blog-card-content mt-3 flex flex-1 flex-col space-y-3">
          {article.taxonomies?.length > 0 && (
            <div className="blog-card-taxonomies flex flex-wrap gap-x-1 gap-y-2">
              {article.taxonomies.map((taxonomy, i) => (
                <Badge
                  as={ProgressBarLink as any}
                  // @ts-ignore
                  href={`/blog/categories/${taxonomy.slug}`}
                  key={i}
                  rounded="full"
                  color="gray"
                  variant="soft"
                  className="blog-card-taxonomy-badge z-50 px-5"
                  children={taxonomy.name}
                />
              ))}
            </div>
          )}
          <div className="blog-card-details flex flex-col space-y-2">
            <Typography.Body
              as="h3"
              size="base"
              className="blog-card-title break-words font-semibold group-hover:text-primary"
            >
              <ProgressBarLink href={`/blog/${article.slug}`}>
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                />
                {article.title}
              </ProgressBarLink>
            </Typography.Body>
            {article.excerpt && (
              <Typography.Body
                as="p"
                size="sm"
                className="blog-card-description line-clamp-3 font-normal text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />
            )}
            <Typography.Body
              as="span"
              size="sm"
              className="blog-card-published-date font-normal text-gray-700"
              children={dayjs(article.published_at).format("DD/MM/YYYY")}
            />
          </div>
          {article.created_by && (
            <Typography.Body
              as="span"
              size="sm"
              className="blog-card-author-name flex flex-1 flex-col justify-end font-semibold text-primary"
              children={article.created_by.name}
            />
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArticleCard;
