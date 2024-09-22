export * from "./commons";
export * from "./modals";

interface Payload {
  transaction_id?: string | number;
  currency: string;
  price: string | number;
  type?: string;
  title?: string;
  id?: string;
  ids?: string[];
  items: { id: string | number; name: string; category: string; quantity: number; price: number }[];
  coupon_code?: string;
  order_id?: string;
}

declare global {
  interface Window {
    APP_EVENTS: {
      PAGE_VIEW: Array<(url: string) => void>;
      ADD_TO_CART: Array<(payload: Payload) => void>;
      PURCHASE: Array<(payload: Payload) => void>;
      SIGN_UP: Array<(payload?: { email: string | null; phone: string | null }) => void>;
      LOGIN: Array<(payload?: { method: "email" | "phone"; email: string | null; phone: string | null }) => void>;
      BEGIN_CHECKOUT: Array<(payload: Payload) => void>;
      ADD_PAYMENT_INFO: Array<(payload: Payload) => void>;
    };
    order?: { [key: string]: any };
  }
}
