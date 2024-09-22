"use client";

import { useEffect, useMemo, useState } from "react";

import { revalidateTag } from "next/cache";

import { useTranslations } from "next-intl";

import { RateProductModal } from "@/components/modals";
import { useInfiniteScroll } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useSession } from "@/providers/session-provider";
import NoReviews from "@/public/images/no-reviews.svg";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { tags } from "@/server-actions/config/tags";
import { fetchReviews } from "@/server-actions/services/reviews-service";
import { setOpenRatingModal } from "@/store/slices/courses-slice";
import { Course, Product, ProductModelType, Review, ReviewsAverage, getProductType } from "@/types";

import { StarIcon } from "@heroicons/react/24/outline";

import { Button, Icon, Typography } from "@msaaqcom/abjad";

import ProductReviewCard from "./product-review-card";
import ProductReviewsDistribution from "./product-reviews-distribution";
import ProductSectionCard from "./product-section-card";

interface Props {
  product: Course | Product;
  reviewsEnabled: boolean;
  title?: string;
  initialReviews: APIFetchResponse<Review[]>;
  reviewsDistribution: { reviews: ReviewsAverage[]; average: number; total: number };
}

const ProductReviewsSection = ({ title, product, reviewsEnabled, initialReviews, reviewsDistribution }: Props) => {
  const t = useTranslations();
  const [canReview, setCanReview] = useState<boolean>(false);
  const { member } = useSession();
  const dispatch = useAppDispatch();

  const productType = useMemo(() => getProductType(product), [product]);

  const {
    data: reviews,
    canLoadMore,
    loadMore,
    isLoading,
    currentPage
  } = useInfiniteScroll<Review>(initialReviews, fetchReviews, {
    limit: 3,
    relation_type: productType,
    relation_id: product.id
  });

  const { percentageCompleted } = useAppSelector((state) => state.courses);

  useEffect(() => {
    if (productType === ProductModelType.PRODUCT) {
      setCanReview(
        (product as Product).can_download && (product as Product).meta.reviews_enabled && member && !product.is_reviewed
      );
    } else {
      setCanReview(
        (product as Course).enrolled &&
          (product as Course).settings.reviews_enabled &&
          member &&
          percentageCompleted > 50 &&
          !product.is_reviewed
      );
    }
  }, [product, member]);

  if (!reviews?.length && !reviewsEnabled) {
    return null;
  }

  return (
    <ProductSectionCard
      title={t("reviews.title")}
      icon={<StarIcon />}
      children={
        <>
          {reviews?.length > 0 ? (
            <>
              <ProductReviewsDistribution
                reviewsDistribution={reviewsDistribution}
                titleKey={productType === ProductModelType.PRODUCT ? "product_reviews_count" : "course_reviews_count"}
              />
              <div className="relative flex items-center gap-3 py-5">
                <div className="flex-grow border-t border-gray-400"></div>
                <Typography.Body
                  as="h6"
                  size="sm"
                  children={t("reviews.label")}
                />
                <div className="flex-grow border-t border-gray-400"></div>
              </div>
              {reviews.map((review) => (
                <ProductReviewCard
                  setCanReview={setCanReview}
                  review={review}
                  queryParams={{
                    limit: 3,
                    relation_type: productType,
                    relation_id: product.id,
                    relation_slug: product.slug,
                    page: currentPage
                  }}
                  key={review.id}
                />
              ))}
              {canReview && (
                <div className="flex flex-col items-center justify-center gap-8 md:!flex-row">
                  {canReview && reviewsEnabled && (
                    <Button
                      isDisabled={!canReview}
                      icon={
                        <Icon size="md">
                          <StarIcon />
                        </Icon>
                      }
                      className="w-full md:!w-auto"
                      children={t("reviews.review_now")}
                      onPress={() => dispatch(setOpenRatingModal(true))}
                    />
                  )}
                  {canLoadMore && (
                    <Button
                      size="md"
                      isLoading={isLoading}
                      isDisabled={isLoading}
                      onPress={() => loadMore()}
                      children={t("reviews.load_more")}
                      color="gray"
                      className="w-full md:!w-auto"
                    />
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="mx-auto w-60 md:!w-96">
                <NoReviews />
              </div>
              <Typography.Title
                as="p"
                className="text-center"
                children={title ?? (member ? t("reviews.empty") : t("reviews.empty_guest"))}
              />
              {!member ? (
                <Button
                  href="/login"
                  children={t("common.join_now")}
                />
              ) : (
                canReview &&
                reviewsEnabled && (
                  <Button
                    icon={
                      <Icon size="md">
                        <StarIcon />
                      </Icon>
                    }
                    isDisabled={!canReview}
                    children={t("reviews.review_now")}
                    onPress={() => dispatch(setOpenRatingModal(true))}
                  />
                )
              )}
            </div>
          )}
          <RateProductModal
            product={product}
            callback={async () => {
              setCanReview(false);

              //TODO: handle optimistic updates
              revalidateTag(tags.fetchReviews(productType, product.id));
              revalidateTag(tags.fetchReviewsDistribution(productType, product.id));
            }}
          />
        </>
      }
    />
  );
};

export default ProductReviewsSection;
