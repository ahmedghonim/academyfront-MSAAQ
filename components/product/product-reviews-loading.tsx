"use client";

import { useTranslations } from "next-intl";

import ProductSectionCard from "@/components/product/product-section-card";

import { StarIcon } from "@heroicons/react/24/outline";

const ProductReviewsLoading = () => {
  const t = useTranslations();

  return (
    <ProductSectionCard
      title={t("reviews.title")}
      icon={<StarIcon />}
      children={
        <div
          role="status"
          className="animate-pulse space-y-2.5"
        >
          <div className="flex w-full items-center">
            <div className="h-2.5 w-32 rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-24 rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-full rounded-full bg-gray"></div>
          </div>
          <div className="flex w-full max-w-[480px] items-center">
            <div className="h-2.5 w-full rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-full rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-24 rounded-full bg-gray"></div>
          </div>
          <div className="flex w-full max-w-[400px] items-center">
            <div className="h-2.5 w-full rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-80 rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-full rounded-full bg-gray"></div>
          </div>
          <div className="flex w-full max-w-[480px] items-center">
            <div className="ms-2 h-2.5 w-full rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-full rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-24 rounded-full bg-gray"></div>
          </div>
          <div className="flex w-full max-w-[440px] items-center">
            <div className="ms-2 h-2.5 w-32 rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-24 rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-full rounded-full bg-gray"></div>
          </div>
          <div className="flex w-full max-w-[360px] items-center">
            <div className="ms-2 h-2.5 w-full rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-80 rounded-full bg-gray"></div>
            <div className="ms-2 h-2.5 w-full rounded-full bg-gray"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      }
    />
  );
};

export default ProductReviewsLoading;
