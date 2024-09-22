import { AnyObject } from "@/types";

export type SaveCard = {
  id: number;
  expiry_month: string;
  expiry_year: string;
  last_four: string;
  scheme: string;
};

export type Member = {
  id: number;
  name: string;
  english_name: string | null;
  type: "member" | "user";
  first_name: string;
  last_name: string;
  username: string;
  avatar: string;
  national_id: string | undefined;
  country_code: string | null;
  currency: string;
  gender: string;
  skills: any[];
  email: string;
  phone_code: number | string;
  phone: number | string;
  international_phone: string;
  dob: string;
  email_verified_at: string;
  is_affiliate_open: boolean;
  bio: string;
  education: string;
  job_title: string;
  created_at: string;
  updated_at: string;
  meta: AnyObject | null;
  saved_cards: Array<SaveCard> | undefined;
};
