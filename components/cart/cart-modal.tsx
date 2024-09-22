"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";

import { RemoveFromCartButton } from "@/components/cart";
import { Drawer } from "@/components/drawer";
import EmptyState from "@/components/empty-state";
import { LoadingScreen } from "@/components/loading-screen";
import { Price } from "@/components/price";
import { useCart } from "@/components/store/CartProvider";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setOpenCart } from "@/store/slices/app-slice";
import { Thumbnail } from "@/ui/images";
import { useRouter } from "@/utils/navigation";

import { ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Badge, Button, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

const CartModal = ({ showMobileToggle }: { showMobileToggle?: boolean }) => {
  const t = useTranslations();
  const router = useRouter();
  const cart = useCart()((state) => state.cart);

  const { openCartModal } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const openCart = () => dispatch(setOpenCart(true));
  const closeCart = () => dispatch(setOpenCart(false));

  const isCartEmpty = useMemo(() => {
    if (!cart) return true;

    return cart.items.length === 0;
  }, [cart]);

  return (
    <>
      {!showMobileToggle && (
        <Button
          variant="link"
          color="gray"
          size="sm"
          icon={
            <Icon className="relative">
              {!isCartEmpty && (
                <Badge
                  variant="solid"
                  color="danger"
                  rounded="full"
                  size="sm"
                  className="absolute -top-2 left-4 flex items-center justify-center text-xs"
                >
                  {cart?.items.length}
                </Badge>
              )}
              <ShoppingCartIcon />
            </Icon>
          }
          className="shopping-cart-btn hidden min-[768px]:!block"
          onPress={openCart}
        />
      )}
      {showMobileToggle && (
        <div
          onClick={openCart}
          role="button"
          className="shopping-cart-btn group relative inline-flex flex-col items-center justify-center gap-1 rounded p-1 text-center hover:bg-gray-200 md:!hidden"
        >
          <Icon className="relative">
            <ShoppingCartIcon />
            {!isCartEmpty && (
              <Badge
                variant="solid"
                color="danger"
                rounded="full"
                size="sm"
                className="absolute -top-2 left-4 flex items-center justify-center text-xs"
              >
                {cart?.items.length}
              </Badge>
            )}
          </Icon>
          <Typography.Body
            size="sm"
            className="text-[12px] font-normal text-gray-800"
          >
            {t("common.shopping_cart")}
          </Typography.Body>
        </div>
      )}
      <Drawer
        styleClass="drawer md:!rounded-t-none rounded-t-2xl"
        isOpen={openCartModal}
        onClose={closeCart}
        title={t("common.cart_title")}
        action={
          !isCartEmpty && (
            <Button
              onPress={async () => {
                await router.push("/cart/checkout");
                closeCart();
              }}
              className="w-full"
            >
              {t("common.cart_checkout")}
            </Button>
          )
        }
      >
        {!cart ? (
          <LoadingScreen />
        ) : (
          <div
            className={cn("flex h-full flex-col justify-between overflow-hidden p-4", isCartEmpty && "justify-center")}
          >
            {isCartEmpty ? (
              <EmptyState
                className="p-0"
                iconClassName="text-gray-700"
                title={t("common.cart_empty_state_title")}
                description={t("common.cart_empty_state_description")}
                icon={<ShoppingCartIcon />}
                actions={
                  <Button
                    onPress={async () => {
                      closeCart();
                      await router.push("/");
                    }}
                    className="w-full md:!w-auto"
                    children={t("common.browse_academy")}
                  />
                }
              />
            ) : (
              <>
                <div className="mb-4 flex-grow space-y-4 overflow-auto px-1">
                  {cart?.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex rounded-xl border border-gray-300"
                    >
                      <div className="w-auto p-2 md:w-full">
                        <Thumbnail
                          rounded="lg"
                          className="w-24 md:w-auto"
                          src={item.product.thumbnail}
                          alt={item.product.title}
                        />
                      </div>
                      <div className="flex w-full flex-row justify-between gap-2 py-2 pe-4 ps-2 md:!flex-col md:!items-start">
                        <div className="mb-3 flex flex-col space-y-1">
                          <Typography.Body
                            size="base"
                            className="font-medium"
                          >
                            {item.product.title}
                          </Typography.Body>
                          <Price price={item.product.price} />
                        </div>
                        <RemoveFromCartButton
                          product_id={item.product.id}
                          product_type={item.type}
                          label={t("common.remove")}
                          color="gray"
                          size="sm"
                          className="hidden md:!mt-auto md:!flex"
                          icon={
                            <Icon size="md">
                              <TrashIcon />
                            </Icon>
                          }
                        />
                        <RemoveFromCartButton
                          product_id={item.product.id}
                          product_type={item.type}
                          color="gray"
                          size="sm"
                          className="flex md:!hidden"
                          icon={
                            <Icon size="md">
                              <TrashIcon />
                            </Icon>
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mx-1 rounded-lg bg-gray-200 p-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <Typography.Body className="font-medium text-gray-800">{t("common.subtotal")}</Typography.Body>
                      <Price
                        useSymbol
                        price={cart.subtotal}
                      />
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
                  <div className="my-6 h-px bg-gray-400" />
                  <div className="flex items-center justify-between">
                    <Typography.Text
                      size="sm"
                      className="font-semibold"
                    >
                      {t("common.total")}
                    </Typography.Text>
                    <Price
                      useSymbol
                      price={cart.total}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
};

export default CartModal;
