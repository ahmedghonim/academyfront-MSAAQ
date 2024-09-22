"use client";

import { createContext, useContext, useState } from "react";

import { create } from "zustand";

import { Cart } from "@/types";

const createStore = (cart: Cart, payload: any) =>
  create<{
    cart: Cart;
    payload: any;
  }>((set) => ({
    cart,
    payload
  }));

const CartByUUIDContext = createContext<ReturnType<typeof createStore> | null>(null);

export const useCartByUUID = () => {
  if (!CartByUUIDContext) throw new Error("useCart must be used within a CartByUUIDProvider");

  return useContext(CartByUUIDContext)!;
};

const CartProvider = ({ cart, payload, children }: { payload: any; cart: Cart; children: React.ReactNode }) => {
  const [store] = useState(() => createStore(cart, payload));

  return <CartByUUIDContext.Provider value={store}>{children}</CartByUUIDContext.Provider>;
};

export default CartProvider;
