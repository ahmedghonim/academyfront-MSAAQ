import { Comment, Member } from "@/types";

export type Review = {
  id: number;
  title: string | null;
  content: string;
  rating: number;
  user: Member | null;
  updated_at: string;
  created_at: string;
  status?: string;
  replies: Comment[];
  message?: {
    title: string;
    body: string;
  };
};

export type ReviewDistribution = {
  status: string;
  data: {
    reviews: ReviewsAverage[];
    average: number;
    total: number;
  };
};

export type ReviewsAverage = {
  rating: number;
  aggregate: number;
};
