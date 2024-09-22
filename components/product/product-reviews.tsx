import { fetchReviews, fetchReviewsDistribution } from "@/server-actions/services/reviews-service";
import { Course, Product } from "@/types";

import ProductReviewsSection from "./product-reviews-section";

interface Props {
  product: Course | Product;
  reviewsEnabled: boolean;
  reviewsArgs: { limit: number; relation_type: "product" | "course"; relation_id: number | string };
  reviewsDistributionArgs: { relation_type: "product" | "course"; relation_id: number | string };
}

const ProductReviews = async ({ product, reviewsEnabled, reviewsArgs, reviewsDistributionArgs }: Props) => {
  if (!reviewsEnabled) {
    return null;
  }

  const reviews = await fetchReviews(reviewsArgs);
  const reviewsDistribution = await fetchReviewsDistribution(reviewsDistributionArgs);

  return (
    <ProductReviewsSection
      reviewsDistribution={reviewsDistribution.data}
      initialReviews={reviews}
      product={product}
      reviewsEnabled={reviewsEnabled}
    />
  );
};

export default ProductReviews;
