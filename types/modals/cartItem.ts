import { Course, Product } from "@/types";

export type CartItem = {
  type: "course" | "product";
  quantity: number;
  can_choose_quantity: boolean;
  total: number;
  product: Product | Course;
  meta?: any;
};
