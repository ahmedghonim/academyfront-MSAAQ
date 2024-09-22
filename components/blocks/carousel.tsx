"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { PageBlock } from "@/types";
import { SwiperButtons } from "@/ui/buttons";
import { Thumbnail } from "@/ui/images";

import { Typography } from "@msaaqcom/abjad";

import BaseSection from "./base-section";

export default function Features({ block }: { block: PageBlock<"carousel"> }) {
  return (
    <BaseSection block={block}>
      <div className="relative col-span-12">
        <Swiper
          modules={[Pagination, Autoplay]}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 16
            },
            1024: {
              slidesPerView: block.fields_values.col ?? 3,
              spaceBetween: 16
            }
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          spaceBetween={10}
          className="rounded-2xl"
        >
          {block.fields_values.features.map((item, i) => (
            <SwiperSlide key={i}>
              {item.icon && (
                <div className="relative w-full">
                  <Thumbnail
                    size="lg"
                    className={block.fields_values.col === 1 || block.fields_values.col === 2 ? "md:aspect-h-6" : ""}
                    alt={item.title}
                    src={item.icon}
                  />
                </div>
              )}
              {(item.title || item.description) && (
                <div className="align-center absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-center rounded-2xl bg-black/40 text-center">
                  <Typography.Title
                    as="h3"
                    size="md"
                    className="mb-2 font-bold text-white"
                  >
                    {item.title}
                  </Typography.Title>
                  <Typography.Body
                    as="p"
                    size="base"
                    className="text-white"
                  >
                    {item.description}
                  </Typography.Body>
                </div>
              )}
            </SwiperSlide>
          ))}
          <SwiperButtons color="gray" />
        </Swiper>
      </div>
    </BaseSection>
  );
}
