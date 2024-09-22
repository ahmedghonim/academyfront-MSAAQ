export enum CategoryType {
  COURSE_CATEGORY = "course_category",
  COURSE_DIFFICULTY = "course_difficulty",
  POST_CATEGORY = "post_category",
  PRODUCT_CATEGORY = "product_category"
}

export type Category = {
  slug: string;
  id: number;
  name: string;
  icon: string;
  description: string;
  type: CategoryType;
};
