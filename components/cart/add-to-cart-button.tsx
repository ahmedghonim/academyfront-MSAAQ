"use client";

import React, { useEffect } from "react";

import { useTranslations } from "next-intl";

import { useCart } from "@/components/store/CartProvider";
import { useTenant } from "@/components/store/TenantProvider";
import { useFormatPrice, useResponseToastHandler, useServerAction } from "@/hooks";
import { useAppDispatch, useToast } from "@/hooks";
import { addToCartMutation } from "@/server-actions/actions/cart-actions";
import { setOpenCart } from "@/store/slices/app-slice";
import { Course, Product } from "@/types";

import { Button, Icon } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface AddToCartButtonProps {
  product?: Course | Product;
  product_id: string | number;
  product_type: "course" | "product";
  label?: string | null;
  variant?: "solid" | "outline" | "link";
  color?: "primary" | "secondary" | "warning" | "success" | "danger" | "info" | "gray" | "gradient" | undefined;
  size?: "sm" | "md";
  icon?: React.ReactElement<typeof Icon>;
  className?: string;
}

const AddToCartButton = ({
  product: providedProduct,
  product_id,
  product_type,
  size,
  icon,
  variant,
  label,
  className,
  color
}: AddToCartButtonProps) => {
  const [addToCart, { isLoading, isSuccess, data, isError, error }] = useServerAction(addToCartMutation);
  const { cart, setCart } = useCart()((state) => state);

  const { displayErrors } = useResponseToastHandler({});
  const tenant = useTenant()((state) => state.tenant);

  const { formatPlainPrice, currentCurrency } = useFormatPrice();
  const [toast] = useToast();
  const t = useTranslations();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isError && error) {
      displayErrors(error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setOpenCart(true));
      setCart(data);

      let product = providedProduct;

      if (!product) {
        product = data.items.find((item) => item.type === product_type && item.product.id === product_id)?.product;
      }

      if (!product) {
        return;
      }

      window?.APP_EVENTS?.ADD_TO_CART?.map((fun) => {
        if (!fun || !product) {
          return;
        }

        return fun({
          currency: tenant?.currency ?? currentCurrency,
          price: `${formatPlainPrice(product.price)}`,
          type: product_type,
          title: product.title,
          id: `${product_id}`,
          items: [
            {
              id: product.id,
              price: formatPlainPrice(product.price),
              quantity: 1,
              name: product.title,
              category: product.category?.name ?? ""
            }
          ]
        });
      });
    }
  }, [data, isSuccess]);

  return (
    <Button
      variant={variant ?? "solid"}
      color={color ?? "primary"}
      size={size ?? "md"}
      icon={icon}
      isLoading={isLoading}
      className={cn(isLoading && "cursor-not-allowed", className, "add-to-cart-btn")}
      onPress={async () => {
        if (cart && cart.items.find((item) => item.type === product_type && item.product.id === product_id)) {
          toast.success({
            message: t("common.product_already_in_cart")
          });

          return;
        }

        await addToCart({
          product_id,
          product_type,
          quantity: 1
        });
      }}
      children={label}
    />
  );
};

export default AddToCartButton;
