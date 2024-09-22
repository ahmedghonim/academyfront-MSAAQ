import { Product } from "@/types";

export enum OrderStatus {
  PENDING = "pending",
  ON_HOLD = "on_hold",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  PAYMENT_FAILED = "payment_failed"
}
export type Order = {
  id: number;
  uuid: string;
  payment_method: string;
  coupon_code: string;
  currency: string;
  subtotal: number;
  total: number;
  tax: number;
  tax_percentage: string;
  tax_type: string;
  discount: number;
  status: OrderStatus;
  is_paid: boolean;
  items: OrderCart[];
  transaction: Transaction;
  bank_transfer: string;
  status_text: string;
  created_at: string;
  updated_at: string;
};

export type OrderCart = {
  id: number;
  type: string;
  price: number;
  product: Product;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: number;
  uuid: string;
  type: string;
  amount: string;
  confirmed: boolean;
  meta: {
    method: string;
    balance: string;
    gateway: string;
    currency: string;
    academy_id: number;
    description: string;
    transaction: {
      id: number;
      card: [];
    };
  };
  created_at: string;
  updated_at: string;
};
