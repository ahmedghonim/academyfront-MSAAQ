"use client";

import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import { LoadingCard } from "@/components/loading-card";
import Pagination from "@/components/pagination";
import ReviewCard from "@/components/review-card";
import { useFetchReviewsQuery } from "@/store/slices/api/reviewSlice";
import { PageBlock, Review } from "@/types";

import { cn } from "@msaaqcom/abjad/dist/theme";

import BaseSection, { getGrid } from "./base-section";

export default function Reviews({ block }: { block: PageBlock<"reviews">; children?: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(block.data.data);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handlePageChange = (data: Review[]) => {
    setReviews(data);
  };

  return (
    <BaseSection block={block}>
      <div className="col-span-12">
        <Swiper
          spaceBetween={30}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            768: {
              slidesPerView: block.fields_values.col ?? 2,
              spaceBetween: 16
            },
            1024: {
              slidesPerView: block.fields_values.col ?? 3,
              spaceBetween: 16
            }
          }}
          className="relative"
        >
          {isFetching ? (
            <div className={cn("grid w-full gap-4", getGrid(block))}>
              {Array.from({ length: block.fields_values.col }, (_, index) => (
                <LoadingCard
                  key={index}
                  showImage={false}
                />
              ))}
            </div>
          ) : (
            reviews.map((review: Review) => (
              <SwiperSlide key={review.id}>
                <ReviewCard review={review} />
              </SwiperSlide>
            ))
          )}
        </Swiper>
        {reviews.length ? (
          <Pagination
            links={block?.data?.links}
            fetchQuery={useFetchReviewsQuery}
            params={{
              page: block.data.current_page,
              limit: block.data.per_page,
              relation_type: "course",
              relation_id: block.fields_values.courses,
              filters: {
                sort_by: {
                  created_at: "desc"
                }
              }
            }}
            total={block.data.total}
            onPageChange={handlePageChange}
            onFetching={(fetching) => setIsFetching(fetching)}
          />
        ) : null}
      </div>
    </BaseSection>
  );
}
