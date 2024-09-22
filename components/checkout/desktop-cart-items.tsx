"use client";

import { useTranslations } from "next-intl";

import { CartItem, CouponInput } from "@/components/cart";
import { Price } from "@/components/price";
import { ProductPrice } from "@/components/product";
import { Cart } from "@/types";

import { Typography } from "@msaaqcom/abjad";

const DesktopCartItems = ({ cart }: { cart: Cart }) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col space-y-6 py-8 ps-8">
      <Typography.Text
        size="sm"
        className="font-semibold"
      >
        {t.rich("shopping_cart:title_with_count", {
          span: (c) => <span className="font-normal text-gray-700 ltr:ml-1 rtl:mr-1">{c}</span>,
          count: cart.items.length
        })}
      </Typography.Text>
      <div className="relative before:absolute before:bottom-0 before:h-10 before:w-full before:bg-gradient-to-b before:from-transparent before:via-transparent before:to-gray-100">
        <div className="flex flex-col space-y-2">
          {cart.items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
            />
          ))}
        </div>
      </div>
      <div className="h-px bg-gray-400" />
      <CouponInput
        coupon={cart.coupon}
        className="hidden lg:!flex"
      />
      <div className="h-px bg-gray-400" />
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <Typography.Body className="font-medium text-gray-800">{t("common.subtotal")}</Typography.Body>
          {cart.coupon ? (
            <ProductPrice
              price={cart.total}
              salesPrice={cart.subtotal}
            />
          ) : (
            <Price
              useSymbol
              price={cart.subtotal}
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <Typography.Body className="font-medium text-gray-800">
            {t("common.vat", {
              vat: cart.tax.percent
            })}
          </Typography.Body>
          <Price
            useSymbol
            price={cart.tax.value}
          />
        </div>
      </div>
      <div className="h-px bg-gray-400" />
      <div className="flex items-center justify-between">
        <Typography.Text
          size="sm"
          className="font-semibold"
        >
          {t("common.total")}
        </Typography.Text>
        {cart.is_free ? (
          <ProductPrice
            price={0}
            salesPrice={0}
          />
        ) : (
          <Price
            useSymbol
            price={cart.total}
          />
        )}
      </div>
      {cart.tax.type === "included" && (
        <Typography.Body
          size="sm"
          className="text-gray-800"
        >
          {t("shopping_cart.vat_included")}
        </Typography.Body>
      )}
    </div>
  );
};

export default DesktopCartItems;
