"use client";

import { useTranslations } from "next-intl";

import { AddToCartButton, ExpressCheckoutButton } from "@/components/cart";
import StarsRating from "@/components/stars-rating";
import { ProgressBarLink } from "@/providers/progress-bar";
import { Product, ProductType } from "@/types";
import { Thumbnail } from "@/ui/images";
import transWithCount from "@/utils/trans-with-count";

import { AcademicCapIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

import { Badge, Button, Card, Icon, Typography } from "@msaaqcom/abjad";

import ProductPrice from "./product-price";

const PATH = {
  [ProductType.DIGITAL]: {
    path: "/products",
    color: "info"
  },
  [ProductType.BUNDLE]: {
    path: "/bundles",
    color: "purple"
  },
  [ProductType.COACHING_SESSION]: {
    path: "/coaching-sessions",
    color: "success"
  }
};

const ProductCard = ({ product, hasFooter = true }: { product: Product; hasFooter?: boolean }) => {
  const t = useTranslations();
  const path = PATH[product.type];

  return (
    <Card className="group h-full transform duration-150 ease-linear hover:-translate-y-2 hover:shadow-[12px_32px_32px_0px_rgba(0,0,0,0.12)]">
      <Card.Body className="relative flex h-full flex-col p-4">
        <Thumbnail
          src={product.thumbnail}
          alt={product.title}
        />
        <div className="mt-4 flex flex-1 flex-col space-y-2">
          <div className="flex items-start justify-between gap-4">
            <Typography.Body
              as="h3"
              size="base"
              className="break-words font-semibold group-hover:text-primary"
            >
              <ProgressBarLink href={`${path.path}/${product.slug}`}>
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                />
                {product.title}
              </ProgressBarLink>
            </Typography.Body>
            <Badge
              rounded="full"
              variant="soft"
              color={path.color as any}
              size="md"
              className="flex-shrink-0 px-5"
              children={t("common.product_types_" + product.type)}
            />
          </div>
          <div className="flex flex-1 flex-col justify-end space-y-2">
            <div className="flex items-center justify-between">
              {!product.meta.custom_url && product.type !== ProductType.COACHING_SESSION && (
                <div className="flex items-center gap-2">
                  <Icon
                    className="text-gray-700"
                    size="sm"
                    children={<AcademicCapIcon />}
                  />
                  <Typography.Body
                    size="md"
                    className="font-medium text-gray-700"
                    children={t(transWithCount("common.digital_products_WithCount", product.attachments.length), {
                      count: product.attachments.length
                    })}
                  />
                </div>
              )}
              {product.meta.reviews_enabled && (
                <StarsRating
                  value={product?.avg_rating ?? 0}
                  size="sm"
                  isReadOnly
                />
              )}
            </div>
            <ProductPrice
              className="py-2"
              price={product.price}
              salesPrice={product.sales_price}
            />
          </div>
        </div>
      </Card.Body>
      {hasFooter && (
        <Card.Footer className="mt-auto flex-col space-y-4">
          {product.type === ProductType.COACHING_SESSION ? (
            <Button
              href={`${path.path}/${product.slug}/booking-details`}
              className="w-full"
            >
              <span className="absolute inset-0 z-10"></span>
              <span className="relative">{t("common.book_it_for_free")}</span>
            </Button>
          ) : !product.can_download ? (
            <div className="flex gap-4">
              <ExpressCheckoutButton
                product_type="product"
                product_id={product.id}
                color="primary"
                size="md"
                variant="solid"
                className="w-full"
                label={product.price == 0 ? t("common.get_it_for_free") : t("common.buy_now")}
              />
              <AddToCartButton
                product={product}
                product_type="product"
                product_id={product.id}
                color="gray"
                size="md"
                icon={
                  <Icon>
                    <ShoppingCartIcon />
                  </Icon>
                }
              />
            </div>
          ) : (
            <Button
              variant="outline"
              href={`${path.path}/${product.slug}`}
              className="w-full"
            >
              <span className="absolute inset-0 z-10"></span>
              <span className="relative">{t("common.view_details")}</span>
            </Button>
          )}
        </Card.Footer>
      )}
    </Card>
  );
};

export default ProductCard;
