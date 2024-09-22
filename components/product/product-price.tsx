"use client";

import { useTranslations } from "next-intl";

import { useFormatPrice } from "@/hooks";

import { Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import { Price } from "../price";

type ProductPriceProps = {
  price: number;
  salesPrice?: number;
  className?: string;
  classNames?: {
    price?: string | string[];
    currency?: string | string[];
  };
};

const ProductPrice = ({ salesPrice, price, className, classNames }: ProductPriceProps) => {
  const { formatPrice } = useFormatPrice();
  const t = useTranslations();

  return price ? (
    <div
      className={cn("product-price-wrapper flex items-center gap-2", className)}
      suppressHydrationWarning={true}
    >
      <Price
        price={price}
        classNames={{
          price: cn("text-success", classNames?.price),
          currency: cn("text-success", classNames?.currency)
        }}
      />
      {salesPrice && salesPrice > 0 ? (
        <Typography.Body
          as="del"
          size="sm"
          className="product-sales-price font-normal text-gray-600 line-through"
          dir="auto"
          children={formatPrice(salesPrice)}
        />
      ) : null}
    </div>
  ) : (
    <Typography.Body
      size="base"
      className={cn("product-free-price font-medium text-success", classNames?.price)}
    >
      {t("common.free_price")}
    </Typography.Body>
  );
};

export default ProductPrice;
