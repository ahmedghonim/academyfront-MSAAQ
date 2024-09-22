"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { CartItem } from "@/components/cart";
import PrivacyPolicyText from "@/components/payment-methods/privacy-policy-text";
import { Price } from "@/components/price";
import { ProductPrice } from "@/components/product";
import { useFormatPrice } from "@/hooks";
import { Cart } from "@/types";
import { Thumbnail } from "@/ui/images";
import { classNames } from "@/utils";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import { Button, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

const MobileCartItems = ({ cart }: { cart: Cart }) => {
  const t = useTranslations();
  const { formatPriceWithoutCurrency, currentCurrency } = useFormatPrice();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={cn("fixed top-0 z-20 w-full", isOpen ? "h-screen w-full overflow-auto" : "")}>
      <div className="block lg:!hidden">
        <div
          className="relative z-20 w-full bg-gray-100 py-6"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <div className="container mx-auto !px-4 lg:!px-0">
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <div className="relative flex">
                  <div className="h-14 w-14 before:absolute before:left-0 before:top-0 before:-z-0 before:h-full before:w-full before:rotate-6 before:rounded-md before:bg-[#e7e7e7] after:absolute after:left-0 after:top-0 after:-z-0 after:h-full after:w-full after:-rotate-6 after:rounded-md after:bg-[#e7e7e7]"></div>
                  {cart.items.length > 0 && cart.items[0] && (
                    <Thumbnail
                      className="absolute h-14 w-14"
                      rounded="md"
                      src={cart.items[0].product.thumbnail}
                      alt={cart.items[0].product.title}
                    />
                  )}
                </div>
                <div className="z-10 flex -translate-y-2 transform items-center gap-1 rounded-full border border-gray-400 bg-white px-2 py-1">
                  <span
                    children={t("shopping_cart.items", {
                      count: cart.items.length
                    })}
                  />
                  <Icon size="xs">{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</Icon>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                {cart.is_free ? (
                  <ProductPrice
                    price={0}
                    salesPrice={0}
                  />
                ) : (
                  <>
                    <Typography.Text
                      children={formatPriceWithoutCurrency(cart.total)}
                      className="font-bold"
                      size="lg"
                    />
                    <Typography.Body
                      children={currentCurrency}
                      className="font-medium text-black opacity-40"
                      size="sm"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className={classNames(
            "absolute z-10 flex w-full transform flex-col bg-white transition-all !duration-300 ease-linear",
            isOpen ? "h-[calc(100vh-138px)] translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="flex flex-col space-y-6 bg-white px-4 py-6">
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
          <div className="mt-auto border-t border-gray-400 bg-white p-4">
            <Button
              onPress={() => setIsOpen(!isOpen)}
              className="w-full"
            >
              {t("shopping_cart.checkout")}
            </Button>
            <PrivacyPolicyText />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCartItems;
