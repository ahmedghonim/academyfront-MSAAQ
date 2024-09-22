import { Appointment, Category, ContentAttachment, Course, Instructor } from "@/types";

export enum ProductType {
  DIGITAL = "digital",

  BUNDLE = "bundle",

  COACHING_SESSION = "coaching_session"
}

export type Product = {
  id: number;
  title: string;
  description: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  sales_price: number;
  quantity: number;
  type: ProductType;
  downloads_count: number;
  can_download: boolean;
  images: {
    file_name: string;
    size: number;
    url: string;
  }[];
  attachments: ContentAttachment[];
  is_reviewed: boolean;
  meta: {
    reviews_enabled: boolean;
    show_downloads_count: boolean;
    custom_url?: string;
  };
  summary: string;
  meta_keywords: string[];
  meta_description: string;
  category: Category | null;
  avg_rating: number;
  review_count: number;
  release_at: string | null;
  updated_at: string;
  created_at: string;
  items: Array<Product | Course>;
  consultants?: Array<Instructor>;
  duration: number;
  appointment?: Appointment;
  appointments_count?: number;
  products_count: number;
  courses_count: number;
};
