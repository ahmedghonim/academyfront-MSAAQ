"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Product } from "@/types";
import { Thumbnail } from "@/ui/images";

interface Props {
  product: Product;
}

const ProductMobileImages = ({ product }: Props) => {
  const [showMoveImage, setShowMoveImage] = useState<boolean>(false);

  useEffect(() => {
    if (product?.images.length > 1) {
      setShowMoveImage(true);

      const showMoveImageTimeout = setTimeout(() => {
        setShowMoveImage(false);
        clearInterval(showMoveImageTimeout);
      }, 3950);
    }
  }, [product]);

  return !product.images.length ? null : (
    <div className="relative mb-4">
      {showMoveImage && (
        <Image
          width={150}
          height={150}
          src={"/images/movetl.gif"}
          alt={"movetl"}
          className="absolute left-1/2 top-1/2 z-10 w-1/2 -translate-x-1/2 -translate-y-1/2"
          placeholder="empty"
          priority={true}
        />
      )}
      {product?.images.length > 1 ? (
        <Swiper
          pagination={true}
          modules={[Pagination]}
          spaceBetween={10}
          className="block lg:!hidden"
        >
          {product?.images.map((image, i) => (
            <SwiperSlide key={i}>
              <Thumbnail
                alt={product.title}
                src={image.url}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Thumbnail
          alt={product.title}
          src={product.thumbnail}
          className="mb-9"
        />
      )}
    </div>
  );
};

export default ProductMobileImages;
