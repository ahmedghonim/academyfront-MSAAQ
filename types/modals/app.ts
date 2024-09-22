import { Bank } from "@/types";

export enum AppSlug {
  Stripe = "stripe",
  Paddle = "paddle",
  Msaaqpay = "msaaqpay",
  Paylink = "paylink",
  Myfatoorah = "myfatoorah",
  Tap = "tap",
  PayPal = "paypal",
  Tamara = "tamara",
  BankTransfer = "bank-transfer",
  GoogleAnalytics = "google-analytics",
  GoogleTagManager = "google-tag-manager",
  FacebookPixel = "facebook-pixel",
  SnapchatPixel = "snapchat-pixel",
  TiktokPixel = "tiktok-pixel",
  Linkaraby = "linkaraby",
  Any = ""
}

export type TiktokPixelApp = {
  tracking_id: string;
};
export type GoogleAnalyticsApp = {
  tracking_id: string;
};

export type GoogleTagManagerApp = {
  tracking_id: string;
};

export type FacebookPixelApp = {
  tracking_id: string;
};

export type SnapchatPixelApp = {
  tracking_id: string;
};

export type LinkarabyApp = {
  account_id: string;
};

export type StripeApp = {
  publishable_key: string;
};

export type PaddleApp = {
  sandbox: boolean;
  currency: string;
  vendor_id: number;
  public_key: string;
};

export type MsaaqpayApp = {
  gateways: string[];
  public_key: string;
  google_pay_merchant_id: string;
  currencies: Array<{
    id: number;
    code: string;
    symbol: string;
    name: string;
    rate: number;
    country_code: string;
  }>;
  vat_applicable: boolean;
};

export type PayPalApp = {
  sandbox: boolean;
  client_id: string;
};

export type TamaraApp = {
  sandbox: boolean;
  public_key: string;
};

export type MyfatoorahApp = {
  methods: Array<{
    id: number;
    logo: string;
    name_ar: string;
    name_en: string;
  }>;
};
export type TapPaymentsApp = {
  publishable_key: string;
};
export type BankTransferApp = {
  banks: Bank[];
};

export type App<T extends AppSlug = AppSlug.Any> = {
  id: number;
  title: string;
  slug: AppSlug;
  body_code: string | null;
  head_code: string | null;
  category: string;
} & (T extends AppSlug.Stripe
  ? StripeApp
  : T extends AppSlug.Paddle
  ? PaddleApp
  : T extends AppSlug.Msaaqpay
  ? MsaaqpayApp
  : T extends AppSlug.PayPal
  ? PayPalApp
  : T extends AppSlug.Tamara
  ? TamaraApp
  : T extends AppSlug.BankTransfer
  ? BankTransferApp
  : T extends AppSlug.Myfatoorah
  ? MyfatoorahApp
  : T extends AppSlug.Tap
  ? TapPaymentsApp
  : T extends AppSlug.GoogleAnalytics
  ? GoogleAnalyticsApp
  : T extends AppSlug.GoogleTagManager
  ? GoogleTagManagerApp
  : T extends AppSlug.FacebookPixel
  ? FacebookPixelApp
  : T extends AppSlug.SnapchatPixel
  ? SnapchatPixelApp
  : T extends AppSlug.Linkaraby
  ? LinkarabyApp
  : T extends AppSlug.TiktokPixel
  ? TiktokPixelApp
  : {});
