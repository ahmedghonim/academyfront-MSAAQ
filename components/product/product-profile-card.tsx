"use client";

import { ReactNode } from "react";

import { useTranslations } from "next-intl";

import StarsRating from "@/components/stars-rating";
import { ProgressBarLink } from "@/providers/progress-bar";

import { Badge, Card, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface ProductCardProps {
  badge?: ReactNode;
  title: string;
  summary: string;
  category?: any;
  categoryHref?: string;
  ratings: number;
  ratingsDetails?: ReactNode;
  totalReviews: number;
  list: {
    label?: string;
    className?: string;
    items: {
      icon: ReactNode;
      text: ReactNode;
      className?: string;
    }[];
  };
  price?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  append?: ReactNode;
  reviewsEnabled?: boolean;
}

const ProductProfileCard = ({
  badge,
  title,
  reviewsEnabled,
  summary,
  ratings,
  ratingsDetails,
  totalReviews,
  category,
  list,
  price,
  children,
  actions,
  append,
  categoryHref
}: ProductCardProps) => {
  const t = useTranslations();

  return (
    <Card className="sticky top-[calc(var(--header-placement)+theme(spacing.4))] transition-all">
      <Card.Header>
        <div className="hidden flex-col items-start border-b-0 lg:!flex">
          {badge}
          <Typography.Body
            as="h1"
            size="lg"
            className="mb-4 mt-1 font-bold text-black"
            children={title}
          />
          {summary && (
            <span
              className="prose prose-sm prose-gray mb-4"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          )}
          {category && (
            <Badge
              // @ts-ignore
              as={ProgressBarLink}
              href={categoryHref}
              variant="soft"
              color="gray"
              rounded="full"
              size="md"
              children={category.name}
            />
          )}
        </div>
        <div className="block md:!hidden">
          {append}
          <div className="flex flex-col items-start">
            {badge}
            <Typography.Body
              as="h2"
              size="lg"
              className="mb-4 mt-1 font-bold text-black"
              children={title}
            />
            {summary && (
              <Typography.Body
                as="p"
                size="md"
                className="mb-4 font-normal text-gray-800"
                children={summary}
              />
            )}
            {category && (
              <Badge
                // @ts-ignore
                as={ProgressBarLink}
                href={categoryHref}
                variant="soft"
                color="gray"
                rounded="full"
                size="md"
                children={category.name}
              />
            )}
          </div>
        </div>
        {price && <div className="hidden py-2 md:block">{price}</div>}
        {actions && <div className="mt-2 hidden md:block">{actions}</div>}
      </Card.Header>
      <Card.Body className="!px-4 !pb-4 !pt-2">
        {(reviewsEnabled || ratingsDetails) && (
          <div className="mb-4 flex items-center gap-2 py-2">
            {reviewsEnabled && (
              <StarsRating
                value={ratings}
                isReadOnly
                size="sm"
                label={String(ratings)}
                children={
                  <Typography.Body
                    size="sm"
                    children={t("reviews.reviews_count", { count: totalReviews })}
                  />
                }
              />
            )}
            {ratingsDetails}
          </div>
        )}
        <div className="flex flex-col space-y-4">
          {list.label && (
            <Typography.Body
              as="h3"
              size="md"
              className="font-medium text-black"
              children={list.label}
            />
          )}
          <ul className={cn(list.className)}>
            {list.items.map((item, index) => (
              <li
                key={index}
                className={cn(`flex items-center gap-2`, item.className)}
              >
                {item.icon && (
                  <Icon
                    size="sm"
                    children={item.icon}
                  />
                )}
                <Typography.Body
                  size="md"
                  className="font-normal text-black"
                  children={item.text}
                />
              </li>
            ))}
          </ul>
        </div>
        {children}
      </Card.Body>
    </Card>
  );
};

export default ProductProfileCard;
