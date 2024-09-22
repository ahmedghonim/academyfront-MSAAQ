import { Bank, Member } from "@/types";

export type PaypalPayout = {
  method: string;
  paypal_email: string;
};

export type Payout = {
  id: number;
  uuid: string;
  type: "withdraw" | "deposit";
  member: Member;
  amount: number;
  method: "wire" | "paypal";
  confirmed: boolean;
  payout_details: Bank | PaypalPayout;
  receipt: {
    file_name: string;
    size: number;
    url: string;
  };
  created_at: string;
  updated_at: string;
};
