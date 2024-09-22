import { CartItem, Member, Order } from "@/types";

export type Tax = {
  percent: number;
  value: number;
  type: "included" | "excluded";
};

export enum PAYMENT_GATEWAY {
  BANK_TRANSFER = "bank-transfer",
  MSAAQ_PAY = "msaaqpay",
  PAYPAL = "paypal",
  PADDLE = "paddle",
  STRIPE = "stripe",
  TAP_PAYMENT = "tap",
  PAY_LINK = "paylink",
  MY_FATOORAH = "myfatoorah",
  TAMARA = "tamara",
  WALLET = "wallet",
  FREE = "free"
}
export type Cart = {
  count: number;
  coupon: null | string;
  order_id: null | string;
  discount: number;
  id: number;
  is_free: boolean;
  is_free_due_to_coupon: boolean;
  items: CartItem[];
  currency: string;
  subtotal: number;
  member?: Member;
  tax: Tax;
  total: number;
  uuid: string;
};
