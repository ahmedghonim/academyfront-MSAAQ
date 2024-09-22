"use client";

import { ReactNode, useEffect, useState } from "react";

import { ProductPrice } from "@/components/product/index";
import { Course, Product, getProductType } from "@/types";

import { cn } from "@msaaqcom/abjad/dist/theme";

const FloatingActions = ({
  product,
  actions
}: {
  product: Product | Course;
  type?: "course" | "product";
  actions?: ReactNode;
}) => {
  const [showPrice, setShowPrice] = useState<boolean>(false);

  useEffect(() => {
    if (getProductType(product) === "course") {
      setShowPrice(!(product as Course).enrolled);
    } else {
      setShowPrice(!(product as Product).can_download);
    }
  }, [product]);

  return (
    <div
      id="floating-actions"
      className="sticky bottom-0 right-0 z-50 block w-full border-t border-gray bg-white md:hidden"
    >
      <div className={cn("!container !mx-auto px-4 pb-4", actions && "pt-4")}>
        {showPrice && (
          <div className="mb-2 py-2">
            <ProductPrice
              price={product.price}
              salesPrice={product.sales_price}
            />
          </div>
        )}
        {actions}
      </div>
    </div>
  );
};

export default FloatingActions;
