import { Category, Chapter, Instructor, Page } from "@/types";

export type Course = {
  id: number;
  enrolled: boolean;
  title: string;
  slug: string;
  thumbnail: string | null;
  is_reviewed: boolean;
  summary: string;
  description: string;
  meta_keywords: string[];
  meta_description: string;
  outcomes: string[];
  requirements: string[];
  duration: number;
  price: number;
  sales_price: number;
  enrollments_count: number;
  eligible_for_certificate: boolean;
  is_started: boolean;
  in_stock: boolean;
  publish_at: string;
  updated_at: string;
  created_at: string;
  instructors?: Array<Instructor>;
  page: null | Page;
  category: Category;
  difficulty: Category | null;
  intro_video: null | {
    id: number;
    provider: "youtube" | "gumlet" | "vimeo" | "stream" | "unknown";
    provider_id: string;
    url: string;
  };
  chapters: Chapter[];
  settings: {
    reviews_enabled: boolean;
    certificate_enabled: boolean;
    early_access: boolean;
    show_enrollments_count: boolean;
    show_content_instructor: boolean;
    disable_comments: boolean;
    close_enrollments: boolean;
    resubmit_assignment: boolean;
    can_retake_exam: boolean;
    seats: number;
    limit_seats: boolean;
  };
  contents_count: number;
  avg_rating: number;
  review_count: number;
  enrollment: {
    id: number;
    completed_at: string;
    percentage_completed: number | null;
    started_at: string;
    created_at: string;
    last_viewed: null | {
      chapter_id: number;
      content_id: number;
    };
  };
  type: "course";
  course_type: "online" | "on_site";
  location: {
    address: string;
    url: string;
    building: string;
    special_mark: string;
  };
  timing: {
    from: string;
    to: string;
  };
  notification: {
    before_start: boolean;
    when_start: boolean;
    after_complete: boolean;
  };
};
