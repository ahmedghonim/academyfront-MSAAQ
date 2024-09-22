"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import StarsRating from "@/components/stars-rating";
import { ReviewsAverage } from "@/types";

import { Card, Progress, Typography } from "@msaaqcom/abjad";

interface Props {
  titleKey: string;
  reviewsDistribution: { reviews: ReviewsAverage[]; average: number; total: number };
}

const ProductReviewsDistribution = ({ titleKey, reviewsDistribution }: Props) => {
  const t = useTranslations();

  const [ratings, setRatings] = useState<ReviewsAverage[]>([
    {
      aggregate: 0,
      rating: 5
    },
    {
      aggregate: 0,
      rating: 4
    },
    {
      aggregate: 0,
      rating: 3
    },
    {
      aggregate: 0,
      rating: 2
    },
    {
      aggregate: 0,
      rating: 1
    }
  ]);

  const [totalReviews, setTotalReviews] = useState<number>(0);

  useEffect(() => {
    if (reviewsDistribution) {
      reviewsDistribution.reviews.forEach((item) => {
        const ratingIndex = ratings.findIndex((rating) => rating.rating === item.rating);

        if (ratingIndex !== -1) {
          setRatings((prev) => {
            const newRatings = [...prev];

            newRatings[ratingIndex].aggregate = item.aggregate;

            return newRatings;
          });
        }
      });

      setTotalReviews(reviewsDistribution.total);
    }
  }, [reviewsDistribution]);

  return (
    <Card>
      <Card.Body className="flex flex-col justify-between gap-6 p-6 md:!flex-row">
        <div className="grid grow items-start justify-start">
          <Typography.Heading
            level="h2"
            as="h5"
            children={reviewsDistribution?.average}
          />
          <StarsRating
            value={reviewsDistribution?.average}
            isReadOnly
            size="md"
          />
          <Typography.Body
            size="md"
            className="mt-2 font-normal text-gray-700"
            children={t(`reviews:${titleKey}`, { review: totalReviews })}
          />
        </div>
        <div className="grid grow items-center gap-4">
          {ratings.map((rate, i) => (
            <div
              key={i}
              className="flex items-center gap-2"
            >
              <Typography.Body
                size="sm"
                className="font-normal text-gray-700"
                children={t("reviews.stars", { star: rate.rating })}
              />
              <div className="grow">
                <Progress.Bar
                  color="warning"
                  value={totalReviews > 0 ? Math.round((rate.aggregate / totalReviews) * 100) : 0}
                />
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductReviewsDistribution;
