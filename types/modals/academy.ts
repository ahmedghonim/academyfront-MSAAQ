import { App, Language, Menu } from "@/types";

type FieldType = "text" | "number" | "phone" | "email" | "select";

interface ProfileField {
  name: string;
  type: FieldType;
  label: string;
  status: boolean;
  required: boolean;
  placeholder: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
}

export type Academy = {
  id: number;
  title: string;
  subtitle: null | string;
  logo: null | string;
  favicon: null | string;
  domain: string;
  locale: string;
  supported_locales?: Array<Language> | null;
  multi_lang_enabled: boolean;
  currency: string;
  meta_keywords: Array<string>;
  meta_description: string;
  meta_image: string;
  colors: {
    primary: string;
    headline: string;
    paragraph: string;
    secondary: string;
    "section-dark": string;
    "section-light": string;
  };
  cookies_period: number;
  font_family: null | string;
  font_body: null | string;
  links: {
    maroof: null | string;
    tiktok: null | string;
    podcast: null | string;
    twitter: null | string;
    youtube: null | string;
    facebook: null | string;
    snapchat: null | string;
    telegram: null | string;
    whatsapp: null | string;
    instagram: null | string;
    soundcloud: null | string;
  };
  meta: {
    unbranded: boolean;
    gdpr_enabled: boolean;
    gdpr_content: null | string;
    show_verified_status: boolean;
    disable_text_copy: boolean;
    disable_screenshot: boolean;
    custom_body_code: string | null;
    custom_head_code: string | null;
    custom_logged_in_code: string | null;
    custom_logged_out_code: string | null;
    enable_watermark: boolean;
  };
  nelc_compliant: boolean;
  sms_available: boolean;
  is_affiliate_open: boolean;
  is_verified: boolean;
  apps: Array<App>;
  msaaqpay_enabled: boolean;
  menus: Array<Menu>;
  tax_number: null | string;
  complete_profile_fields: Array<ProfileField>;
};
