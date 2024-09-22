"use client";

import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Product } from "@/types";
import { SwiperButtons } from "@/ui/buttons";
import { Thumbnail } from "@/ui/images";

interface Props {
  product: Product;
}

const ProductImages = ({ product }: Props) => {
  return product.thumbnail || product?.images.length > 1 ? (
    <div className="hidden lg:!block">
      {product?.images.length > 1 ? (
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 87,
            depth: 70,
            modifier: 4.85
          }}
          breakpoints={{
            768: {
              coverflowEffect: {
                rotate: 0,
                stretch: 80,
                depth: 110,
                modifier: 3.15
              }
            },
            1024: {
              coverflowEffect: {
                rotate: 0,
                stretch: 91.5,
                depth: 110,
                modifier: 3.15
              }
            },
            1440: {
              coverflowEffect: {
                rotate: 0,
                stretch: 87,
                depth: 70,
                modifier: 4.85
              }
            }
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="product-slider hidden lg:!block"
        >
          {product?.images.map((image, i) => (
            <SwiperSlide key={i}>
              <Thumbnail
                alt={product.title}
                src={image.url}
                size="lg"
              />
            </SwiperSlide>
          ))}
          <SwiperButtons
            color="primary"
            leftClassName="lg:left-20 left-32"
            rightClassName="lg:right-20 right-32"
          />
        </Swiper>
      ) : (
        <Thumbnail
          alt={product.title}
          src={product.thumbnail}
          size="lg"
        />
      )}
    </div>
  ) : null;
};

export default ProductImages;
