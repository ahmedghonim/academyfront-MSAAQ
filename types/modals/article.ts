import { Category, Comment, Instructor } from "@/types";

export type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string | null;
  meta_description: string;
  meta_keywords: string[];
  updated_at: string;
  created_at: string;
  created_by: Instructor;
  comments: Comment[];
  taxonomies: Category[];
  published_at: string;
};
