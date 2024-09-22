"use client";

import { useTranslations } from "next-intl";
import { Controller, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { CourseCard } from "@/components/course";
import { Course, Product } from "@/types";
import { SwiperButtons } from "@/ui/buttons";

import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

import ProductCard from "./product-card";
import ProductSectionCard from "./product-section-card";

const OtherProductsCard = ({ type, products }: { type: "course" | "product"; products: Product[] | Course[] }) => {
  const t = useTranslations();

  return (
    <div className="mt-8 hidden md:block">
      <ProductSectionCard
        align="center"
        vertical
        title={type == "product" ? t("common.other_products") : t("common.other_courses")}
        icon={<ArrowTrendingUpIcon />}
        children={
          <Swiper
            spaceBetween={16}
            navigation={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 16
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 16
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 16
              }
            }}
            modules={[Navigation, Controller]}
            className="px-0 pb-12 pt-2 md:!px-8"
          >
            {products?.map((product: Product | Course, i: number) => (
              <SwiperSlide key={i}>
                {type == "product" ? (
                  <ProductCard product={product as Product} />
                ) : (
                  <CourseCard course={product as Course} />
                )}
              </SwiperSlide>
            ))}
            <SwiperButtons />
          </Swiper>
        }
        hasDivider
        dividerPosition="top"
        className="!px-8 !py-12"
      />
    </div>
  );
};

export default OtherProductsCard;
